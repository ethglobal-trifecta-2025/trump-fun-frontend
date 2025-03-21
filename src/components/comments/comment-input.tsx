'use client';

import { Button } from '@/components/ui/button';

import { useState } from 'react';

import { RandomAvatar } from 'react-random-avatars';

interface CommentInputProps {
  onCommentSubmit: (content: string) => void;

  isWalletConnected: boolean;
}

const CommentInput = ({
  onCommentSubmit,

  isWalletConnected,
}: CommentInputProps) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    onCommentSubmit(newComment);

    setNewComment('');
  };

  return (
    <form onSubmit={handleSubmit} className='mb-6'>
      <div className='flex gap-4'>
        <div className='relative h-10 w-10 overflow-hidden rounded-full'>
          <RandomAvatar />
        </div>

        <div className='flex flex-1 flex-col gap-2'>
          <textarea
            placeholder={
              isWalletConnected ? 'Add a comment...' : 'Sign in to comment...'
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className='min-h-[80px] w-full rounded-md border p-3 dark:bg-gray-800'
          />

          <div className='flex justify-end'>
            <Button type='submit' disabled={!newComment.trim()}>
              {isWalletConnected ? 'Comment' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentInput;
