import { Clock } from 'lucide-react';
import { EndingSoonBet } from './ending-soon-bet';
import { calculateVolume, safeCastPool } from '@/utils/betsInfo';
import { useQuery } from '@apollo/client';
import { Pool_OrderBy } from '@/lib/__generated__/graphql';
import { OrderDirection } from '@/lib/__generated__/graphql';
import { PoolStatus } from '@/lib/__generated__/graphql';
import { GET_POOLS } from '@/app/queries';
import { useMemo } from 'react';
import { useTokenContext } from '@/hooks/useTokenContext';

export function EndingSoon() {
  const { tokenType } = useTokenContext();

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const oneDayFromNow = currentTimestamp + 86400;

  const { data: endingSoonPools } = useQuery(GET_POOLS, {
    variables: {
      filter: {
        betsCloseAt_gt: currentTimestamp.toString(),
        betsCloseAt_lt: oneDayFromNow.toString(),
        status_in: [PoolStatus.Pending, PoolStatus.None],
      },
      orderBy: Pool_OrderBy.BetsCloseAt,
      orderDirection: OrderDirection.Asc,
      first: 3,
    },
    context: { name: 'endingSoonSearch' },
    notifyOnNetworkStatusChange: true,
  });

  const filteredEndingSoonPools = useMemo(() => {
    if (!endingSoonPools?.pools) return [];
    return endingSoonPools.pools;
  }, [endingSoonPools?.pools]);

  // Fallback data for when no pools are available
  const fallbackPools = [
    {
      id: '4',
      question: 'Will my administration RELEASE the UNEDITED J6 TAPES and EXPOSE the TRUTH about what REALLY happened, showing the American people what the CORRUPT Deep State has been HIDING from them, before the end of 2024?',
      volume: '$0.00',
      betsCloseAt: (currentTimestamp + 81200).toString() // 22h 34m from now
    },
    {
      id: '5',
      question: 'Will New York Attorney General Letitia James be INVESTIGATED for her QUESTIONABLE Building Permits by the END OF THE YEAR, just like the RADICAL LEFT did to me with their WITCH HUNT?',
      volume: '$0.00',
      betsCloseAt: (currentTimestamp + 81200).toString() // 22h 34m from now
    },
    {
      id: '6',
      question: 'Will my STRONG policies on DEPORTING VIOLENT CRIMINALS result in a 25% REDUCTION in ILLEGAL ALIEN crime by the end of 2025, making our country SAFE AGAIN?',
      volume: '$0.00',
      betsCloseAt: (currentTimestamp + 81200).toString() // 22h 34m from now
    }
  ];

  return (
    <div className='bg-background rounded-lg border border-gray-800 p-4 shadow-lg'>
      <div className='mb-4 flex items-center gap-2'>
        <Clock size={20} className='text-orange-500' />
        <h2 className='text-lg font-bold'>Ending Soon</h2>
      </div>

      <div className='space-y-4'>
        {filteredEndingSoonPools.length > 0 ? (
          filteredEndingSoonPools.map((pool) => {
            const safePool = safeCastPool(pool);
            return (
              <EndingSoonBet
                key={pool.id}
                avatar='/trump.jpeg'
                question={pool.question}
                volume={calculateVolume(safePool, tokenType)}
                timeLeft={pool.betsCloseAt}
                poolId={pool.id}
              />
            );
          })
        ) : (
          // Fallback content when no pools are available
          fallbackPools.map((pool) => (
            <EndingSoonBet
              key={pool.id}
              avatar='/trump.jpeg'
              question={pool.question}
              volume={pool.volume}
              timeLeft={pool.betsCloseAt}
              poolId={pool.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
