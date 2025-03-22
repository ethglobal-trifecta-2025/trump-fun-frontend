'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import CommentList from './comment-list';

import CommentInput from './comment-input';

import { addComment } from '@/app/actions/comment-actions';

import { useSignMessage, useWallets, usePrivy } from '@privy-io/react-auth';

import { Comment } from '@/types';

interface CommentSectionProps {
  poolId: string;

  initialComments: Comment[];
  isLoading: boolean;
  error: Error | null;
}

type MessageToSign = {
  action: string;

  poolId: string;

  content: string;

  timestamp: string;

  account: string;
};

export default function CommentSection({
  poolId,

  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const { wallets } = useWallets();

  const { login, authenticated } = usePrivy();

  const { signMessage } = useSignMessage();

  const isWalletConnected = authenticated && wallets && wallets.length > 0 && wallets[0]?.address;

  const handleLoginClick = () => login();

  const handleCommentSubmit = async (content: string) => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const wallet = wallets?.[0];

      if (!wallet || !wallet.address) {
        console.warn('Please connect a wallet to comment');
        setIsSubmitting(false);

        if (!authenticated) {
          handleLoginClick();
        }
        return;
      }

      const messageObj: MessageToSign = {
        action: 'add_comment',

        poolId,

        content,

        timestamp: new Date().toISOString(),

        account: wallet.address.toLowerCase(),
      };

      const messageStr = JSON.stringify(messageObj);

      try {
        const { signature } = await signMessage(
          { message: messageStr },

          {
            uiOptions: {
              title: 'Sign your comment',

              description: 'Sign this message to verify you are the author of this comment',

              buttonText: 'Sign Comment',
            },

            address: wallet.address,
          }
        );

        const tempComment: Comment = {
          body: content,

          pool_id: poolId,

          signature,

          user_address: wallet.address,

          created_at: new Date().toISOString(),

          id: Date.now(),

          updated_at: null,

          commentID: null,

          upvotes: null,
        };

        if (!tempComment || !comments) {
          console.error('Failed to create temporary comment. Please try again.');
          setIsSubmitting(false);
          return;
        }

        setComments([tempComment, ...comments]);

        const result = await addComment(poolId, content, signature, messageStr);

        if (result.success) {
          router.refresh();
        } else {
          console.error('Failed to add comment:', result.error);
        }
      } catch (signError) {
        console.error('Signing error:', signError);
      }
    } catch (error) {
      console.error(
        `Error: ${
          error instanceof Error
            ? error.message
            : 'Unknown error occurred during comment submission.'
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleFactsClick = () => {
  //   if (!isWalletConnected) {
  //     handleLoginClick();
  //     return;
  //   }

  //   handleCommentSubmit('FACTS 🦅');
  // };

  return (
    <div>
      <h2 className='mb-4 text-xl font-bold'>Comments</h2>

      <CommentInput
        onCommentSubmit={isWalletConnected ? handleCommentSubmit : handleLoginClick}
        isWalletConnected={Boolean(isWalletConnected)}
      />

      <CommentList comments={comments} />
    </div>
  );
}
