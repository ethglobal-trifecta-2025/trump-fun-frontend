import { Clock } from 'lucide-react';
import { EndingSoonBet } from './ending-soon-bet';
import { calculateVolume } from '@/utils/betsInfo';
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

  return (
    <div className='bg-background rounded-lg border border-gray-800 p-4 shadow-lg'>
      <div className='mb-4 flex items-center gap-2'>
        <Clock size={20} className='text-orange-500' />
        <h2 className='text-lg font-bold'>Ending Soon</h2>
      </div>

      <div className='space-y-4'>
        {filteredEndingSoonPools.map((pool) => (
          <EndingSoonBet
            key={pool.id}
            avatar='/trump.jpeg'
            question={pool.question}
            volume={calculateVolume(pool as any, tokenType)}
            timeLeft={pool.betsCloseAt}
          />
        ))}
      </div>
    </div>
  );
}
