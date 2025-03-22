import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { commentId, action } = await request.json();

    if (!commentId || !['like', 'unlike'].includes(action)) {
      return Response.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const supabase = await createClient();

    // Get current upvotes
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('upvotes')
      .eq('id', commentId)
      .single();

    if (fetchError) {
      console.error('Error fetching comment:', fetchError);
      return Response.json({ error: 'Failed to fetch comment' }, { status: 500 });
    }

    // Calculate new upvotes count
    const currentUpvotes = comment?.upvotes || 0;
    const newUpvotes = action === 'like' ? currentUpvotes + 1 : Math.max(0, currentUpvotes - 1);

    // Update the upvotes count
    const { error: updateError } = await supabase
      .from('comments')
      .update({ upvotes: newUpvotes })
      .eq('id', commentId);

    if (updateError) {
      console.error('Error updating upvotes:', updateError);
      return Response.json({ error: 'Failed to update likes' }, { status: 500 });
    }

    return Response.json({ success: true, upvotes: newUpvotes }, { status: 200 });
  } catch (error) {
    console.error('Error processing like:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
