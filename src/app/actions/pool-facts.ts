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
 * IMPORTANT: This requires the Supabase 'pool_facts' table to be created with:
 * - id (primary key)
 * - pool_id (string)
 * - user_address (string)
 * - created_at (timestamp)
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

    // Check if user has already liked this pool
    const { data: existingLike } = await supabase
      .from('pool_facts')
      .select('id')
      .eq('pool_id', poolId)
      .eq('user_address', walletAddress.toLowerCase())
      .single();

    if (operation === 'like' && !existingLike) {
      // Add a like record
      await supabase.from('pool_facts').insert({
        pool_id: poolId,
        user_address: walletAddress.toLowerCase(),
        created_at: new Date().toISOString(),
      });
    } else if (operation === 'unlike' && existingLike) {
      // Remove the like record
      await supabase.from('pool_facts').delete().match({
        pool_id: poolId,
        user_address: walletAddress.toLowerCase(),
      });
    }

    // Get updated count
    const { count } = await supabase
      .from('pool_facts')
      .select('*', { count: 'exact', head: true })
      .eq('pool_id', poolId);

    return {
      success: true,
      facts: count || 0,
      liked: operation === 'like',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to toggle pool FACTS: ${errorMessage}`,
    };
  }
}
