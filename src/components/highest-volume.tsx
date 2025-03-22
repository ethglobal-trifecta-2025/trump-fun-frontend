'use client';

import { TrendingUp } from 'lucide-react';
import { TrendingBet } from './trending-bet';
import { TokenType, useTokenContext } from '@/hooks/useTokenContext';
import { GET_POOLS } from '@/app/queries';
import {
  Pool_OrderBy,
  PoolStatus,
  OrderDirection,
} from '@/lib/__generated__/graphql';
import { useQuery } from '@apollo/client';
import { safeCastPool, calculateVolume } from '@/utils/betsInfo';

export function HighestVolume() {
  const { tokenType } = useTokenContext();

  const { data: volumePools, loading, refetch } = useQuery(GET_POOLS, {
    variables: {
      filter: { },
      orderBy:
        tokenType === TokenType.USDC
          ? Pool_OrderBy.UsdcVolume
          : Pool_OrderBy.PointsVolume,
      orderDirection: OrderDirection.Desc,
      first: 5,
    },
    context: { name: 'volumeSearch' },
    notifyOnNetworkStatusChange: true,
  });

  // Simplified volume formatting
  const formatPoolVolume = (pool: any) => {
    return calculateVolume(safeCastPool(pool), tokenType);
  };

  return (
    <div className='bg-background mb-6 rounded-lg border border-gray-800 p-4 shadow-lg'>
      <div className='mb-4 flex items-center gap-2'>
        <TrendingUp size={20} className='text-orange-500' />
        <h2 className='text-lg font-bold'>Highest Volume</h2>
      </div>

      <div className='space-y-6'>
        {volumePools?.pools && volumePools.pools.length > 0 ? (
          (() => {
            // Calculate relative progress based on actual volumes
            const pools = volumePools.pools.slice(0, 3);
            const volumeValues = pools.map(pool => {
              const raw = tokenType === TokenType.USDC 
                ? Number(pool.usdcVolume || '0') 
                : Number(pool.pointsVolume || '0');
              return { pool, raw };
            });
            
            // Find max volume to calculate percentages
            const maxVolume = Math.max(...volumeValues.map(v => v.raw), 1); // Prevent division by zero
            
            return pools.map((pool, index) => {
              const rawVolume = tokenType === TokenType.USDC 
                ? Number(pool.usdcVolume || '0') 
                : Number(pool.pointsVolume || '0');
              
              // Calculate progress percentage relative to the highest volume
              const progress = Math.round((rawVolume / maxVolume) * 100) || 5; // Minimum 5% for visibility
              
              return (
                <TrendingBet
                  key={pool.id}
                  question={pool.question}
                  volume={formatPoolVolume(pool)}
                  progress={progress}
                  poolId={pool.id}
                />
              );
            });
          })()
        ) : (
          // Fallback content when no pools are available
          [
            {
              id: '1',
              question: 'Will I PARDON MYSELF? The RADICAL LEFT is TERRIFIED of this!',
              volume: '$1,000,000',
            },
            {
              id: '2',
              question: 'Will I FIRE THE FBI DIRECTOR on day one? The FBI has been WEAPONIZED against us!',
              volume: '$800,000',
            },
            {
              id: '3',
              question: 'Will the AMERICAN PEOPLE see my TAX RETURNS before the 2024 election despite the CORRUPT system trying to hide the TRUTH?',
              volume: '$500,000',
            }
          ].map((pool, index) => (
            <TrendingBet
              key={pool.id}
              question={pool.question}
              volume={pool.volume}
              progress={index === 0 ? 100 : index === 1 ? 70 : 40}
              poolId={pool.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
