'use client';

import { BettingPost } from '@/components/betting-post';
import { EndingSoon } from '@/components/ending-soon';
import { HighestVolume } from '@/components/highest-volume';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import Link from 'next/link';

import { GET_POOLS } from '@/app/queries';
import { TokenType, useTokenContext } from '@/hooks/useTokenContext';
import { OrderDirection, Pool, Pool_OrderBy, PoolStatus } from '@/lib/__generated__/graphql';
import { calculateVolume, getBetTotals } from '@/utils/betsInfo';
import { TRUMP_FUN_TWITTER_URL, TRUMP_FUN_TWITTER_USERNAME } from '@/utils/config';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import { useMemo, useState, useRef, useEffect, useCallback } from 'react';

export default function BettingPlatform() {
  const [activeFilter, setActiveFilter] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const { tokenType } = useTokenContext();

  // Infinite scroll states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [displayedPools, setDisplayedPools] = useState<Pool[]>([]);
  const [fetchingMore, setFetchingMore] = useState(false);
  const ITEMS_PER_PAGE = 10;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const filterConfigs = useMemo(
    () => ({
      newest: {
        orderBy: Pool_OrderBy.CreatedAt,
        orderDirection: OrderDirection.Desc,
        filter: { status_in: [PoolStatus.Pending, PoolStatus.None] },
      },
      highest: {
        orderBy: tokenType === TokenType.USDC ? Pool_OrderBy.UsdcVolume : Pool_OrderBy.PointsVolume,
        orderDirection: OrderDirection.Desc,
        filter: {
          status_in: [PoolStatus.Pending, PoolStatus.None],
        },
      },
      ending_soon: {
        orderBy: Pool_OrderBy.BetsCloseAt,
        orderDirection: OrderDirection.Asc,
        filter: { status_in: [PoolStatus.Pending, PoolStatus.None] },
      },
      recently_closed: {
        orderBy: Pool_OrderBy.GradedBlockTimestamp,
        orderDirection: OrderDirection.Desc,
        filter: {
          status_in: [PoolStatus.Graded, PoolStatus.Regraded],
          betsCloseAt_lt: Date.now().toString(),
        },
      },
    }),
    [tokenType]
  );

  const { orderBy, orderDirection, filter } = useMemo(
    () => filterConfigs[activeFilter as keyof typeof filterConfigs],
    [activeFilter, filterConfigs]
  );

  const {
    data: pools,
    refetch: refetchPools,
    loading: isLoading,
    fetchMore,
  } = useQuery(GET_POOLS, {
    variables: {
      filter,
      orderBy,
      orderDirection,
      first: ITEMS_PER_PAGE,
      skip: 0,
    },
    context: { name: 'mainSearch' },
    notifyOnNetworkStatusChange: true,
  });

  const filteredPools = useMemo(() => {
    if (!pools?.pools) return [];
    if (!searchQuery.trim()) return pools.pools;

    const query = searchQuery.toLowerCase().trim();
    return pools.pools.filter((pool: Pool) => pool.question.toLowerCase().includes(query));
  }, [pools?.pools, searchQuery]);

  // Initialize displayed pools when data loads or filters change
  useEffect(() => {
    if (filteredPools.length) {
      setDisplayedPools(filteredPools);
      setPage(1);
      setHasMore(filteredPools.length >= ITEMS_PER_PAGE);
    }
  }, [filteredPools]);

  // Handle intersection observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading && !fetchingMore && !searchQuery) {
        setFetchingMore(true);
        fetchMore({
          variables: {
            skip: page * ITEMS_PER_PAGE,
            first: ITEMS_PER_PAGE,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            setFetchingMore(false);

            if (!fetchMoreResult?.pools?.length) {
              setHasMore(false);
              return prev;
            }

            setPage((prevPage) => prevPage + 1);

            // Check if we've reached the end
            if (fetchMoreResult.pools.length < ITEMS_PER_PAGE) {
              setHasMore(false);
            }

            const newPools = [...prev.pools, ...fetchMoreResult.pools];
            setDisplayedPools(newPools);

            return {
              ...prev,
              pools: newPools,
            };
          },
        }).catch(() => {
          setFetchingMore(false);
        });
      }
    },
    [fetchMore, page, hasMore, isLoading, fetchingMore, searchQuery]
  );

  // Set up the intersection observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px', // Start loading a bit before reaching the bottom
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    setDisplayedPools([]);
    setPage(1);
    setHasMore(true);
    setFetchingMore(false);

    // Force refetch after filter change
    setTimeout(() => {
      refetchPools({
        filter: filterConfigs[value as keyof typeof filterConfigs].filter,
        orderBy: filterConfigs[value as keyof typeof filterConfigs].orderBy,
        orderDirection: filterConfigs[value as keyof typeof filterConfigs].orderDirection,
        first: ITEMS_PER_PAGE,
        skip: 0,
      });
    }, 100);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderFilterButton = (value: string, label: string) => (
    <Button
      variant={activeFilter === value ? 'default' : 'ghost'}
      className='w-full justify-start font-medium'
      onClick={() => handleFilterChange(value)}
    >
      {label}
    </Button>
  );

  // Only show full loading screen on initial load when there are no posts
  const showFullLoadingScreen = isLoading && page === 1 && displayedPools.length === 0;

  if (showFullLoadingScreen) {
    return (
      <div className='container mx-auto flex h-screen max-w-4xl flex-col items-center justify-center px-4 py-8'>
        <Image
          src='/loader.gif'
          alt='Loading'
          width={100}
          height={100}
          className='z-50 size-40 animate-spin rounded-full'
        />
      </div>
    );
  }

  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col'>
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <div className='hidden w-60 flex-col border-r border-gray-200 p-4 md:flex dark:border-gray-800'>
          <div className='mb-6 flex items-center gap-3'>
            <Avatar className='size-14 overflow-hidden rounded-full'>
              <AvatarImage src='/trump.jpeg' alt='Trump.fun' />
              <AvatarFallback>
                <span className='text-2xl font-bold text-orange-500'>T</span>
              </AvatarFallback>
            </Avatar>
            <span className='text-xl font-bold'>@Trump.fun</span>
          </div>

          <Link href={TRUMP_FUN_TWITTER_URL} target='_blank'>
            <Button variant='outline' className='mb-6 justify-start gap-2'>
              <svg
                viewBox='0 0 24 24'
                aria-hidden='true'
                className='h-4 w-4 fill-current text-black dark:text-white'
              >
                <g>
                  <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'></path>
                </g>
              </svg>
              Follow @{TRUMP_FUN_TWITTER_USERNAME}
            </Button>
          </Link>

          <Separator className='my-4' />

          <nav className='space-y-1'>
            {renderFilterButton('newest', 'Newest')}
            {renderFilterButton('highest', 'Highest Vol.')}
            {renderFilterButton('ending_soon', 'Ending Soon')}
            {renderFilterButton('recently_closed', 'Recently Closed')}
            <Separator className='my-2' />
          </nav>
        </div>

        {/* Main Content */}
        <main className='flex flex-1 flex-col overflow-y-hidden md:flex-row'>
          {/* Feed */}
          <div className='scrollbar-hide scroll-hide flex flex-1 justify-center overflow-y-auto p-4'>
            <div className='w-full max-w-2xl'>
              {/* Mobile Search */}
              <div className='mb-4 md:hidden'>
                <div className='relative'>
                  <Search
                    className='absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500 dark:text-gray-400'
                    size={18}
                  />
                  <Input
                    placeholder='Search pools...'
                    className='border-gray-300 bg-white pl-10 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white'
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              {/* Mobile Tabs */}
              <div className='scrollbar-hide scroll-hide mb-4 overflow-x-auto md:hidden'>
                <Tabs
                  defaultValue='newest'
                  value={activeFilter}
                  onValueChange={handleFilterChange}
                  className='w-full'
                >
                  <TabsList className='bg-gray-100 dark:bg-gray-900'>
                    <TabsTrigger
                      value='newest'
                      className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800'
                    >
                      Newest
                    </TabsTrigger>
                    <TabsTrigger
                      value='highest'
                      className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800'
                    >
                      Highest Vol.
                    </TabsTrigger>
                    <TabsTrigger
                      value='ending_soon'
                      className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800'
                    >
                      Ending Soon
                    </TabsTrigger>
                    <TabsTrigger
                      value='recently_closed'
                      className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800'
                    >
                      Recent
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Betting Posts */}
              <div className='flex-1 space-y-4'>
                {/* Initial loading indicator (if no posts yet) */}
                {isLoading && page === 1 && displayedPools.length === 0 && (
                  <div className='flex justify-center py-4'>
                    <div className='size-8 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white'></div>
                  </div>
                )}

                {/* Display posts */}
                {displayedPools.map((pool: Pool) => (
                  <BettingPost
                    key={pool.id}
                    id={pool.id}
                    avatar='/trump.jpeg'
                    username='realDonaldTrump'
                    time={pool.createdAt}
                    question={pool.question}
                    options={pool.options}
                    commentCount={0}
                    truthSocialId={pool.originalTruthSocialPostId}
                    volume={calculateVolume(pool, tokenType)}
                    optionBets={pool.options.map((_, index) =>
                      getBetTotals(pool, tokenType, index)
                    )}
                    closesAt={pool.betsCloseAt}
                    gradedBlockTimestamp={pool.gradedBlockTimestamp}
                    status={pool.status}
                  />
                ))}

                {/* Intersection observer target element */}
                <div ref={loadMoreRef} style={{ height: '20px', width: '100%' }} />

                {/* Bottom loader for infinite scroll */}
                {fetchingMore && (
                  <div className='flex justify-center py-6'>
                    <div className='size-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white'></div>
                  </div>
                )}

                {/* No more content message */}
                {!hasMore && displayedPools.length > 0 && !fetchingMore && (
                  <div className='py-4 text-center text-gray-500 dark:text-gray-400'>
                    No more pools to load
                  </div>
                )}

                {/* No results message */}
                {displayedPools.length === 0 && !isLoading && !fetchingMore && (
                  <div className='py-4 text-center text-gray-500 dark:text-gray-400'>
                    No pools found
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <div className='hidden w-80 gap-4 overflow-y-auto border-l border-gray-200 p-4 md:block dark:border-gray-800'>
          {/* Search */}
          <div className='mb-6'>
            <div className='relative'>
              <Search
                className='absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500 dark:text-gray-400'
                size={18}
              />
              <Input
                placeholder='Search pools...'
                className='border-gray-300 bg-white pl-10 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white'
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Highest Vol */}
          <HighestVolume />

          {/* Ending Soon */}
          <EndingSoon />
        </div>
      </div>
    </div>
  );
}
