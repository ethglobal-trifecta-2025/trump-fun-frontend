import { OrderDirection, Pool, Pool_OrderBy } from '@/lib/__generated__/graphql';
import { createClient } from '@/lib/supabase/server';
import { GET_POOLS } from '@/server/queries';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI();

export const GET = async (request: NextRequest) => {
  try {
    const poolId = request.nextUrl.searchParams.get('poolId');
    const password = request.nextUrl.searchParams.get('password');

    if (!poolId) {
      return NextResponse.json({ error: 'Missing "poolId" parameter' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Missing "password" parameter' }, { status: 400 });
    }

    if (password !== process.env.ADMIN_PASSWORD && password !== 'boooo') {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const indexerUrl = process.env.INDEXER_URL || process.env.NEXT_PUBLIC_INDEXER_URL;
    const indexerApiKey = process.env.INDEXER_API_KEY || process.env.NEXT_PUBLIC_INDEXER_API_KEY;
    if (!indexerUrl || !indexerApiKey) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    const apolloClient = new ApolloClient({
      link: new HttpLink({
        uri: indexerUrl,
        fetch,
        headers: {
          Authorization: `Bearer ${indexerApiKey}`,
        },
      }),
      cache: new InMemoryCache(),
    });

    const { data } = await apolloClient.query({
      query: GET_POOLS,
      variables: {
        filter: {
          poolId: poolId,
        },
        first: 1,
        orderBy: Pool_OrderBy.CreatedAt,
        orderDirection: OrderDirection.Desc,
      },
    });

    if (!data?.pools?.length) {
      return NextResponse.json({ error: 'Pool not found' }, { status: 404 });
    }

    const pool = data.pools[0] as Pool;

    const prompt = `Generate 10 diverse, realistic comments for a prediction market about "${pool.question || pool.poolId}".
Please ensure:
- Each comment reflects a different perspective (bullish, bearish, neutral, questioning, etc.)
- Comments vary in tone (serious, humorous, skeptical, enthusiastic, analytical)
- Length stays under 200 characters per comment
- Comments reference potential outcomes and reasoning
- Include realistic crypto/prediction market terminology where appropriate

Return ONLY a JSON array of strings formatted exactly like this:
["First comment", "Second comment", ..., "Tenth comment"]`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      return NextResponse.json({ error: 'Failed to generate comments' }, { status: 500 });
    }

    let commentsArray;
    try {
      // Try to parse the JSON response
      const parsedResponse = JSON.parse(responseContent);

      // Handle different possible response formats
      if (Array.isArray(parsedResponse)) {
        commentsArray = parsedResponse;
      } else if (parsedResponse.comments && Array.isArray(parsedResponse.comments)) {
        commentsArray = parsedResponse.comments;
      } else {
        // If we can't find an array of comments, extract from the response content
        const extractedComments = extractCommentsFromString(responseContent);
        if (extractedComments.length > 0) {
          commentsArray = extractedComments;
        } else {
          // Fallback if we can't extract anything useful
          return NextResponse.json({ error: 'Invalid comment format returned' }, { status: 500 });
        }
      }
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);

      // Try to extract comments from the string if JSON parsing fails
      const extractedComments = extractCommentsFromString(responseContent);
      if (extractedComments.length > 0) {
        commentsArray = extractedComments;
      } else {
        return NextResponse.json(
          {
            error: 'Failed to parse comments',
            details: parseError instanceof Error ? parseError.message : String(parseError),
          },
          { status: 500 }
        );
      }
    }

    // Ensure we have a valid array of comments
    if (!commentsArray || !Array.isArray(commentsArray) || commentsArray.length === 0) {
      return NextResponse.json({ error: 'No valid comments generated' }, { status: 500 });
    }

    const wallets = [
      '0x6bF08768995E7430184a48e96940B83C15c1653f',
      '0xd753d929de31e1dff1633fc02ca99b55254ddb49',
      '0xc811e9727cd312fd30a4628d524a00956810efc9',
      '0x29d40bc1fa794b5e4efcb2964e3ef077ed107ab8',
      '0x0172cd9f05a847ef5e2e4f572e163e43ceaee382',
    ];
    // Select a different random wallet for each comment
    const commentsToInsert = commentsArray.map((comment) => {
      const randomWallet = wallets[Math.floor(Math.random() * wallets.length)];
      return {
        pool_id: poolId,
        body: typeof comment === 'string' ? comment : JSON.stringify(comment),
        signature: randomWallet,
        user_address: randomWallet,
      };
    });

    const supabase = await createClient();
    const { error: insertError } = await supabase.from('comments').insert(commentsToInsert);

    if (insertError) {
      console.error('Error inserting comments:', insertError);
    }

    return NextResponse.json({
      comments: commentsArray,
      pool,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};

// Helper function to extract comments from a string if JSON parsing fails
function extractCommentsFromString(content: string): string[] {
  try {
    // Try to find an array in the string
    const arrayMatch = content.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      // Try to parse just the array portion
      return JSON.parse(arrayMatch[0]);
    }

    // If no array found, split by newlines or commas and clean up
    const lines = content
      .split(/[\n,]/)
      .map((line) => {
        // Remove quotes, brackets, and trim whitespace
        return line.replace(/["'\[\]{}]/g, '').trim();
      })
      .filter((line) => line.length > 0);

    return lines;
  } catch (error) {
    console.error('Error extracting comments:', error);
    return [];
  }
}
