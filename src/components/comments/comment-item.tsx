'use client';

import { RandomAvatar } from 'react-random-avatars';

import { Database } from '../../types/database.types';

import { formatDate } from '@/utils/formatDate';

interface CommentItemProps {
  comment: Database['public']['Tables']['comments']['Row'];
}

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className='border-b pb-4 last:border-0'>
      <div className='flex gap-3'>
        <div className='relative h-10 w-10 overflow-hidden rounded-full'>
          <RandomAvatar size={40} name={comment.user_address} />
        </div>

        <div className='flex-1'>
          <div className='mb-1 flex items-center gap-2'>
            <span className='font-medium'>{comment.user_address}</span>

            <span className='text-sm text-gray-500'>
              {formatDate(comment.created_at)}
            </span>
          </div>

          <p className='mb-3'>{comment.body}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
