'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pool } from '@/lib/__generated__/graphql';

export function PoolCard({ pool }: { pool: Pool }) {
  return (
    <Link href={`/pools/${pool.id}`} className='block'>
      <Card className='h-full transition-shadow hover:shadow-md'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-xl font-bold'>{pool.question}</CardTitle>
            <Badge variant='default' className='bg-green-500'>
              ACTIVE
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-4'>
            <div className='mb-2 flex justify-between text-sm'>
              <span>YES 50%</span>
              <span>NO 50%</span>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-gray-200'>
              <div className='h-full bg-orange-500' style={{ width: '50%' }} />
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground text-sm'>
              Ends: {new Date().toLocaleDateString()}
            </div>
            <div className='text-sm font-medium'>Volume: 0</div>
          </div>
          <div className='mt-4'>
            <Button className='w-full bg-orange-500 hover:bg-orange-600'>
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
