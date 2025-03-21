'use client';

import { Comment } from '@/types';
import CommentSection from './comment-section';

interface CommentSectionWrapperProps {
  poolId: string;
  initialComments: Comment[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function CommentSectionWrapper({
  poolId,
  initialComments,
  isLoading = false,
  error = null,
}: CommentSectionWrapperProps) {
  return (
    <CommentSection
      poolId={poolId}
      initialComments={initialComments}
      isLoading={isLoading}
      error={error}
    />
  );
}
