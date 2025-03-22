'use client';

import { EndingSoon } from '@/components/ending-soon';
import { HighestVolume } from '@/components/highest-volume';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Search, Settings, Trophy, Wallet } from 'lucide-react';
import { BettingPost } from '@/components/betting-post';

import { GET_BETS } from '@/app/queries';
import { useTokenContext } from '@/hooks/useTokenContext';
import { OrderDirection, Bet_OrderBy, PoolStatus, Bet_Filter } from '@/lib/__generated__/graphql';
import { calculateVolume, getBetTotals } from '@/utils/betsInfo';
import { useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

export default function ProfilePage() {
  const [activeFilter, setActiveFilter] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const { tokenType } = useTokenContext();
  const { address } = useAccount();

  const filterConfigs = useMemo(
    () => ({
      active: {
        orderBy: Bet_OrderBy.UpdatedAt,
        orderDirection: OrderDirection.Desc,
        filter: {
          user: address,
          pool_: {
            status: 'PENDING',
          },
        },
      },
      won: {
        orderBy: Bet_OrderBy.UpdatedAt,
        orderDirection: OrderDirection.Desc,
        filter: {
          pool_: {
            status_eq: PoolStatus.Graded,
          },
          winner_: {
            id_eq: address,
          },
        },
      },
      lost: {
        orderBy: Bet_OrderBy.UpdatedAt,
        orderDirection: OrderDirection.Desc,
        filter: {
          pool_: {
            status_eq: PoolStatus.Graded,
          },
          loser_: {
            id_eq: address,
          },
        },
      },
      all: {
        orderBy: Bet_OrderBy.UpdatedAt,
        orderDirection: OrderDirection.Desc,
        filter: {
          user: address,
        },
      },
    }),
    []
  );

  const { orderBy, orderDirection, filter } = useMemo(
    () => filterConfigs[activeFilter as keyof typeof filterConfigs],
    [activeFilter, filterConfigs]
  );

  const { data: userBets } = useQuery<{ bets: any[] }>(GET_BETS, {
    variables: {
      filter: filter as Bet_Filter,
      orderBy,
      orderDirection,
    },
    context: { name: 'userBets' },
    notifyOnNetworkStatusChange: true,
    skip: !address,
  });

  console.log('userBets', userBets);

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPools = useMemo(() => {
    if (!userBets?.bets) return [];
    if (!searchQuery.trim()) return userBets.bets;

    const query = searchQuery.toLowerCase().trim();
    return userBets.bets.filter((bet) => bet.pool.question.toLowerCase().includes(query));
  }, [userBets?.bets, searchQuery]);

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
            <Avatar className='h-20 w-20 overflow-hidden rounded-full'>
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
          <div className='scrollbar-hide flex flex-1 justify-center overflow-y-auto p-4'>
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
              <div className='scrollbar-hide mb-4 overflow-x-auto md:hidden'>
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
              <div className='flex-1 space-y-4'>
                {filteredPools.map((bet) => (
                  <BettingPost
                    key={bet.id}
                    id={bet.pool.id}
                    avatar='/trump.jpeg'
                    username='realDonaldTrump'
                    time={bet.pool.createdAt}
                    question={bet.pool.question}
                    options={bet.pool.options}
                    commentCount={0}
                    volume={calculateVolume(bet.pool, tokenType)}
                    optionBets={bet.pool.options.map((_: string, index: number) =>
                      getBetTotals(bet.pool, tokenType, index)
                    )}
                  />
                ))}
                {filteredPools.length === 0 && (
                  <div className='py-8 text-center text-gray-400'>
                    No bets found for this filter
                  </div>
                )}
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
