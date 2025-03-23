'use client';

import { GET_BETS } from '@/app/queries';
import { POINTS_DECIMALS } from '@/consts';
import { Bet, Bet_OrderBy, Pool } from '@/lib/__generated__/graphql';
import { useQuery } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpRight, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { RandomAvatar } from 'react-random-avatars';

interface ActivityProps {
  pool: Pool;
}

export const Activity: FC<ActivityProps> = ({ pool }) => {
  const { id: poolId } = pool;
  const [page, setPage] = useState(1);
  const [allBets, setAllBets] = useState<Bet[]>([]);
  const pageSize = 10;

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const { data, loading, error, fetchMore } = useQuery<{ bets: Bet[] }>(GET_BETS, {
    variables: {
      filter: {
        poolId,
      },
      first: pageSize,
      skip: 0,
      orderBy: Bet_OrderBy.CreatedAt,
      orderDirection: 'desc',
    },
    context: { name: 'userBets' },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data?.bets) {
      setAllBets(data.bets);
    }
  }, [data]);

  useEffect(() => {
    if (inView && !loading && data?.bets.length === page * pageSize) {
      const loadMore = () => {
        fetchMore({
          variables: {
            skip: page * pageSize,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;

            setPage((prevPage) => prevPage + 1);

            return {
              bets: [...prev.bets, ...fetchMoreResult.bets],
            };
          },
        });
      };

      loadMore();
    }
  }, [inView, loading, data?.bets?.length, page, pageSize, fetchMore]);

  const formatTimestamp = (timestamp: string | bigint): string => {
    try {
      const date = new Date(Number(timestamp) * 1000);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'unknown time';
    }
  };

  const truncateAddress = (address: string | Uint8Array): string => {
    if (!address) return 'Anonymous';
    const addr = address.toString();
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getOptionLabel = (optionIndex: string | bigint): string => {
    const index = Number(optionIndex);
    if (pool.options && pool.options[index]) {
      return pool.options[index];
    }
    return `Option ${index}`;
  };

  if (loading && allBets.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='text-primary h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20'>
        <p className='font-medium'>Error loading activity</p>
        <p className='text-sm'>{error.message}</p>
      </div>
    );
  }

  return (
    <div className='mt-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Recent Activity</h2>
        <span className='text-sm text-gray-500'>{allBets.length} bets found</span>
      </div>

      {allBets.length > 0 ? (
        <div className='space-y-4'>
          {allBets.map((bet) => (
            <div
              key={bet.id}
              className='hover:bg-primary/5 rounded-lg border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-white/10 dark:hover:bg-gray-700/50'
            >
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-center gap-3'>
                  <RandomAvatar size={40} name={bet.id} />

                  <div>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium'>{truncateAddress(bet.user)}</p>
                    </div>
                    <div className='mt-1 flex items-center gap-2'>
                      <Clock className='h-3 w-3 text-gray-400' />
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {formatTimestamp(bet.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='flex flex-col items-end'>
                    <span className='text-primary text-lg font-bold'>
                      {parseFloat(bet.amount) / 10 ** POINTS_DECIMALS} {bet.tokenType}
                    </span>
                    <span className='text-xs text-gray-500'>placed on</span>
                  </div>

                  <div className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium dark:bg-gray-700'>
                    {getOptionLabel(bet.option)}
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      bet.isWithdrawn
                        ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400'
                    }`}
                  >
                    {bet.isWithdrawn ? 'Withdrawn' : 'Active'}
                  </div>

                  <div className='hover:text-primary cursor-pointer text-gray-400 transition-colors'>
                    <ChevronRight className='h-5 w-5' />
                  </div>
                </div>
              </div>

              {bet.transactionHash && (
                <div className='mt-3 border-t pt-3 dark:border-gray-700'>
                  <a
                    href={`https://sepolia.basescan.org/tx/${bet.transactionHash}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-primary flex items-center gap-1 text-xs text-gray-500 transition-colors'
                  >
                    <span className='uppercase'>{bet.chainName}</span>
                    <ArrowUpRight className='h-3 w-3' />
                    <span className='max-w-[200px] truncate'>{bet.transactionHash}</span>
                  </a>
                </div>
              )}
            </div>
          ))}

          <div
            ref={ref}
            className={`flex justify-center py-4 ${loading && allBets.length > 0 ? 'visible' : 'invisible'}`}
          >
            <Loader2 className='text-primary h-6 w-6 animate-spin' />
          </div>
        </div>
      ) : (
        <div className='rounded-lg border bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800'>
          <p className='text-gray-500 dark:text-gray-400'>No activity found for this pool.</p>
        </div>
      )}
    </div>
  );
};
