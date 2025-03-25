'use client';

import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useTokenContext } from '@/hooks/useTokenContext';
import { useWalletAddress } from '@/hooks/useWalletAddress';
import { Bet_OrderBy, PoolStatus } from '@/lib/__generated__/graphql';
import { bettingContractAbi, pointsTokenAbi } from '@/lib/contract.types';
import { useQuery as useQueryA } from '@apollo/client';
import { usePrivy, useSignMessage, useWallets } from '@privy-io/react-auth';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { togglePoolFacts } from '@/app/actions/pool-facts';
import { GET_BETS, GET_POOL } from '@/app/queries';
import { Activity } from '@/components/Activity';
import CommentSectionWrapper from '@/components/comments/comment-section-wrapper';
import TruthSocial from '@/components/common/truth-social';
import { Related } from '@/components/Related';
import CountdownTimer from '@/components/Timer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Slider } from '@/components/ui/slider';
import { POLLING_INTERVALS, USDC_DECIMALS } from '@/consts';
import { APP_ADDRESS } from '@/consts/addresses';
import { TokenType } from '@/lib/__generated__/graphql';
import { cn } from '@/lib/utils';
import { calculateOptionPercentages, getVolumeForTokenType } from '@/utils/betsInfo';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

// Types for our components
//TODO This type is not needed, we can use query types, but that'll break things in here
export interface PoolData {
  id: string;
  question: string;
  options: string[];
  createdAt: number;
  status: PoolStatus;
  betsCloseAt: number;
  pointsBetTotals: string[];
  usdcBetTotals: string[];
  bets: Array<{
    user: string;
    amount: number;
    option: string;
    updatedAt?: number;
    id: string;
  }>;
  originalTruthSocialPostId?: string;
}

interface PostData {
  post?: {
    image_url: string;
  };
}

interface PoolHeaderProps {
  pool: PoolData;
  postData?: PostData;
}

// Component for Pool Header
const PoolHeader = ({ pool, postData }: PoolHeaderProps) => (
  <CardHeader className='pb-4'>
    <div className='mb-2 flex flex-wrap items-start justify-between gap-2'>
      <div className='flex items-center'>
        <Avatar className='mr-2 h-8 w-8'>
          <AvatarImage
            src={postData ? postData?.post?.image_url : '/trump.jpeg'}
            alt='realDonaldTrump'
          />
          <AvatarFallback>
            <Image src={'/trump.jpeg'} alt='User' width={32} height={32} />
          </AvatarFallback>
        </Avatar>
        <div className='text-sm'>
          <div className='font-bold'>realDonaldTrump</div>
          <span className='text-muted-foreground'>
            {new Date(Number(pool.createdAt) * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        {pool.status === PoolStatus.Pending || pool.status === PoolStatus.None ? (
          <div className='flex items-center'>
            <span className='relative flex h-3 w-3'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'></span>
              <span className='relative inline-flex h-3 w-3 rounded-full bg-green-500'></span>
            </span>
          </div>
        ) : (
          <Badge variant='secondary' className='bg-red-500'>
            CLOSED
          </Badge>
        )}
        <span className='text-muted-foreground text-xs'>
          {formatDistanceToNow(new Date(pool.createdAt * 1000), { addSuffix: true })}
        </span>
        <TruthSocial postId={pool.originalTruthSocialPostId || ''} />
      </div>
    </div>

    <CardTitle className='text-2xl font-bold'>{pool.question}</CardTitle>
  </CardHeader>
);

// Calculate the number of unique betters based on pool data
const calculateBettors = (pool: PoolData): number => {
  if (!pool) return 0;

  if (pool.bets && pool.bets.length > 0) {
    const uniqueAddresses = new Set();
    pool.bets.forEach((bet) => {
      if (bet.user) {
        uniqueAddresses.add(bet.user);
      }
    });
    return uniqueAddresses.size;
  }

  return 0;
};

interface PoolStatsProps {
  pool: PoolData;
  totalVolume: string;
}

// Component for Pool Stats
const PoolStats = ({ pool, totalVolume }: PoolStatsProps) => (
  <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
    {/* Volume Card */}
    <div className='bg-card flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800'>
      <div className='mb-2 rounded-full bg-green-100 p-2 dark:bg-green-900/30'>
        <TrendingUp className='text-green-500' size={20} />
      </div>
      <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
        Total Vol
      </p>
      <p className='mt-1 text-xl font-bold'>{totalVolume}</p>
    </div>

    {/* Time Left Card */}
    <div className='bg-card flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800'>
      <div className='mb-2 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30'>
        <Clock className='text-blue-500' size={20} />
      </div>
      <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
        Bets close
      </p>
      <div className='mt-1 text-xl font-bold'>
        <CountdownTimer
          showClockIcon={false}
          closesAt={pool.betsCloseAt * 1000}
          digitClassName='text-white'
          colonClassName='text-white'
        />
      </div>
    </div>

    {/* Bettors Card */}
    <div className='bg-card flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800'>
      <div className='mb-2 rounded-full bg-orange-100 p-2 dark:bg-orange-900/30'>
        <Users className='text-orange-500' size={20} />
      </div>
      <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>Bettors</p>
      <p className='mt-1 text-xl font-bold'>{calculateBettors(pool)}</p>
    </div>
  </div>
);

interface TokenBalance {
  value: string | bigint;
  decimals: number;
  formatted?: string;
  symbol?: string;
}

interface BettingFormProps {
  pool: PoolData;
  handlePercentageClick: (percentage: number) => void;
  sliderValue: number[];
  setSliderValue: React.Dispatch<React.SetStateAction<number[]>>;
  betAmount: string;
  setBetAmount: React.Dispatch<React.SetStateAction<string>>;
  selectedOption: number | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<number | null>>;
  handleBet: () => Promise<void>;
  authenticated: boolean;
  isPending: boolean;
  approvedAmount: string;
  symbol: string;
  tokenLogo: React.ReactNode;
  balance: TokenBalance | null | undefined;
  formattedBalance: string;
  setUserEnteredValue: React.Dispatch<React.SetStateAction<string>>;
  userEnteredValue: string;
}

// Component for Betting Form
const BettingForm = ({
  pool,
  handlePercentageClick,
  sliderValue,
  setSliderValue,
  betAmount,
  setBetAmount,
  selectedOption,
  setSelectedOption,
  handleBet,
  authenticated,
  isPending,
  approvedAmount,
  symbol,
  tokenLogo,
  balance,
  formattedBalance,
  setUserEnteredValue,
  userEnteredValue,
}: BettingFormProps) => {
  return (
    <div className='mt-6 border-t border-gray-800 pt-4'>
      <h4 className='mb-2 text-sm font-bold'>Place your bet</h4>

      {/* Option Buttons */}
      <div className='mb-4 grid grid-cols-2 gap-2'>
        {pool.options.map((option, i) => (
          <Button
            key={i}
            className={cn(
              'w-full',
              selectedOption === i
                ? i === 0
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
                : i === 0
                  ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                  : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
            )}
            onClick={() => setSelectedOption(i)}
          >
            {option}
          </Button>
        ))}
      </div>

      {/* Percentage Buttons */}
      <div className='mb-2 grid grid-cols-4 gap-1'>
        {[25, 50, 75, 100].map((percent) => (
          <Button
            key={percent}
            variant='outline'
            size='sm'
            className='w-full text-xs'
            onClick={() => handlePercentageClick(percent)}
          >
            {percent}%
          </Button>
        ))}
      </div>

      {/* Slider */}
      <div className='my-4'>
        <Slider
          defaultValue={[0]}
          max={100}
          step={1}
          value={sliderValue}
          onValueChange={(newValue) => {
            // When slider is directly manipulated, clear userEnteredValue
            setUserEnteredValue('');
            setSliderValue(newValue);
          }}
          className='mb-2'
        />
      </div>

      <div className='relative mb-4 flex flex-col gap-2 sm:flex-row'>
        <div className='relative flex-1'>
          <Input
            type='text'
            inputMode='numeric'
            placeholder='0'
            className='h-10 pr-16'
            value={betAmount}
            onChange={(e) => {
              const value = e.target.value;

              // Flag that user is typing and store direct input
              setUserEnteredValue(value);

              // Empty input handling
              if (value === '') {
                setBetAmount('');
                setSliderValue([0]);
                return;
              }

              // Only allow whole numbers (no decimals)
              if (/^[0-9]+$/.test(value)) {
                // Set input value immediately and preserve it
                setBetAmount(value);

                // Update slider if balance exists
                if (balance) {
                  const inputNum = parseInt(value, 10);
                  const balanceNum = Number(balance.value) / Math.pow(10, balance.decimals);

                  if (inputNum > 0 && balanceNum > 0) {
                    // Calculate percentage of balance
                    const percentage = Math.min(100, Math.ceil((inputNum / balanceNum) * 100));
                    setSliderValue([percentage]);
                  }
                } else {
                  setSliderValue([0]);
                }
              }
            }}
          />
          <div className='absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-400'>
            <span className='mr-1'>{tokenLogo}</span> {symbol}
          </div>
        </div>
        {balance && (
          <div className='-bottom-5 left-0 text-xs text-gray-400 md:absolute'>
            Balance: {formattedBalance}
          </div>
        )}

        <Button
          onClick={handleBet}
          disabled={!betAmount || selectedOption === null || !authenticated || isPending}
          className='h-10 w-full bg-orange-500 font-medium text-black hover:bg-orange-600 hover:text-black sm:w-auto dark:text-black'
          title={
            !betAmount || selectedOption === null
              ? 'Please enter a bet amount and select an option'
              : !authenticated
                ? 'Please connect your wallet'
                : ''
          }
        >
          {isPending
            ? 'Processing...'
            : approvedAmount && parseFloat(approvedAmount) >= parseFloat(betAmount || '0')
              ? 'Place Bet'
              : 'Approve Tokens'}
        </Button>
      </div>

      {selectedOption !== null && (
        <p className='mb-4 text-xs text-gray-400'>
          You are betting {betAmount || '0'} <span className='mx-1'>{tokenLogo}</span> {symbol} on
          &quot;{pool.options[selectedOption]}&quot;
        </p>
      )}
    </div>
  );
};

interface FactsButtonProps {
  handleFacts: () => Promise<void>;
  hasFactsed: boolean;
  isFactsProcessing: boolean;
  poolFacts: number;
}

// Component for Facts Button
const FactsButton = ({
  handleFacts,
  hasFactsed,
  isFactsProcessing,
  poolFacts,
}: FactsButtonProps) => (
  <Button
    variant={hasFactsed ? 'default' : 'outline'}
    size='sm'
    className={cn(
      'h-10 gap-2 font-medium',
      hasFactsed
        ? 'bg-orange-500 text-black hover:bg-orange-600 hover:text-black dark:text-black'
        : 'border-orange-500 text-orange-500 hover:text-orange-500 dark:border-orange-500 dark:text-orange-500'
    )}
    onClick={handleFacts}
    disabled={isFactsProcessing}
  >
    {isFactsProcessing ? (
      <span className='flex items-center justify-center'>
        <span className='mr-1 h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent'></span>
        FACTS
      </span>
    ) : (
      <>
        FACTS{hasFactsed ? <span className='ml-1.5'>🦅</span> : ''}{' '}
        <span className='ml-1.5'>{poolFacts}</span>
      </>
    )}
  </Button>
);

interface BetData {
  id: string;
  amount: number;
  option: string;
  updatedAt?: number;
  user: string;
}

interface PlacedBets {
  bets: BetData[];
}

interface UserBetsProps {
  placedBets: PlacedBets | undefined;
  pool: PoolData;
  USDC_DECIMALS: number;
  tokenLogo: React.ReactNode;
  symbol: string;
}

// Component for User's Placed Bets
const UserBets = ({ placedBets, pool, USDC_DECIMALS, tokenLogo, symbol }: UserBetsProps) => {
  if (!placedBets?.bets || placedBets.bets.length === 0) return null;

  return (
    <div className='mt-6 border-t border-gray-800 pt-4'>
      <h4 className='mb-3 flex items-center text-sm font-bold'>
        <span>Your Bets</span>
        <Badge variant='outline' className='ml-2 px-2 py-0 text-xs'>
          {placedBets.bets.length}
        </Badge>
      </h4>
      <div className='space-y-3'>
        {placedBets.bets.map((bet) => (
          <div
            key={bet.id}
            className='rounded-lg border border-gray-200 p-3 transition-all hover:shadow-sm dark:border-gray-800'
          >
            <div className='mb-1 flex items-center justify-between'>
              <div className='flex items-center'>
                <div
                  className={`mr-2 h-2 w-2 rounded-full ${
                    Number(bet.option) === 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span
                  className={`font-medium ${
                    Number(bet.option) === 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {pool.options[Number(bet.option)]}
                </span>
              </div>
              <span className='flex items-center font-bold'>
                {bet.amount / Math.pow(10, USDC_DECIMALS)}
                <span className='ml-1'>{tokenLogo}</span>
                <span className='ml-1'>{symbol}</span>
              </span>
            </div>
            <div className='text-muted-foreground text-xs'>
              {bet.updatedAt ? (
                <>
                  Updated{' '}
                  {formatDistanceToNow(new Date(bet.updatedAt * 1000), {
                    addSuffix: true,
                  })}
                </>
              ) : (
                <>Bet placed</>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TabSwitcherProps {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
  pool: PoolData;
  comments: any[];
  isCommentsLoading: boolean;
  commentsError: unknown;
}

// Component for Tab Switcher
const TabSwitcher = ({
  selectedTab,
  setSelectedTab,
  pool,
  comments,
  isCommentsLoading,
  commentsError,
}: TabSwitcherProps) => (
  <div className='mt-6'>
    <div className='border-b border-gray-200 dark:border-gray-700'>
      <nav className='-mb-px flex space-x-4' aria-label='Tabs'>
        <button
          className={cn(
            'cursor-pointer border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap',
            'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
            'border-transparent',
            selectedTab === 'comments' && 'border-orange-500 text-orange-600'
          )}
          onClick={() => setSelectedTab('comments')}
        >
          Comments
        </button>
        <button
          className={cn(
            'cursor-pointer border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap',
            'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
            'border-transparent',
            selectedTab === 'activity' && 'border-orange-500 text-orange-600'
          )}
          onClick={() => setSelectedTab('activity')}
        >
          Activity
        </button>
        <button
          className={cn(
            'cursor-pointer border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap',
            'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
            'border-transparent',
            selectedTab === 'related' && 'border-orange-500 text-orange-600'
          )}
          onClick={() => setSelectedTab('related')}
        >
          Related
        </button>
      </nav>
    </div>
    <div className='mt-4'>
      {selectedTab === 'comments' && (
        <CommentSectionWrapper
          poolId={pool.id}
          initialComments={comments || []}
          isLoading={isCommentsLoading}
          error={commentsError as Error}
        />
      )}
      {selectedTab === 'activity' && <Activity pool={pool} />}
      {selectedTab === 'related' && <Related question={pool.question} />}
    </div>
  </div>
);

interface BettingProgressProps {
  percentages: number[];
  pool: PoolData;
  totalVolume: string;
}

// Component for Betting Progress
const BettingProgress = ({ percentages, pool, totalVolume }: BettingProgressProps) => {
  const isZeroState = totalVolume === '$0' || totalVolume === '0 pts' || percentages[0] === 0;

  return (
    <div className='mb-6'>
      <ProgressBar
        percentages={percentages}
        height='h-4'
        className='mb-2'
        isZeroState={isZeroState}
      />
      <div className='mb-2 flex justify-between text-sm font-medium'>
        {pool.options.map((option: string, index: number) => (
          <span
            key={index}
            className={
              index === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }
          >
            {option} {percentages[index]}%
          </span>
        ))}
      </div>
    </div>
  );
};

export default function PoolDetailPage() {
  // Router and authentication
  const { id } = useParams();
  const { isConnected, authenticated } = useWalletAddress();
  const { login } = usePrivy();
  const publicClient = usePublicClient();
  const account = useAccount();
  const { ready } = usePrivy();
  const { wallets } = useWallets();
  const [selectedTab, setSelectedTab] = useState<string>('comments');
  const { data: postData } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await fetch(`/api/post?poolId=${id}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    staleTime: 60000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Component state
  const [betAmount, setBetAmount] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState<number[]>([0]);
  const [userEnteredValue, setUserEnteredValue] = useState<string>('');
  const [poolFacts, setPoolFacts] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem(`pool_facts_${id}`) || '0', 10) || 5;
    }
    return 5;
  });
  const [hasFactsed, setHasFactsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`pool_facts_liked_${id}`) === 'true';
    }
    return false;
  });
  const [isFactsProcessing, setIsFactsProcessing] = useState<boolean>(false);
  const [approvedAmount, setApprovedAmount] = useState<string>('0');

  const { tokenType, getTokenAddress } = useTokenContext();
  const { signMessage } = useSignMessage();

  // Contract interaction
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const tokenTypeC = tokenType === TokenType.Usdc ? 0 : 1;

  // Use our custom hook for token balance
  const { balance, formattedBalance, symbol, tokenLogo } = useTokenBalance();

  // Pool data fetching
  const {
    data,
    loading: isPoolLoading,
    error: poolError,
  } = useQueryA(GET_POOL, {
    variables: { poolId: id },
    notifyOnNetworkStatusChange: true,
    pollInterval: POLLING_INTERVALS['pool-drilldown'],
  });

  const { data: placedBets } = useQueryA(GET_BETS, {
    variables: {
      filter: {
        user: account.address,
        poolId: id,
      },
      orderBy: Bet_OrderBy.CreatedAt,
      orderDirection: 'desc',
    },
    context: { name: `placedbets${id}` },
    notifyOnNetworkStatusChange: true,
    pollInterval: POLLING_INTERVALS['explore-pools'],
  });

  // Comments data fetching
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const res = await fetch(`/api/comments?poolId=${id}`);
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    staleTime: 60000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Safely extract comments from the response
  const comments = commentsData?.comments || [];

  // Check URL parameters for bet information
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const amountParam = urlParams.get('amount');
      const optionParam = urlParams.get('option');

      if (amountParam && !isNaN(Number(amountParam))) {
        const amount = Number(amountParam);
        setBetAmount(amount.toString());

        // Set slider value based on balance
        if (balance) {
          const maxAmount = Number(balance.value) / Math.pow(10, balance.decimals);
          const percentage = Math.min(100, (amount / maxAmount) * 100);
          setSliderValue([percentage]);
        }
      }

      if (optionParam && !isNaN(Number(optionParam))) {
        const optionValue = Number(optionParam);
        setSelectedOption(optionValue);
      }

      // Clear the URL parameters
      if (amountParam || optionParam) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [balance]);

  // Fetch initial FACTS count and status
  useEffect(() => {
    const fetchInitialFacts = async () => {
      try {
        // First check localStorage for immediate display
        const localFacts = parseInt(localStorage.getItem(`pool_facts_${id}`) || '0', 10) || 5;
        const localHasFactsed = localStorage.getItem(`pool_facts_liked_${id}`) === 'true';

        setPoolFacts(localFacts);
        setHasFactsed(localHasFactsed);

        // Then try to fetch from server for more accurate data
        if (ready && id) {
          try {
            const walletAddress =
              wallets && wallets[0]?.address ? wallets[0].address.toLowerCase() : '';
            const res = await fetch(`/api/pool-facts?poolId=${id}&address=${walletAddress}`);

            if (res.ok) {
              const data = await res.json();

              if (typeof data.count === 'number') {
                setPoolFacts(Math.max(data.count, 5)); // Ensure at least 5 FACTS
                setHasFactsed(!!data.userLiked);

                localStorage.setItem(`pool_facts_${id}`, data.count.toString());
                localStorage.setItem(`pool_facts_liked_${id}`, data.userLiked.toString());
              }
            }
          } catch (error) {
            console.error('Error fetching FACTS data:', error);
          }
        }
      } catch (error) {
        console.error('Error initializing FACTS data:', error);
      }
    };

    fetchInitialFacts();
  }, [id, wallets, ready, authenticated]);

  // Update bet amount when slider changes
  useEffect(() => {
    if (!balance || userEnteredValue) return;

    const rawBalanceValue = Number(balance.value) / Math.pow(10, balance.decimals);

    if (sliderValue[0] > 0) {
      const percentage = sliderValue[0] / 100;

      // Special case for 100%
      if (sliderValue[0] === 100) {
        const exactAmount = Math.ceil(rawBalanceValue).toString();
        if (exactAmount !== betAmount) {
          setBetAmount(exactAmount);
        }
        return;
      }

      // Compensate for the 1-off error
      const amount = Math.max(Math.ceil(rawBalanceValue * percentage), 1);
      const amountStr = amount.toString();

      // Don't set the value if it's already the same (prevents cursor jumping)
      if (amountStr !== betAmount) {
        setBetAmount(amountStr);
      }
    } else if (sliderValue[0] === 0 && betAmount !== '') {
      setBetAmount('');
    }
  }, [sliderValue, balance, betAmount, userEnteredValue]);

  // Fetch approved amount
  useEffect(() => {
    const fetchApprovedAmount = async () => {
      if (!account.address || !publicClient) return;

      try {
        const tokenAddress = getTokenAddress() as `0x${string}`;
        const allowance = await publicClient.readContract({
          abi: pointsTokenAbi,
          address: tokenAddress,
          functionName: 'allowance',
          args: [account.address as `0x${string}`, APP_ADDRESS],
        });

        const formattedAllowance = Number(allowance) / 10 ** USDC_DECIMALS;
        setApprovedAmount(formattedAllowance.toString());
      } catch (error) {
        setApprovedAmount('0');
        console.error('Error fetching approved amount:', error);
      }
    };

    fetchApprovedAmount();
  }, [account.address, publicClient, hash, getTokenAddress]);

  // Show success toasts
  useEffect(() => {
    if (isConfirmed) {
      showSuccessToast('Transaction confirmed!');
    }
  }, [isConfirmed]);

  // Handle percentage button clicks
  const handlePercentageClick = (percentage: number) => {
    if (!balance) return;

    const rawBalanceValue = Number(balance.value) / Math.pow(10, balance.decimals);

    let amount;
    if (percentage === 100) {
      amount = Math.ceil(rawBalanceValue);
    } else if (percentage === 0) {
      amount = 0;
    } else {
      amount = Math.max(Math.ceil((rawBalanceValue * percentage) / 100), 1);
    }

    setBetAmount(amount.toString());
    setSliderValue([percentage]);
    setUserEnteredValue('');
  };

  // Handle FACTS button click
  const handleFacts = async () => {
    if (!isConnected) {
      login();
      return;
    }

    setIsFactsProcessing(true);

    try {
      const wallet = wallets?.[0];
      if (!wallet || !wallet.address) {
        setIsFactsProcessing(false);
        return;
      }

      const newIsFactsed = !hasFactsed;

      // Create message for signature
      const messageObj = {
        action: 'toggle_facts',
        poolId: id,
        operation: newIsFactsed ? 'like' : 'unlike',
        timestamp: new Date().toISOString(),
        account: wallet.address.toLowerCase(),
      };

      const messageStr = JSON.stringify(messageObj);

      // Request signature from user
      const { signature } = await signMessage(
        { message: messageStr },
        {
          uiOptions: {
            title: newIsFactsed ? 'Sign to FACTS' : 'Sign to remove FACTS',
            description: 'Sign this message to verify your action',
            buttonText: 'Sign',
          },
          address: wallet.address,
        }
      );

      // Call the server action
      const result = await togglePoolFacts(
        id as string,
        newIsFactsed ? 'like' : 'unlike',
        signature,
        messageStr
      );

      if (result.success) {
        const serverFactsCount =
          typeof result.facts === 'number'
            ? Math.max(result.facts, 5)
            : newIsFactsed
              ? poolFacts + 1
              : Math.max(5, poolFacts - 1);

        setHasFactsed(newIsFactsed);
        setPoolFacts(serverFactsCount);

        localStorage.setItem(`pool_facts_${id}`, serverFactsCount.toString());
        localStorage.setItem(`pool_facts_liked_${id}`, newIsFactsed.toString());
      } else {
        console.error('Error from server:', result.error);
      }
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('rejected') ||
          error.message.includes('cancel') ||
          error.message.includes('user rejected'))
      ) {
        // User rejected, silent error
      } else {
        console.error('Error handling FACTS:', error);
      }
    } finally {
      setIsFactsProcessing(false);
    }
  };

  // Handle bet placement
  const handleBet = async () => {
    if (!writeContract || !ready || !publicClient || !wallets?.length) {
      return console.error('Wallet or contract not ready');
    }

    if (!betAmount || betAmount === '0' || selectedOption === null) {
      return console.error('Invalid bet parameters');
    }

    if (!account.address) {
      return console.error('Account address is not available');
    }

    if (!data?.pool.id) {
      return console.error('Pool ID is not available');
    }

    try {
      const amount = parseInt(betAmount, 10);
      const tokenAmount = BigInt(Math.floor(amount * 10 ** USDC_DECIMALS));

      const needsApproval = !approvedAmount || parseFloat(approvedAmount) < amount;
      if (needsApproval && !isConfirmed) {
        const tokenAddress = getTokenAddress() as `0x${string}`;
        const { request: approveRequest } = await publicClient.simulateContract({
          abi: pointsTokenAbi,
          address: tokenAddress,
          functionName: 'approve',
          account: account.address as `0x${string}`,
          args: [APP_ADDRESS, tokenAmount],
        });

        writeContract(approveRequest);
        return showSuccessToast(`Approving ${betAmount} ${symbol}...`);
      }

      const { request } = await publicClient.simulateContract({
        abi: bettingContractAbi,
        address: APP_ADDRESS,
        functionName: 'placeBet',
        account: account.address as `0x${string}`,
        args: [
          BigInt(data?.pool.id),
          BigInt(selectedOption),
          tokenAmount,
          account.address as `0x${string}`,
          tokenTypeC,
        ],
      });

      writeContract(request);
      showSuccessToast(
        `Betting ${betAmount} ${symbol} on "${data.pool.options[selectedOption]}"...`
      );
      setBetAmount('');
      setSelectedOption(null);
      setSliderValue([0]);
    } catch (error) {
      console.error('Error placing bet:', error);
      showErrorToast('Failed to place bet. Please try again.');
    }
  };

  // Loading state
  if (isPoolLoading) {
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

  // Error state
  if (poolError || !data?.pool) {
    return (
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <Link href='/explore' className='text-muted-foreground mb-6 flex items-center'>
          <ArrowLeft className='mr-2' size={16} />
          Back to Predictions
        </Link>
        <Card>
          <CardContent className='pt-6'>
            <div className='py-12 text-center'>
              <h2 className='mb-2 text-2xl font-bold'>Pool Not Found</h2>
              <p className='text-muted-foreground'>
                The prediction you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Button className='mt-6' asChild>
                <Link href='/explore'>View All Predictions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { pool } = data;
  const isActive = pool.status === PoolStatus.Pending || pool.status === PoolStatus.None;
  const totalVolume = getVolumeForTokenType(pool, tokenType);

  // Calculate percentages
  const percentages = calculateOptionPercentages(pool);

  if (!pool) return <div>Pool not found...</div>;

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <Link href='/explore' className='text-muted-foreground mb-6 flex items-center'>
        <ArrowLeft className='mr-2' size={16} />
        Back to Predictions
      </Link>

      <Card className='mb-6'>
        <PoolHeader pool={pool} postData={postData} />

        <CardContent>
          {postData && postData.post && (
            <Image
              src={postData.post.image_url}
              alt='Post Image'
              width={500}
              height={300}
              className='mb-4 w-full rounded-lg'
            />
          )}

          {/* Progress Bar */}
          <BettingProgress percentages={percentages} pool={pool} totalVolume={totalVolume} />

          {/* Stats */}
          <PoolStats pool={pool} totalVolume={totalVolume} />

          {/* Betting form and FACTS button */}
          {isActive && (
            <div className='flex flex-col space-y-4'>
              <BettingForm
                pool={pool}
                handlePercentageClick={handlePercentageClick}
                sliderValue={sliderValue}
                setSliderValue={setSliderValue}
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                handleBet={handleBet}
                authenticated={authenticated}
                isPending={isPending}
                approvedAmount={approvedAmount}
                symbol={symbol}
                tokenLogo={tokenLogo}
                balance={balance}
                formattedBalance={formattedBalance}
                setUserEnteredValue={setUserEnteredValue}
                userEnteredValue={userEnteredValue}
              />

              <div className='flex justify-end'>
                <FactsButton
                  handleFacts={handleFacts}
                  hasFactsed={hasFactsed}
                  isFactsProcessing={isFactsProcessing}
                  poolFacts={poolFacts}
                />
              </div>
            </div>
          )}

          {/* User's bets */}
          <UserBets
            placedBets={placedBets}
            pool={pool}
            USDC_DECIMALS={USDC_DECIMALS}
            tokenLogo={tokenLogo}
            symbol={symbol}
          />

          {/* Tabs */}
          <TabSwitcher
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            pool={pool}
            comments={comments}
            isCommentsLoading={isCommentsLoading}
            commentsError={commentsError}
          />
        </CardContent>
      </Card>
    </div>
  );
}
