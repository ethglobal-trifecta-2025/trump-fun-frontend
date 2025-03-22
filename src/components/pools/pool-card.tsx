'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenType, useTokenContext } from '@/hooks/useTokenContext';
import { Pool } from '@/lib/__generated__/graphql';
import { calculateVolume } from '@/utils/betsInfo';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import TruthSocial from '../common/truth-social';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function PoolCard({ pool }: { pool: Pool }) {
  const { tokenType } = useTokenContext();

  const totalPoints = pool.pointsBetTotals.reduce(
    (sum, points) => sum + BigInt(points || '0'),
    BigInt(0)
  );
  const totalUsdc = pool.usdcBetTotals.reduce((sum, usdc) => sum + BigInt(usdc || '0'), BigInt(0));

  const pointsPercentages =
    totalPoints > BigInt(0)
      ? pool.pointsBetTotals.map((points) =>
          Number((BigInt(points || '0') * BigInt(100)) / totalPoints)
        )
      : pool.options.map(() => 0);

  const usdcPercentages =
    totalUsdc > BigInt(0)
      ? pool.usdcBetTotals.map((usdc) => Number((BigInt(usdc || '0') * BigInt(100)) / totalUsdc))
      : pool.options.map(() => 0);

  const percentages = pool.options.map((_, index) => {
    if (tokenType === TokenType.POINTS && totalPoints > BigInt(0)) {
      return pointsPercentages[index];
    } else if (tokenType === TokenType.USDC && totalUsdc > BigInt(0)) {
      return usdcPercentages[index];
    } else if (totalPoints > BigInt(0) && totalUsdc > BigInt(0)) {
      return Math.round((pointsPercentages[index] + usdcPercentages[index]) / 2);
    } else if (totalPoints > BigInt(0)) {
      return pointsPercentages[index];
    } else if (totalUsdc > BigInt(0)) {
      return usdcPercentages[index];
    } else {
      return 0;
    }
  });

  const closeDate = new Date(Number(pool.betsCloseAt) * 1000).toLocaleDateString();

  // const getBadgeVariant = () => {
  //   switch (pool.status) {
  //     case PoolStatus.Pending:
  //       return 'bg-green-500';
  //     case PoolStatus.Graded:
  //       return 'bg-red-500';
  //     case PoolStatus.None:
  //       return 'bg-blue-500';
  //     default:
  //       return 'bg-gray-500';
  //   }
  // };

  return (
    <div>
      <Card className='h-full transition-shadow hover:shadow-md'>
        <CardHeader>
          <div className='flex items-center gap-x-3'>
            <Avatar className='size-8'>
              <AvatarImage src='/trump.jpeg' alt='Donald Trump' />
              <AvatarFallback>DT</AvatarFallback>
            </Avatar>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center gap-x-1'>
                <span className='font-bold'>realDonaldTrump</span>
              </div>
              {pool.originalTruthSocialPostId && (
                <div className='flex items-center gap-x-2'>
                  <span className='text-muted-foreground text-xs'>
                    {formatDistanceToNow(new Date(pool.createdAt * 1000), { addSuffix: true })}
                  </span>
                  <TruthSocial postId={pool.originalTruthSocialPostId} />
                </div>
              )}
            </div>
          </div>
          <CardTitle className='line-clamp-3 text-base font-medium'>{pool.question}</CardTitle>
        </CardHeader>
        <CardContent className='flex h-full flex-col'>
          <div className='mb-4'>
            <div className='mb-2 flex justify-between text-sm font-medium'>
              {pool.options.map((option, index) => (
                <span key={index} className={index === 0 ? 'text-green-500' : 'text-red-500'}>
                  {option} {percentages[index]}%
                </span>
              ))}
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
              <div className='flex h-full'>
                {pool.options.map((_, index) => (
                  <div
                    key={index}
                    className={`h-full ${index === 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${percentages[index]}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground text-sm'>Ends: {closeDate}</div>
            <div className='text-sm font-medium'>Volume: {calculateVolume(pool, tokenType)}</div>
          </div>
          <Link href={`/pools/${pool.id}`} className='mt-auto pt-4'>
            <Button className='w-full bg-orange-500 text-white hover:bg-orange-600'>
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
