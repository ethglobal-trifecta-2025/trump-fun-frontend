'use client';

import { GET_POOLS } from '@/app/queries';
import { POLLING_INTERVALS } from '@/consts';
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
    pollInterval: POLLING_INTERVALS['landing-pools'],
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
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {pools.pools.map((pool: Pool) => (
          <PoolCard key={pool.id} pool={pool as unknown as Pool} />
        ))}
      </div>
    </div>
  );
}
