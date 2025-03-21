import { TrendingUp } from 'lucide-react';
import { TrendingBet } from './trending-bet';
import { TokenType, useTokenContext } from '@/hooks/useTokenContext';
import { GET_POOLS } from '@/app/queries';
import {
  Pool_OrderBy,
  PoolStatus,
  OrderDirection,
  Pool,
} from '@/lib/__generated__/graphql';
import { useQuery } from '@apollo/client';
import { safeCastPool } from '@/utils/betsInfo';

export function HighestVolume() {
  const { tokenType } = useTokenContext();

  const { data: volumePools } = useQuery(GET_POOLS, {
    variables: {
      filter: { status_in: [PoolStatus.Graded] },
      orderBy:
        tokenType === TokenType.USDC
          ? Pool_OrderBy.UsdcVolume
          : Pool_OrderBy.PointsVolume,
      orderDirection: OrderDirection.Desc,
      first: 3,
    },
    context: { name: 'volumeSearch' },
    notifyOnNetworkStatusChange: true,
  });

  const formatPoolVolume = (pool: any) => {
    const safePool = safeCastPool(pool);
    if (!safePool) return tokenType === TokenType.USDC ? '$0' : '0 pts';

    if (tokenType === TokenType.USDC) {
      const value = Number(safePool.usdcVolume) / Math.pow(10, 1);
      return `$${value}`;
    } else {
      const value = Number(safePool.pointsVolume) / Math.pow(10, 6);
      return `${Math.floor(value)} pts`;
    }
  };

  // Fallback data for when no pools are available
  const fallbackPools = [
    {
      id: '1',
      question: 'Will I PARDON MYSELF? The RADICAL LEFT is TERRIFIED of this!',
      volume: '$1000000'
    },
    {
      id: '2',
      question: 'Will I FIRE THE FBI DIRECTOR on day one? The FBI has been WEAPONIZED against us!',
      volume: '$800000'
    },
    {
      id: '3',
      question: 'Will the AMERICAN PEOPLE see my TAX RETURNS before the 2024 election despite the CORRUPT system trying to hide the TRUTH?',
      volume: '$500000'
    }
  ];

  return (
    <div className='bg-background mb-6 rounded-lg border border-gray-800 p-4 shadow-lg'>
      <div className='mb-4 flex items-center gap-2'>
        <TrendingUp size={20} className='text-orange-500' />
        <h2 className='text-lg font-bold'>Highest Volume</h2>
      </div>

      <div className='space-y-6'>
        {volumePools?.pools && volumePools.pools.length > 0 ? (
          volumePools.pools.map((pool) => (
            <TrendingBet
              key={pool.id}
              question={pool.question}
              volume={formatPoolVolume(pool)}
              progress={100}
              poolId={pool.id}
            />
          ))
        ) : (
          // Fallback content when no pools are available
          fallbackPools.map((pool) => (
            <TrendingBet
              key={pool.id}
              question={pool.question}
              volume={pool.volume}
              progress={80}
              poolId={pool.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
