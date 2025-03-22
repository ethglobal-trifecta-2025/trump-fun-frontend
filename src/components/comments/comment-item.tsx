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
  }, [comment.id, authenticated]);

  if (!comment || !comment.id) {
    return null;
  }

  const handleLike = async () => {
    if (!isWalletConnected) {
      login();
      return;
    }

    if (isSubmitting) return;

    console.log('Starting like process for comment:', comment.id);
    console.log('Current state:', { isLiked, upvotes });

    setIsSubmitting(true);

    try {
      const wallet = wallets?.[0];

      if (!wallet || !wallet.address) {
        console.log('No wallet connected');
        setIsSubmitting(false);
        return;
      }

      // Determine action without updating state yet
      const newIsLiked = !isLiked;
      console.log('New like state will be:', newIsLiked);

      // Calculate the correct upvote count based on the current state
      // and whether the user is liking or unliking
      let newUpvotes = upvotes;
      if (newIsLiked) {
        // If user is liking and wasn't liked before
        newUpvotes = upvotes + 1;
      } else {
        // If user is unliking and was liked before
        newUpvotes = Math.max(0, upvotes - 1);
      }
      console.log('Calculated new upvotes:', newUpvotes);

      const messageObj = {
        action: 'toggle_like',
        commentId: comment.id,
        operation: newIsLiked ? 'like' : 'unlike',
        timestamp: new Date().toISOString(),
        account: wallet.address.toLowerCase(),
      };

      const messageStr = JSON.stringify(messageObj);
      console.log('Prepared message for signing:', messageObj);

      console.log('Requesting signature...');
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
      console.log('Signature received');

      // Call API first to ensure the data is saved
      console.log('Calling toggleLike...');
      const result = await toggleLike(
        comment.id,
        newIsLiked ? 'like' : 'unlike',
        signature,
        messageStr
      );
      console.log('Server response:', result);

      if (result.success) {
        console.log('Update successful, updating UI');
        setIsLiked(newIsLiked);
        setUpvotes(result.upvotes ?? newUpvotes);

        // Update localStorage after successful server update
        saveCommentLike(comment.id, newIsLiked);

        console.log('Final state:', {
          isLiked: newIsLiked,
          upvotes: result.upvotes ?? newUpvotes,
        });
      } else {
        console.error('Error toggling comment like:', result.error);
      }
    } catch (error) {
      // Only log errors that aren't user rejections
      if (
        error instanceof Error &&
        !error.message.includes('rejected') &&
        !error.message.includes('cancel') &&
        !error.message.includes('user rejected')
      ) {
        console.error('Error handling comment FACTS:', error);
      } else {
        console.log('User rejected the signature request');
      }
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
              className={`h-9 gap-2 px-3 ${
                isLiked
                  ? 'font-bold text-orange-500 hover:text-orange-600'
                  : 'text-orange-500 hover:text-orange-500 focus:text-orange-500 active:text-orange-500'
              }`}
              onClick={handleLike}
              disabled={isSubmitting}
            >
              <span>FACTS</span>
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
