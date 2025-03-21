'use client';

import { Comment } from '@/types/database.types';

import CommentItem from './comment-item';

interface CommentListProps {
  comments: Comment[];
}

const CommentList = ({ comments }: CommentListProps) => {
  return (
    <div className='space-y-6'>
      {comments &&
        comments?.length > 0 &&
        comments?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}

      {comments && comments?.length === 0 && (
        <div className='py-8 text-center text-gray-500'>
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};

export default CommentList;
