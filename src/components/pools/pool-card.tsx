'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pool, PoolStatus } from '@/lib/__generated__/graphql';

export function PoolCard({ pool }: { pool: Pool }) {
  const totalPoints = pool.pointsBetTotals.reduce((sum, points) => sum + BigInt(points), BigInt(0));
  const totalUsdc = pool.usdcBetTotals.reduce((sum, usdc) => sum + BigInt(usdc), BigInt(0));

  const pointsPercentages =
    totalPoints > BigInt(0)
      ? pool.pointsBetTotals.map((points) => Number((BigInt(points) * BigInt(100)) / totalPoints))
      : pool.options.map(() => 0);

  const usdcPercentages =
    totalUsdc > BigInt(0)
      ? pool.usdcBetTotals.map((usdc) => Number((BigInt(usdc) * BigInt(100)) / totalUsdc))
      : pool.options.map(() => 0);

  const percentages = pool.options.map((_, index) => {
    if (totalPoints > BigInt(0) && totalUsdc > BigInt(0)) {
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

  const getBadgeVariant = () => {
    switch (pool.status) {
      case PoolStatus.Pending:
        return 'bg-green-500';
      case PoolStatus.Graded:
        return 'bg-red-500';
      case PoolStatus.None:
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Link href={`/pools/${pool.id}`} className='block'>
      <Card className='h-full transition-shadow hover:shadow-md'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-xl font-bold'>{pool.question}</CardTitle>
            <Badge variant='default' className={getBadgeVariant()}>
              {pool.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='flex h-full flex-col'>
          <div className='mb-4'>
            <div className='mb-2 flex justify-between text-sm'>
              {pool.options.map((option, index) => (
                <span key={index}>
                  {option} {percentages[index]}%
                </span>
              ))}
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-gray-200'>
              <div className='h-full bg-orange-500' style={{ width: `${percentages[0]}%` }} />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground text-sm'>Ends: {closeDate}</div>
            <div className='text-sm font-medium'>
              Volume: {(Number(pool.usdcVolume) + Number(pool.pointsVolume)).toLocaleString()}
            </div>
          </div>
          <div className='mt-auto pt-4'>
            <Button className='w-full bg-orange-500 hover:bg-orange-600'>View Details</Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
