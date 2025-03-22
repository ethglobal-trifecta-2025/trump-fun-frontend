'use client';

import { toggleLike } from '@/app/actions/like-actions';
import { isCommentLiked, saveCommentLike } from '@/app/pool-actions';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatDate';
import { usePrivy, useSignMessage, useWallets } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { RandomAvatar } from 'react-random-avatars';
import { Database } from '../../types/database.types';

interface CommentItemProps {
  comment: Database['public']['Tables']['comments']['Row'];
}

const CommentItem = ({ comment }: CommentItemProps) => {
  // Ensure we have a valid comment object
  if (!comment || !comment.id) {
    return null;
  }

  const [upvotes, setUpvotes] = useState<number>(comment.upvotes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { signMessage } = useSignMessage();

  const isWalletConnected = authenticated && wallets && wallets.length > 0 && wallets[0]?.address;

  // Check localStorage when component mounts to see if this comment was liked before
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wasLiked = isCommentLiked(comment.id);
      setIsLiked(wasLiked);
    }
  }, [comment.id]);

  const handleLike = async () => {
    if (!isWalletConnected) {
      login();
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const wallet = wallets?.[0];

      if (!wallet || !wallet.address) {
        setIsSubmitting(false);
        return;
      }

      // Optimistic update
      const newIsLiked = !isLiked;
      const newUpvotes = newIsLiked ? upvotes + 1 : Math.max(0, upvotes - 1);

      setIsLiked(newIsLiked);
      setUpvotes(newUpvotes);

      // Update localStorage to persist the like
      saveCommentLike(comment.id, newIsLiked);

      const messageObj = {
        action: 'toggle_like',
        commentId: comment.id,
        operation: newIsLiked ? 'like' : 'unlike',
        timestamp: new Date().toISOString(),
        account: wallet.address.toLowerCase(),
      };

      const messageStr = JSON.stringify(messageObj);

      const { signature } = await signMessage(
        { message: messageStr },
        {
          uiOptions: {
            title: newIsLiked ? 'Sign to FACTS' : 'Sign to remove FACTS',
            description: 'Sign this message to verify your action',
            buttonText: 'Sign',
          },
          address: wallet.address,
        }
      );

      // No need to await this call to avoid UI freezing
      toggleLike(comment.id, newIsLiked ? 'like' : 'unlike', signature, messageStr)
        .then((result) => {
          if (!result.success) {
            // Revert optimistic update on error
            setIsLiked(!newIsLiked);
            setUpvotes(newIsLiked ? upvotes - 1 : upvotes + 1);
            // Also update localStorage to revert
            saveCommentLike(comment.id, !newIsLiked);
          }
        })
        .catch(() => {
          // Silently handle errors after optimistic update
        });
    } catch (error) {
      // Revert optimistic update on error
      const revertedLiked = !isLiked;
      setIsLiked(revertedLiked);
      setUpvotes(revertedLiked ? upvotes + 1 : upvotes - 1);
      saveCommentLike(comment.id, revertedLiked);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='border-b pb-4 last:border-0'>
      <div className='flex gap-3'>
        <div className='relative h-10 w-10 overflow-hidden rounded-full'>
          <RandomAvatar size={40} name={comment.user_address} />
        </div>

        <div className='flex-1'>
          <div className='mb-1 flex items-center gap-2'>
            <span className='font-medium'>
              {comment.user_address.slice(0, 6)}...{comment.user_address.slice(-4)}
            </span>

            <span className='text-sm text-gray-500'>{formatDate(comment.created_at)}</span>
          </div>

          <p className='mb-3'>{comment.body}</p>

          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='h-9 gap-2 px-3 text-orange-500 hover:text-orange-500 focus:text-orange-500 active:text-orange-500'
              onClick={handleLike}
              disabled={isSubmitting}
            >
              <span className='font-bold'>FACTS</span>
              {isLiked && <span className='ml-1.5'>🦅</span>}
              <span className='ml-1.5'>{upvotes}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
