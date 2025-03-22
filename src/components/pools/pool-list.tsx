'use client';

import { GET_POOLS } from '@/app/queries';
import { OrderDirection, Pool, Pool_OrderBy, PoolStatus } from '@/lib/__generated__/graphql';
import { useQuery } from '@apollo/client';
import { PoolCard } from './pool-card';

export function PoolList() {
  const {
    data: pools,
    loading,
    error,
  } = useQuery(GET_POOLS, {
    variables: {
      filter: {
        status_in: [PoolStatus.Pending, PoolStatus.None],
      },
      orderBy: Pool_OrderBy.CreatedAt,
      orderDirection: OrderDirection.Desc,
      first: 9,
    },
    context: { name: 'mainSearch' },
    notifyOnNetworkStatusChange: true,
  });

  if (loading) {
    return (
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: pools?.pools.length || 6 }).map((_, i) => (
          <div key={i} className='bg-muted h-[300px] animate-pulse rounded-lg p-4' />
        ))}
      </div>
    );
  }

  if (error || !pools) {
    return <div>Error fetching pools: {error?.message}</div>;
  }

  return (
    <div>
      <h2 className='mb-6 text-2xl font-bold'>Active Prediction Markets</h2>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {pools.pools.map((pool) => (
          <PoolCard key={pool.id} pool={pool as unknown as Pool} />
        ))}
      </div>
    </div>
  );
}
