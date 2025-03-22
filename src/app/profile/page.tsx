'use client';

import { EndingSoon } from '@/components/ending-soon';
import { HighestVolume } from '@/components/highest-volume';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Wallet, Trophy, History, Settings } from 'lucide-react';

// import { GET_USER_POOLS } from '@/app/queries';
import { OrderDirection, Pool_OrderBy, PoolStatus } from '@/lib/__generated__/graphql';
import { useMemo, useState } from 'react';
import { useTokenContext } from '@/hooks/useTokenContext';

export default function ProfilePage() {
  const [activeFilter, setActiveFilter] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const { tokenType } = useTokenContext();

  const filterConfigs = useMemo(
    () => ({
      active: {
        orderBy: Pool_OrderBy.CreatedAt,
        orderDirection: OrderDirection.Desc,
        filter: { status_in: [PoolStatus.Pending, PoolStatus.None] },
      },
      won: {
        orderBy: Pool_OrderBy.CreatedAt,
        orderDirection: OrderDirection.Desc,
        filter: { status: PoolStatus.Graded },
      },
      lost: {
        orderBy: Pool_OrderBy.CreatedAt,
        orderDirection: OrderDirection.Desc,
        filter: { status: PoolStatus.Graded },
      },
      all: {
        orderBy: Pool_OrderBy.CreatedAt,
        orderDirection: OrderDirection.Desc,
        filter: {},
      },
    }),
    []
  );

  //   const { orderBy, orderDirection, filter } = useMemo(
  //     () => filterConfigs[activeFilter as keyof typeof filterConfigs],
  //     [activeFilter, filterConfigs]
  //   );

  //   const { data: userPools } = useQuery(GET_USER_POOLS, {
  //     variables: {
  //       filter,
  //       orderBy,
  //       orderDirection,
  //     },
  //     context: { name: 'userBets' },
  //     notifyOnNetworkStatusChange: true,
  //   });

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  //   const filteredPools = useMemo(() => {
  //     if (!userPools?.pools) return [];
  //     if (!searchQuery.trim()) return userPools.pools;

  //     const query = searchQuery.toLowerCase().trim();
  //     return userPools.pools.filter((pool) =>
  //       pool.question.toLowerCase().includes(query)
  //     );
  //   }, [userPools?.pools, searchQuery]);

  const renderFilterButton = (value: string, label: string, icon: React.ReactNode) => (
    <Button
      variant={activeFilter === value ? 'default' : 'ghost'}
      className='w-full justify-start gap-2 font-medium'
      onClick={() => handleFilterChange(value)}
    >
      {icon}
      {label}
    </Button>
  );

  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col'>
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <div className='hidden w-60 flex-col border-r border-gray-800 p-4 md:flex'>
          <div className='mb-6 flex flex-col items-center gap-3'>
            <Avatar className='size-20 overflow-hidden rounded-full'>
              <AvatarImage src='/trump.jpeg' alt='Profile' />
              <AvatarFallback>
                <span className='text-2xl font-bold text-orange-500'>U</span>
              </AvatarFallback>
            </Avatar>
            <div className='text-center'>
              <div className='text-xl font-bold'>@username</div>
              <div className='text-sm text-gray-400'>Joined Mar 2024</div>
            </div>
            <div className='flex w-full items-center justify-between rounded-lg bg-gray-800 p-3'>
              <div className='text-center'>
                <div className='text-sm text-gray-400'>Balance</div>
                <div className='font-bold'>1000 pts</div>
              </div>
              <div className='text-center'>
                <div className='text-sm text-gray-400'>Win Rate</div>
                <div className='font-bold'>75%</div>
              </div>
            </div>
          </div>

          <Separator className='my-4' />

          <nav className='space-y-1'>
            {renderFilterButton('active', 'Active Bets', <History className='h-4 w-4' />)}
            {renderFilterButton('won', 'Won Bets', <Trophy className='h-4 w-4' />)}
            {renderFilterButton('lost', 'Lost Bets', <Wallet className='h-4 w-4' />)}
            {renderFilterButton('all', 'All Bets', <History className='h-4 w-4' />)}
            <Separator className='my-2' />
            <Button variant='ghost' className='w-full justify-start gap-2 font-medium'>
              <Settings className='h-4 w-4' />
              Settings
            </Button>
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
                    placeholder='Search your bets...'
                    className='border-gray-700 bg-gray-900 pl-10 text-white'
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              {/* Mobile Tabs */}
              <div className='scrollbar-hide scroll-hide mb-4 overflow-x-auto md:hidden'>
                <Tabs
                  defaultValue='active'
                  value={activeFilter}
                  onValueChange={handleFilterChange}
                  className='w-full'
                >
                  <TabsList className='bg-gray-900'>
                    <TabsTrigger value='active' className='data-[state=active]:bg-gray-800'>
                      Active
                    </TabsTrigger>
                    <TabsTrigger value='won' className='data-[state=active]:bg-gray-800'>
                      Won
                    </TabsTrigger>
                    <TabsTrigger value='lost' className='data-[state=active]:bg-gray-800'>
                      Lost
                    </TabsTrigger>
                    <TabsTrigger value='all' className='data-[state=active]:bg-gray-800'>
                      All
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Betting Posts */}
              {/* <div className='flex-1 space-y-4'>
                {filteredPools.map((pool) => (
                  <BettingPost
                    key={pool.id}
                    id={pool.id}
                    avatar='/trump.jpeg'
                    username='realDonaldTrump'
                    time={pool.createdAt}
                    question={pool.question}
                    options={pool.options}
                    commentCount={0}
                    volume={calculateVolume(pool as any, tokenType)}
                    optionBets={pool.options.map((_, index) =>
                      getBetTotals(pool as any, tokenType, index)
                    )}
                  />
                ))}
                {filteredPools.length === 0 && (
                  <div className='py-8 text-center text-gray-400'>
                    No bets found for this filter
                  </div>
                )}
              </div> */}
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
                placeholder='Search your bets...'
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
