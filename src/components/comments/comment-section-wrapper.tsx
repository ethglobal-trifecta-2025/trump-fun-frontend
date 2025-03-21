'use client';

import { Comment } from '@/types/database.types';
import CommentSection from './comment-section';

interface CommentSectionWrapperProps {
  poolId: string;
  initialComments: Comment[];
}

export default function CommentSectionWrapper({
  poolId,
  initialComments,
}: CommentSectionWrapperProps) {
  return <CommentSection poolId={poolId} initialComments={initialComments} />;
}
