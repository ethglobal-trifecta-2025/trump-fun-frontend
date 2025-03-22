import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { commentId, action, userId } = await request.json();

    if (!commentId || !['like', 'unlike'].includes(action) || !userId) {
      return Response.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const supabase = await createClient();

    // First, get the pool_id for this comment
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .select('pool_id')
      .eq('id', commentId)
      .single();

    if (commentError) {
      console.error('Error fetching comment:', commentError);
      return Response.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Check if user has already liked this comment
    const { data: existingFact, error: existingError } = await supabase
      .from('facts')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking if user liked comment:', existingError);
    }

    if (action === 'like' && !existingFact) {
      // Add a FACT
      const { error: insertError } = await supabase.from('facts').insert({
        comment_id: commentId,
        user_id: userId,
        pool_id: comment.pool_id,
      });

      if (insertError) {
        console.error('Error adding like:', insertError);
        return Response.json({ error: 'Failed to add like' }, { status: 500 });
      }

      // Use the RPC function to increment the upvotes count
      const { error: rpcError } = await supabase.rpc('increment_comment_upvotes', {
        comment_id: commentId,
      });

      if (rpcError) {
        console.error('Error incrementing upvotes:', rpcError);
      }
    } else if (action === 'unlike' && existingFact) {
      // Remove the FACT
      const { error: deleteError } = await supabase
        .from('facts')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
        return Response.json({ error: 'Failed to remove like' }, { status: 500 });
      }

      // Use the RPC function to decrement the upvotes count
      const { error: rpcError } = await supabase.rpc('decrement_comment_upvotes', {
        comment_id: commentId,
      });

      if (rpcError) {
        console.error('Error decrementing upvotes:', rpcError);
      }
    }

    // Get updated upvotes count
    const { data: updatedComment, error: updateError } = await supabase
      .from('comments')
      .select('upvotes')
      .eq('id', commentId)
      .single();

    if (updateError) {
      console.error('Error getting updated upvotes:', updateError);
      return Response.json({ error: 'Failed to get updated upvotes' }, { status: 500 });
    }

    return Response.json(
      {
        success: true,
        upvotes: updatedComment?.upvotes || 0,
        liked: action === 'like',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing like:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
