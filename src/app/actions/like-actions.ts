'use server';

import { createClient } from '@/lib/supabase/server';
import { getBytes, hashMessage, recoverAddress } from 'ethers';

type SignedLikeMessage = {
  action: string;
  commentId: number;
  operation: 'like' | 'unlike';
  timestamp: string;
  account: string;
};

const verifySignature = (
  messageStr: string,
  signature: string
): string | null => {
  try {
    // Validate the message format
    JSON.parse(messageStr);
    const hash = hashMessage(messageStr);
    const digest = getBytes(hash);
    return recoverAddress(digest, signature);
  } catch {
    return null;
  }
};

export async function toggleLike(
  commentId: number,
  operation: 'like' | 'unlike',
  signature: string,
  messageStr?: string
) {
  try {
    const supabase = await createClient();

    let walletAddress = null;

    if (signature && messageStr) {
      walletAddress = verifySignature(messageStr, signature);

      if (walletAddress) {
        const message = JSON.parse(messageStr) as SignedLikeMessage;

        if (walletAddress.toLowerCase() !== message.account) {
          walletAddress = null;
        }
      }
    }

    if (!walletAddress) {
      return {
        success: false,
        error: 'Invalid signature',
      };
    }

    // Get current upvotes
    const { data: comment, error: fetchError } = await supabase
      .from('comments')
      .select('upvotes')
      .eq('id', commentId)
      .single();
    
    if (fetchError) {
      return { 
        success: false, 
        error: `Failed to fetch comment: ${fetchError.message}` 
      };
    }
    
    // Calculate new upvotes count
    const currentUpvotes = comment?.upvotes || 0;
    const newUpvotes = operation === 'like' ? currentUpvotes + 1 : Math.max(0, currentUpvotes - 1);
    
    // Update the upvotes count
    const { error: updateError } = await supabase
      .from('comments')
      .update({ upvotes: newUpvotes })
      .eq('id', commentId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, upvotes: newUpvotes };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return { success: false, error: `Failed to toggle like: ${errorMessage}` };
  }
} 