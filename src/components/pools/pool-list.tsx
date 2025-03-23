'use client';

import { GET_POOLS } from '@/app/queries';
import { POLLING_INTERVALS } from '@/consts';
import { TokenType, useTokenContext } from '@/hooks/useTokenContext';
import { OrderDirection, Pool, Pool_OrderBy, PoolStatus } from '@/lib/__generated__/graphql';
import { NetworkStatus, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { PoolCard } from './pool-card';

export function PoolList() {
  const { tokenType } = useTokenContext();

  // Determine sort field based on token type
  const volumeOrderBy =
    tokenType === TokenType.USDC ? Pool_OrderBy.UsdcVolume : Pool_OrderBy.PointsVolume;

  const {
    data: pools,
    loading,
    error,
    networkStatus,
  } = useQuery(GET_POOLS, {
    variables: {
      filter: {
        status_in: [PoolStatus.Pending, PoolStatus.None],
      },
      orderBy: volumeOrderBy,
      orderDirection: OrderDirection.Desc,
      first: 9,
    },
    pollInterval: POLLING_INTERVALS['landing-pools'],
    context: { name: 'mainSearch' },
    notifyOnNetworkStatusChange: true,
  });

  // Filter out pools where bets are closed (betsCloseAt < current time)
  const filteredPools = useMemo(() => {
    if (!pools?.pools) return [];

    const currentTime = Math.floor(Date.now() / 1000); // Current UTC time in seconds
    return pools.pools.filter((pool: Pool) => {
      // Only show pools where bets are still open
      return Number(pool.betsCloseAt) > currentTime;
    });
  }, [pools]);

  // Only show loading state on initial load, not during polling
  const isInitialLoading = loading && networkStatus === NetworkStatus.loading;

  if (isInitialLoading) {
    return (
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='bg-muted h-[300px] animate-pulse rounded-lg p-4' />
        ))}
      </div>
    );
  }

  if (error || !pools) {
    return <div>Error fetching pools: {error?.message}</div>;
  }

  if (filteredPools.length === 0) {
    return <div className='py-8 text-center'>No active prediction pools available right now.</div>;
  }

  return (
    <div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredPools.map((pool: Pool) => (
          <PoolCard key={pool.id} pool={pool as unknown as Pool} />
        ))}
      </div>
    </div>
  );
}
