import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TruthSocial({ postId }: { postId: string }) {
  return (
    <Link href={`https://truthsocial.com/@realDonaldTrump/posts/${postId}`} target='_blank'>
      <Image src='/truth-social.png' alt='Truth Social' width={20} height={20} />
    </Link>
  );
}
