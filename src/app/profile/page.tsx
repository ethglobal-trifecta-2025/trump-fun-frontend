'use client';

import { EndingSoon } from '@/components/ending-soon';
import { HighestVolume } from '@/components/highest-volume';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@apollo/client';
import { ArrowDownToLine, ArrowUpFromLine, History, Search, Settings } from 'lucide-react';
import { useState } from 'react';
import { usePublicClient, useWriteContract } from 'wagmi';

import { GET_BETS } from '@/app/queries';
import { UserBettingPost } from '@/components/user-betting-post';
import { APP_ADDRESS } from '@/consts/addresses';
import { useNetwork } from '@/hooks/useNetwork';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { TokenType, useTokenContext } from '@/hooks/useTokenContext';
import { useWalletAddress } from '@/hooks/useWalletAddress';
import { Bet_Filter, Bet_OrderBy, OrderDirection } from '@/lib/__generated__/graphql';
import { bettingContractAbi } from '@/lib/contract.types';
import { calculateVolume } from '@/utils/betsInfo';
import { useMemo } from 'react';
import { useReadContract } from 'wagmi';

export default function ProfilePage() {
  const [activeFilter, setActiveFilter] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const { tokenType } = useTokenContext();
  const { address } = useWalletAddress();
  const { formattedBalance, tokenTextLogo } = useTokenBalance();
  const { networkInfo } = useNetwork();
  const tokenTypeC = tokenType === TokenType.USDC ? 0 : 1;
  const { data: hash, isPending, writeContract } = useWriteContract();
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  const { data: balance } = useReadContract({
    address: APP_ADDRESS,
    abi: bettingContractAbi,
    functionName: 'userBalances',
    args: [address, tokenTypeC],
  });
  const publicClient = usePublicClient();

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
      // won: {
      //   orderBy: Bet_OrderBy.UpdatedAt,
      //   orderDirection: OrderDirection.Desc,
      //   filter: {
      //     pool_: {
      //       status_eq: PoolStatus.Graded,
      //     },
      //     winner_: {
      //       id_eq: address,
      //     },
      //   },
      // },
      // lost: {
      //   orderBy: Bet_OrderBy.UpdatedAt,
      //   orderDirection: OrderDirection.Desc,
      //   filter: {
      //     pool_: {
      //       status_eq: PoolStatus.Graded,
      //     },
      //     loser_: {
      //       id_eq: address,
      //     },
      //   },
      // },
      all: {
        orderBy: Bet_OrderBy.UpdatedAt,
        orderDirection: OrderDirection.Desc,
        filter: {
          user: address,
        },
      },
    }),
    [address]
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

  // Memoize the sidebar components to prevent re-rendering when filter changes
  const memoizedHighestVolume = useMemo(() => <HighestVolume />, []);
  const memoizedEndingSoon = useMemo(() => <EndingSoon />, []);

  const formattedWithdrawableBalance = useMemo((): number => {
    if (!balance) return 0;
    return tokenType === TokenType.USDC
      ? Number(balance) / 1000000
      : Number(balance) / 1000000000000000000;
  }, [balance, tokenType]);

  const handleWithdraw = async () => {
    if (!address || !publicClient) return;

    if (withdrawAmount <= formattedWithdrawableBalance && withdrawAmount > 0) {
      try {
        // Convert the withdrawal amount to the correct format based on token type
        const tokenAmount = BigInt(
          Math.floor(
            withdrawAmount * (tokenType === TokenType.USDC ? 1000000 : 1000000000000000000)
          )
        );

        const { request } = await publicClient.simulateContract({
          abi: bettingContractAbi,
          address: APP_ADDRESS,
          functionName: 'withdraw',
          account: address as `0x${string}`,
          args: [tokenTypeC, tokenAmount],
        });

        writeContract(request);
      } catch (error) {
        console.error('Error withdrawing tokens:', error);
      }
    } else {
      console.error('Invalid withdrawal amount or insufficient balance');
    }
  };

  return (
    <div className='flex h-[calc(100vh-4rem)] flex-col'>
      <div className='flex flex-1 overflow-hidden'>
        {/* Sidebar */}
        <div className='hidden w-60 flex-col border-r border-gray-200 p-4 md:flex dark:border-gray-800'>
          <div className='mb-6 flex flex-col items-center gap-3'>
            <Avatar className='h-20 w-20 overflow-hidden rounded-full'>
              <AvatarImage src='/trump.jpeg' alt='Profile' />
              <AvatarFallback>
                <span className='text-2xl font-bold text-orange-500'>U</span>
              </AvatarFallback>
            </Avatar>
            <div className='text-center'>
              <div className='text-xl font-bold'>
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
              </div>
            </div>
            <div className='flex w-full items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-gray-800'>
              <div className='text-center'>
                <div className='text-sm text-gray-500 dark:text-gray-400'>Balance</div>
                <div className='font-bold'>
                  {formattedBalance} {tokenTextLogo}
                </div>
              </div>
              <div className='text-center'>
                <div className='text-sm text-gray-500 dark:text-gray-400'>Network</div>
                <div className='font-semibold'>{networkInfo.name}</div>
              </div>
            </div>
          </div>
          <div className='space-y-3'>
            <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              Token Actions
            </div>

            <p>
              Withdrawable Balance: {formattedWithdrawableBalance} {tokenTextLogo}
            </p>

            <div className='mb-2'>
              <Input
                type='number'
                placeholder='Enter amount'
                className='w-full border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800'
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
              />
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <Button
                variant='outline'
                className='flex items-center justify-center gap-1 bg-green-100 text-green-600 hover:bg-green-200 hover:text-green-700 dark:bg-green-900/20 dark:text-green-500 dark:hover:bg-green-900/30 dark:hover:text-green-400'
              >
                <ArrowDownToLine className='h-4 w-4' />
                <span>Deposit</span>
              </Button>
              <Button
                variant='outline'
                className='flex items-center justify-center gap-1 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/20 dark:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400'
                onClick={handleWithdraw}
                disabled={isPending}
              >
                <ArrowUpFromLine className='h-4 w-4' />
                <span>Withdraw</span>
              </Button>
            </div>
          </div>

          <Separator className='my-4' />

          <nav className='space-y-1'>
            {renderFilterButton('active', 'Active Bets', <History className='h-4 w-4' />)}
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
              {/* Mobile Profile Section */}
              <div className='mb-6 flex flex-col items-center gap-3 md:hidden'>
                <Avatar className='h-20 w-20 overflow-hidden rounded-full'>
                  <AvatarImage src='/trump.jpeg' alt='Profile' />
                  <AvatarFallback>
                    <span className='text-2xl font-bold text-orange-500'>U</span>
                  </AvatarFallback>
                </Avatar>
                <div className='text-center'>
                  <div className='text-xl font-bold'>
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
                  </div>
                </div>
                <div className='flex w-full max-w-xs items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-gray-800'>
                  <div className='text-center'>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>Balance</div>
                    <div className='font-bold'>
                      {formattedBalance} {tokenTextLogo}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>Network</div>
                    <div className='font-semibold'>{networkInfo.name}</div>
                  </div>
                </div>

                {/* Mobile Token Actions */}
                <div className='mt-2 w-full space-y-3'>
                  <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                    Token Actions
                  </div>
                  <div className='mb-2'>
                    <Input
                      type='number'
                      placeholder='Enter amount'
                      className='w-full border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800'
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <Button
                      variant='outline'
                      className='flex items-center justify-center gap-1 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/20 dark:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400'
                    >
                      <ArrowUpFromLine className='h-4 w-4' />
                      <span>Withdraw</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile Search */}
              <div className='mb-4 md:hidden'>
                <div className='relative'>
                  <Search
                    className='absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500 dark:text-gray-400'
                    size={18}
                  />
                  <Input
                    placeholder='Search your bets...'
                    className='border-gray-300 bg-white pl-10 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white'
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
                  <TabsList className='bg-gray-100 dark:bg-gray-900'>
                    <TabsTrigger
                      value='active'
                      className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800'
                    >
                      Active
                    </TabsTrigger>
                    {/* <TabsTrigger value='won' className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800'>
                      Won
                    </TabsTrigger>
                    <TabsTrigger value='lost' className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800'>
                      Lost
                    </TabsTrigger> */}
                    <TabsTrigger
                      value='all'
                      className='data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800'
                    >
                      All
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Betting Posts */}
              <div className='flex-1 space-y-4'>
                {filteredPools.map((bet) => (
                  <UserBettingPost
                    key={bet.id}
                    id={bet.id}
                    avatar='/trump.jpeg'
                    username='realDonaldTrump'
                    time={bet.pool.createdAt}
                    question={bet.pool.question}
                    options={bet.pool.options}
                    selectedOption={bet.option}
                    truthSocialId={bet.pool.originalTruthSocialPostId}
                    volume={calculateVolume(bet.pool, bet.tokenType)}
                    userBet={{
                      amount: bet.amount,
                      selectedOption: bet.pool.options,
                    }}
                    tokenType={bet.tokenType}
                  />
                ))}
                {filteredPools.length === 0 && (
                  <div className='py-8 text-center text-gray-500 dark:text-gray-400'>
                    No bets found for this filter
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <div className='hidden w-80 overflow-y-auto border-l border-gray-200 p-4 md:block dark:border-gray-800'>
          {/* Search */}
          <div className='mb-6'>
            <div className='relative'>
              <Search
                className='absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500 dark:text-gray-400'
                size={18}
              />
              <Input
                placeholder='Search your bets...'
                className='dark:bg-background border-gray-300 bg-white pl-10 text-gray-900 dark:border-gray-700 dark:text-white'
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Highest Volume */}
          {memoizedHighestVolume}

          {/* Ending Soon */}
          {memoizedEndingSoon}
        </div>
      </div>
    </div>
  );
}
