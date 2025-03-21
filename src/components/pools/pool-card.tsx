'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Pool {
  id: string;
  title: string;
  endTime: string;
  yesPercentage: number;
  noPercentage: number;
  totalVolume: string;
  isActive: boolean;
}

export function PoolCard({ pool }: { pool: Pool }) {
  return (
    <Link href={`/pools/${pool.id}`} className='block'>
      <Card className='h-full transition-shadow hover:shadow-md'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-xl font-bold'>{pool.title}</CardTitle>
            <Badge
              variant={pool.isActive ? 'default' : 'secondary'}
              className={pool.isActive ? 'bg-green-500' : ''}
            >
              {pool.isActive ? 'ACTIVE' : 'CLOSED'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-4'>
            <div className='mb-2 flex justify-between text-sm'>
              <span>YES {pool.yesPercentage}%</span>
              <span>NO {pool.noPercentage}%</span>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-gray-200'>
              <div
                className='h-full bg-orange-600'
                style={{ width: `${pool.yesPercentage}%` }}
              />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground text-sm'>
              Ends: {new Date(pool.endTime).toLocaleDateString()}
            </div>
            <div className='text-sm font-medium'>
              Volume: {pool.totalVolume}
            </div>
          </div>
          <div className='mt-4'>
            <Button className='w-full bg-orange-600 hover:bg-orange-700'>
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
