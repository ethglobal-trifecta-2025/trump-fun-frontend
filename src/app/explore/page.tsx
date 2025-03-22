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
import { OrderDirection, Pool_OrderBy, PoolStatus } from '@/lib/__generated__/graphql';
import { calculateVolume, getBetTotals } from '@/utils/betsInfo';
import { useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';

export default function BettingPlatform() {
  const [activeFilter, setActiveFilter] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const { tokenType } = useTokenContext();

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
        filter: {},
      },
      ending_soon: {
        orderBy: Pool_OrderBy.BetsCloseAt,
        orderDirection: OrderDirection.Asc,
        filter: { status_in: [PoolStatus.Pending, PoolStatus.None] },
      },
      recently_closed: {
        orderBy: Pool_OrderBy.BetsCloseAt,
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

  const { data: pools, refetch: refetchPools } = useQuery(GET_POOLS, {
    variables: {
      filter,
      orderBy,
      orderDirection,
    },
    context: { name: 'mainSearch' },
    notifyOnNetworkStatusChange: true,
  });

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);

    // Force refetch after filter change
    setTimeout(() => {
      refetchPools();
    }, 100);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPools = useMemo(() => {
    if (!pools?.pools) return [];
    if (!searchQuery.trim()) return pools.pools;

    const query = searchQuery.toLowerCase().trim();
    return pools.pools.filter((pool) => pool.question.toLowerCase().includes(query));
  }, [pools?.pools, searchQuery]);

  const renderFilterButton = (value: string, label: string) => (
    <Button
      variant={activeFilter === value ? 'default' : 'ghost'}
      className='w-full justify-start font-medium'
      onClick={() => handleFilterChange(value)}
    >
      {label}
    </Button>
  );

  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col'>
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <div className='hidden w-60 flex-col border-r border-gray-800 p-4 md:flex'>
          <div className='mb-6 flex items-center gap-3'>
            <Avatar className='size-14 overflow-hidden rounded-full'>
              <AvatarImage src='/trump.jpeg' alt='Trump.fun' />
              <AvatarFallback>
                <span className='text-2xl font-bold text-orange-500'>T</span>
              </AvatarFallback>
            </Avatar>
            <span className='text-xl font-bold'>@Trump.fun</span>
          </div>

          <Link href='/'>
            <Button variant='outline' className='mb-6 justify-start gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'></path>
              </svg>
              Follow @Trump.fun
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
                    className='absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400'
                    size={18}
                  />
                  <Input
                    placeholder='Search pools...'
                    className='border-gray-700 bg-gray-900 pl-10 text-white'
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
                  <TabsList className='bg-gray-900'>
                    <TabsTrigger value='newest' className='data-[state=active]:bg-gray-800'>
                      Newest
                    </TabsTrigger>
                    <TabsTrigger value='highest' className='data-[state=active]:bg-gray-800'>
                      Highest Vol.
                    </TabsTrigger>
                    <TabsTrigger value='ending_soon' className='data-[state=active]:bg-gray-800'>
                      Ending Soon
                    </TabsTrigger>
                    <TabsTrigger
                      value='recently_closed'
                      className='data-[state=active]:bg-gray-800'
                    >
                      Recent
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Betting Posts */}
              <div className='flex-1 space-y-4'>
                {filteredPools.map((pool) => {
                  return (
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
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <div className='hidden w-80 overflow-y-auto border-l border-gray-800 p-4 md:block'>
          {/* Search */}
          <div className='mb-6'>
            <div className='relative'>
              <Search
                className='absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400'
                size={18}
              />
              <Input
                placeholder='Search pools...'
                className='bg-background border-gray-700 pl-10 text-white'
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Highest Volume */}
          <HighestVolume />

          {/* Ending Soon */}
          <EndingSoon />
        </div>
      </div>
    </div>
  );
}
