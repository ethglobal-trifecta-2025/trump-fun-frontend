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

  const formatVolume = (pool: Pool) => {
    if (!pool) return tokenType === TokenType.USDC ? '$0' : '0 pts';

    if (tokenType === TokenType.USDC) {
      const value = Number(pool.usdcVolume) / Math.pow(10, 1);
      return `$${value}`;
    } else {
      const value = Number(pool.pointsVolume) / Math.pow(10, 6);
      return `${Math.floor(value)} pts`;
    }
  };

  return (
    <div className='bg-background mb-6 rounded-lg border border-gray-800 p-4 shadow-lg'>
      <div className='mb-4 flex items-center gap-2'>
        <TrendingUp size={20} className='text-orange-500' />
        <h2 className='text-lg font-bold'>Highest Volume</h2>
      </div>

      <div className='space-y-6'>
        {volumePools?.pools.map((pool) => (
          <TrendingBet
            key={pool.id}
            question={pool.question}
            volume={formatVolume(pool)}
            progress={100}
          />
        ))}
      </div>
    </div>
  );
}
