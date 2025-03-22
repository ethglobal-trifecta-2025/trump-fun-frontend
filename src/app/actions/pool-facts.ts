'use server';

import { createClient } from '@/lib/supabase/server';
import { getBytes, hashMessage, recoverAddress } from 'ethers';

type SignedPoolFactsMessage = {
  action: string;
  poolId: string;
  operation: 'like' | 'unlike';
  timestamp: string;
  account: string;
};

const verifySignature = (messageStr: string, signature: string): string | null => {
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

/**
 * Server action to toggle FACTS (likes) on a pool
 *
 * @param poolId - The ID of the pool to toggle FACTS for
 * @param operation - Whether to like or unlike
 * @param signature - The signature from the user
 * @param messageStr - The message string that was signed
 * @returns Object with success status and updated facts count
 */
export async function togglePoolFacts(
  poolId: string,
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
        const message = JSON.parse(messageStr) as SignedPoolFactsMessage;

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

    const user_id = walletAddress.toLowerCase();

    // Check if user has already liked this pool
    const { data: existingFact } = await supabase
      .from('facts')
      .select('id')
      .eq('pool_id', poolId)
      .eq('user_id', user_id)
      .is('comment_id', null) // Makes sure we're checking pool FACTS not comment FACTS
      .single();

    console.log('Existing fact:', existingFact, 'Operation:', operation);

    if (operation === 'like' && !existingFact) {
      // Add a FACT record
      const { error: insertError } = await supabase.from('facts').insert({
        pool_id: poolId,
        user_id: user_id,
        comment_id: null, // null means this FACT is for the pool, not a comment
      });

      if (insertError) {
        console.error('Error inserting FACT:', insertError);
        return {
          success: false,
          error: `Failed to add FACT: ${insertError.message}`,
        };
      }
    } else if (operation === 'unlike' && existingFact) {
      // Remove the FACT record
      const { error: deleteError } = await supabase
        .from('facts')
        .delete()
        .eq('pool_id', poolId)
        .eq('user_id', user_id)
        .is('comment_id', null);

      if (deleteError) {
        console.error('Error deleting FACT:', deleteError);
        return {
          success: false,
          error: `Failed to remove FACT: ${deleteError.message}`,
        };
      }
    }

    // Get updated count
    const { count, error: countError } = await supabase
      .from('facts')
      .select('*', { count: 'exact', head: true })
      .eq('pool_id', poolId)
      .is('comment_id', null);

    if (countError) {
      console.error('Error getting FACTS count:', countError);
    }

    return {
      success: true,
      facts: count || 0,
      liked: operation === 'like',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in togglePoolFacts:', errorMessage);
    return {
      success: false,
      error: `Failed to toggle pool FACTS: ${errorMessage}`,
    };
  }
}
