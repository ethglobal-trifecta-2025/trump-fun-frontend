'use server';

import { createClient } from '@/lib/supabase/server';

import { getBytes, hashMessage, recoverAddress } from 'ethers';

import { Database } from '../../types/database.types';

type SignedMessage = {
  action: string;

  poolId: string;

  content: string;

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

export async function addComment(
  poolId: string,

  content: string,

  signature: string,

  messageStr?: string
) {
  try {
    const supabase = await createClient();

    let walletAddress = null;

    if (signature && messageStr) {
      walletAddress = verifySignature(messageStr, signature);

      if (walletAddress) {
        const message = JSON.parse(messageStr) as SignedMessage;

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

    const comment: Database['public']['Tables']['comments']['Insert'] = {
      body: content,

      pool_id: poolId,

      signature: signature,

      user_address: walletAddress?.toLowerCase(),

      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('comments').insert(comment);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return { success: false, error: `Failed to add comment: ${errorMessage}` };
  }
}
