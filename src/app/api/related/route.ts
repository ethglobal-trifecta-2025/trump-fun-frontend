import { Pool_OrderBy, PoolStatus, OrderDirection, Pool } from '@/lib/__generated__/graphql';
import { GET_POOLS } from '@/server/queries';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI();

export const GET = async (request: NextRequest) => {
  try {
    const question = request.nextUrl.searchParams.get('question');
    if (!question) {
      return NextResponse.json({ error: 'Missing "question" parameter' }, { status: 400 });
    }

    // Validate environment variables
    const indexerUrl = process.env.NEXT_PUBLIC_INDEXER_URL;
    const indexerApiKey = process.env.NEXT_PUBLIC_INDEXER_API_KEY;
    if (!indexerUrl || !indexerApiKey) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    // Apollo Client setup
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

    // Fetch only necessary data
    const { data } = await apolloClient.query({
      query: GET_POOLS,
      variables: {
        filter: {
          status: PoolStatus.Pending,
        },
        orderBy: Pool_OrderBy.CreatedAt,
        orderDirection: OrderDirection.Desc,
        first: 20,
      },
    });

    if (!data || !data.pools) {
      return NextResponse.json({ error: 'No pools found' }, { status: 404 });
    }

    // Prepare a concise prompt for OpenAI
    const poolSummaries = data.pools
      .map((pool: Pool) => `ID: ${pool.id}, Question: ${pool.question}`)
      .join('\n');
    const prompt = `The user is currently viewing a pool with the question: "${question}".\n\nHere are 10 pools with their IDs and questions:\n${poolSummaries}\n\nBased on similar characteristics (e.g., question), provide an array of 5 pool IDs that are most closely related to this pool.\n\nReturn the results in a JSON array format like this:\n["pool_id_1", "pool_id_2", "pool_id_3", "pool_id_4", "pool_id_5"]`;

    // OpenAI API call
    const completion = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      return NextResponse.json({ error: 'Failed to generate completion' }, { status: 500 });
    }

    // Parse and return the response
    const relatedPoolIds = JSON.parse(responseContent);

    const relatedPools = await apolloClient.query({
      query: GET_POOLS,
      variables: {
        filter: {
          id_in: relatedPoolIds,
        },
        orderBy: Pool_OrderBy.CreatedAt,
        orderDirection: OrderDirection.Desc,
        first: 5,
      },
    });

    if (!relatedPools || !relatedPools.data || !relatedPools.data.pools) {
      return NextResponse.json({ error: 'No related pools found' }, { status: 404 });
    }

    return NextResponse.json({
      relatedPools,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
