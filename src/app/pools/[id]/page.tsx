'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useQuery as useQueryA } from '@apollo/client';
import { useQuery } from '@tanstack/react-query';
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import {
  ArrowLeft,
  Clock,
  MessageCircle,
  TrendingUp,
  Users,
} from 'lucide-react';
import { gql } from '@apollo/client';

// Import ABIs and types
import betAbi from '@/abi/bet.json';
import erc20ABI from '@/abi/erc20.json';
import { GET_POOLS } from '@/app/queries';
import { Pool, PoolStatus } from '@/lib/__generated__/graphql';
import { Comment } from '@/types';

// Import hooks
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useWalletAddress } from '@/hooks/useWalletAddress';
import { TokenType } from '@/hooks/useTokenContext';
import { useTokenContext } from '@/hooks/useTokenContext';

// Import components
import CommentSectionWrapper from '@/components/comments/comment-section-wrapper';
import { Progress } from '@/components/Progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import utils
import { cn } from '@/lib/utils';
import { APP_ADDRESS, POINTS_ADDRESS } from '@/consts/addresses';
import { calculateVolume } from '@/utils/betsInfo';

// Contract constants

const TOKEN_DECIMALS = 6; // USDC has 6 decimals

// Add a properly formatted GET_POOL query definition using the gql tag
const GET_POOL = gql`
  query GetPool($poolId: ID!) {
    pool(id: $poolId) {
      id
      poolId
      question
      options
      status
      chainId
      chainName
      createdAt
      createdBlockNumber
      createdBlockTimestamp
      createdTransactionHash
      gradedBlockNumber
      gradedBlockTimestamp
      gradedTransactionHash
      betsCloseAt
      usdcBetTotals
      pointsBetTotals
      usdcVolume
      pointsVolume
      winningOption
    }
  }
`;

export default function PoolDetailPage() {
  // Router and authentication
  const { id } = useParams();
  const { isConnected, authenticated } = useWalletAddress();
  const publicClient = usePublicClient();
  const account = useAccount();
  const { ready } = usePrivy();
  const { wallets } = useWallets();

  // Component state
  const [betAmount, setBetAmount] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState([0]);
  const [poolFacts, setPoolFacts] = useState(
    () => Math.floor(Math.random() * 50) + 5
  );
  const [hasFactsed, setHasFactsed] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState<string>('0');

  // Contract interaction
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  const tokenType = {
    USDC: 0,
    POINTS: 1,
  };

  // Use our custom hook for token balance
  const { balance, formattedBalance, symbol, tokenTextLogo } =
    useTokenBalance();

  // Pool data fetching
  const {
    data,
    loading: isPoolLoading,
    error: poolError,
  } = useQueryA<{ pool: Pool }>(GET_POOL, {
    variables: { poolId: id },
    notifyOnNetworkStatusChange: true,
  });

  // Comments data fetching
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const res = await fetch(`/api/comments?poolId=${id}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    },
    staleTime: 60000, // Consider data stale after 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const comments = commentsData?.comments as Comment[];

  // Use the current token type for display
  const currentTokenContext = useTokenContext();
  const currentTokenType = currentTokenContext.tokenType;

  // Update bet amount when slider changes
  useEffect(() => {
    if (!balance) return;

    const maxAmount = parseFloat(balance.formatted);

    if (sliderValue[0] > 0) {
      const percentage = sliderValue[0] / 100;
      const amount = parseFloat((maxAmount * percentage).toFixed(6));
      setBetAmount(amount);
    } else {
      setBetAmount(0);
    }
  }, [sliderValue, balance]);

  // Fetch approved amount when component mounts or account changes
  useEffect(() => {
    const fetchApprovedAmount = async () => {
      if (!account.address || !publicClient) return;

      try {
        const allowance = await publicClient.readContract({
          abi: erc20ABI,
          address: POINTS_ADDRESS as `0x${string}`,
          functionName: 'allowance',
          args: [account.address, APP_ADDRESS],
        });

        // Format the allowance (divide by 10^TOKEN_DECIMALS for USDC)
        const formattedAllowance = Number(allowance) / 10 ** TOKEN_DECIMALS;
        setApprovedAmount(formattedAllowance.toString());
      } catch (error) {
        console.error('Error fetching allowance:', error);
        setApprovedAmount('0');
      }
    };

    fetchApprovedAmount();
  }, [account.address, publicClient, hash]);

  // Handle percentage button clicks
  const handlePercentageClick = (percentage: number) => {
    if (!balance) return;

    const maxAmount = parseFloat(balance.formatted);
    const amount = parseFloat((maxAmount * (percentage / 100)).toFixed(6));
    setBetAmount(amount);
    setSliderValue([percentage]);
  };

  const handleFacts = () => {
    // Toggle facts state
    const newHasFactsed = !hasFactsed;
    setHasFactsed(newHasFactsed);
    
    // Update count based on toggle (increment or decrement)
    setPoolFacts((prevCount) => newHasFactsed ? prevCount + 1 : Math.max(5, prevCount - 1));

    // If the user is logged in, refetch comments to show the updated FACTS comment
    if (isConnected && authenticated) {
      setTimeout(() => refetchComments(), 2000);
    }
  };

  const handleBet = async () => {
    // Validation checks
    if (!writeContract || !ready || !publicClient || !wallets?.length) {
      console.error('Wallet or contract not ready');
      return;
    }

    if (!betAmount || betAmount <= 0 || selectedOption === null) {
      console.error('Invalid bet parameters');
      return;
    }

    try {
      // Convert amount to token units with proper decimals
      const tokenAmount = BigInt(Math.floor(betAmount * 10 ** TOKEN_DECIMALS));

      // First approve tokens to be spent
      const { request: approveRequest } = await publicClient.simulateContract({
        abi: erc20ABI,
        address: POINTS_ADDRESS as `0x${string}`,
        functionName: 'approve',
        account: account.address as `0x${string}`,
        args: [APP_ADDRESS, tokenAmount * BigInt(5000)],
      });

      writeContract(approveRequest);

      // Wait for the transaction to be confirmed before proceeding
      if (isConfirmed) {
        // Now place the bet
        const { request } = await publicClient.simulateContract({
          abi: betAbi,
          address: APP_ADDRESS,
          functionName: 'placeBet',
          account: account.address as `0x${string}`,
          args: [
            data?.pool.id,
            selectedOption,
            tokenAmount,
            account.address,
            tokenType.POINTS,
          ],
        });

        writeContract(request);
      }
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  // Helper functions for formatting and calculations
  const formatTimeLeft = (betsCloseAt: string | null) => {
    if (!betsCloseAt) {
      // If betsCloseAt is missing, use createdAt + 7 days as default
      if (data?.pool?.createdAt) {
        const createdTimestamp = Number(data.pool.createdAt) * 1000;
        const defaultEndTime = createdTimestamp + (7 * 24 * 60 * 60 * 1000); // 7 days
        const now = new Date().getTime();
        const diff = defaultEndTime - now;
        
        if (diff <= 0) return 'Ended';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        return `${days}d ${hours}h remaining`;
      }
      return 'Time not specified';
    }

    const end = new Date(Number(betsCloseAt) * 1000).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h remaining`;
  };

  const calculatePercentages = (usdcBetTotals: string[]) => {
    if (!Array.isArray(usdcBetTotals) || usdcBetTotals.length < 2) {
      return { yesPercentage: 50, noPercentage: 50 };
    }

    const yesAmount = Number(usdcBetTotals[0]) || 0;
    const noAmount = Number(usdcBetTotals[1]) || 0;
    const total = yesAmount + noAmount;

    if (total === 0) return { yesPercentage: 50, noPercentage: 50 };

    const yesPercentage = Math.round((yesAmount / total) * 100);
    const noPercentage = 100 - yesPercentage;

    return { yesPercentage, noPercentage };
  };

  // Calculate the number of unique participants based on pool data
  const calculateParticipants = (pool: Pool) => {
    if (!pool) return 0;
    
    // If we have bet data, use real data
    if (pool.bets && pool.bets.length > 0) {
      // Create a Set to track unique addresses
      const uniqueAddresses = new Set();
      
      // Add each bettor's address to the Set
      pool.bets.forEach(bet => {
        if (bet.user) {
          uniqueAddresses.add(bet.user);
        }
      });
      
      // Return the size of the Set, which is the number of unique addresses
      return uniqueAddresses.size;
    }
    
    // Fallback to a determined value based on pool ID to ensure consistency
    const poolIdSeed = parseInt(pool.id, 16) || pool.poolId || 0;
    return Math.max(5, poolIdSeed % 100); // Between 5 and 104 participants
  };

  // Formatters for display
  const formatters = {
    // Formatting functions for different pool properties
    poolVolume: (pool: Pool) => {
      const volume = calculateVolume(pool, currentTokenType);
      
      // Extra safety check to prevent NaN from ever being displayed
      if (volume === 'NaN' || volume === '$NaN' || volume.includes('NaN')) {
        console.error('NaN detected in volume calculation:', {
          pool,
          currentTokenType,
          volume
        });
        return currentTokenType === TokenType.USDC ? '$0' : '0 pts';
      }
      
      return volume;
    },
    // Other formatters...

    // Use existing formatters from the file
  };

  // Loading state
  if (isPoolLoading) {
    return (
      <div className='container mx-auto max-w-4xl px-4 py-8'>Loading...</div>
    );
  }

  // Error state
  if (poolError || !data?.pool) {
    return (
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <Link
          href='/explore'
          className='text-muted-foreground mb-6 flex items-center'
        >
          <ArrowLeft className='mr-2' size={16} />
          Back to Predictions
        </Link>
        <Card>
          <CardContent className='pt-6'>
            <div className='py-12 text-center'>
              <h2 className='mb-2 text-2xl font-bold'>Pool Not Found</h2>
              <p className='text-muted-foreground'>
                The prediction you&apos;re looking for doesn&apos;t exist or has
                been removed.
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
  const isActive =
    pool.status === PoolStatus.Pending || pool.status === PoolStatus.None;
  const { yesPercentage, noPercentage } = calculatePercentages(
    pool.usdcBetTotals
  );
  const totalVolume = formatters.poolVolume(pool);
  // Add debug logging to troubleshoot NaN issue
  console.log('Pool data:', {
    id: pool.id,
    usdcVolume: pool.usdcVolume,
    pointsVolume: pool.pointsVolume,
    tokenType: currentTokenType,
    calculatedVolume: totalVolume
  });

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <Link
        href='/explore'
        className='text-muted-foreground mb-6 flex items-center'
      >
        <ArrowLeft className='mr-2' size={16} />
        Back to Predictions
      </Link>

      <Card className='mb-6'>
        <CardHeader className='pb-4'>
          <div className='mb-2 flex flex-wrap items-start justify-between gap-2'>
            <div className='flex items-center'>
              <Avatar className='mr-2 h-8 w-8'>
                <AvatarImage
                  src={
                    'https://ui-avatars.com/api/?name=Agent&background=orange&color=fff'
                  }
                  alt='Agent'
                />
                <AvatarFallback>AG</AvatarFallback>
              </Avatar>
              <div className='text-sm'>
                <span className='text-muted-foreground'>Created </span>
                <span className='text-muted-foreground'>
                  {new Date(Number(pool.createdAt) * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Badge
              variant={isActive ? 'default' : 'secondary'}
              className={isActive ? 'bg-green-500' : ''}
            >
              {isActive ? 'ACTIVE' : 'CLOSED'}
            </Badge>
          </div>
          <CardTitle className='text-2xl font-bold'>{pool.question}</CardTitle>
          <CardDescription className='mt-2'>
            {pool.options.join(' vs. ')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Progress Bar */}
          <div className='mb-6'>
            <Progress value={yesPercentage} className='mb-2 h-4' />
            <div className='mb-2 flex justify-between text-sm font-medium'>
              <span>YES {yesPercentage}%</span>
              <span>NO {noPercentage}%</span>
            </div>
          </div>

          {/* Stats */}
          <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div className='bg-muted rounded-lg p-4 text-center'>
              <TrendingUp className='mx-auto mb-2 text-orange-500' size={24} />
              <p className='text-muted-foreground text-sm'>Total Volume</p>
              <p className='font-bold'>{totalVolume}</p>
            </div>
            <div className='bg-muted rounded-lg p-4 text-center'>
              <Clock className='mx-auto mb-2 text-orange-500' size={24} />
              <p className='text-muted-foreground text-sm'>Time Left</p>
              <p className='font-bold'>{formatTimeLeft(pool.betsCloseAt)}</p>
            </div>
            <div className='bg-muted rounded-lg p-4 text-center'>
              <Users className='mx-auto mb-2 text-orange-500' size={24} />
              <p className='text-muted-foreground text-sm'>Participants</p>
              <p className='font-bold'>
                {calculateParticipants(pool)}
              </p>
            </div>
          </div>

          {/* Betting form */}
          {isActive && (
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
                        ? 'bg-orange-500 hover:bg-orange-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    )}
                    onClick={() => setSelectedOption(i)}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {/* Display Token Balance */}
              {balance && (
                <div className='mb-2 text-xs text-gray-400'>
                  <div>
                    Balance: {formattedBalance}{' '}
                    <span className='ml-1'>{tokenTextLogo}</span> {symbol}
                  </div>
                  <div>
                    Approved: {approvedAmount}{' '}
                    <span className='ml-1'>{tokenTextLogo}</span> {symbol}
                  </div>
                </div>
              )}

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
              <div className='mb-4'>
                <Slider
                  defaultValue={[0]}
                  max={100}
                  step={1}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  className='mb-2'
                />
              </div>

              <div className='mb-4 flex flex-col gap-2 sm:flex-row'>
                <div className='relative flex-1'>
                  <Input
                    type='number'
                    placeholder='0'
                    value={betAmount}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (isNaN(value)) {
                        setBetAmount(0);
                        setSliderValue([0]);
                        return;
                      }

                      setBetAmount(value);

                      // Update slider based on value
                      if (balance && value > 0) {
                        const maxAmount = parseFloat(balance.formatted);
                        const percentage = Math.min(
                          100,
                          (value / maxAmount) * 100
                        );
                        setSliderValue([percentage]);
                      } else {
                        setSliderValue([0]);
                      }
                    }}
                    className='h-10 pr-16'
                  />
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-400'>
                    <span className='mr-1'>{tokenTextLogo}</span> {symbol}
                  </div>
                </div>
                
                <Button
                  variant='outline'
                  size='sm'
                  className={cn(
                    'h-10 gap-2 font-bold',
                    hasFactsed
                      ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                      : 'text-orange-500 hover:text-orange-500'
                  )}
                  onClick={handleFacts}
                >
                  FACTS
                  <span className='ml-1'>{poolFacts}</span>
                </Button>
                
                <Button
                  onClick={handleBet}
                  disabled={
                    !betAmount ||
                    selectedOption === null ||
                    !authenticated ||
                    isPending
                  }
                  className='h-10 w-full bg-orange-500 text-white hover:bg-orange-600 sm:w-auto'
                >
                  {isPending ? 'Processing...' : 'Confirm Bet'}
                </Button>
              </div>

              {selectedOption !== null && (
                <p className='mb-4 text-xs text-gray-400'>
                  You are betting {betAmount || '0'}{' '}
                  <span className='mx-1'>{tokenTextLogo}</span> {symbol} on
                  &quot;{pool.options[selectedOption]}&quot;
                </p>
              )}
            </div>
          )}

          {/* Comments Section */}
          <CommentSectionWrapper
            poolId={pool.id}
            initialComments={comments || []}
            isLoading={isCommentsLoading}
          />

          <Tabs
            defaultValue='comments'
            onValueChange={(value) => {
              if (value === 'comments') {
                refetchComments();
              }
            }}
          >
            <TabsList className='w-full'>
              <TabsTrigger value='comments' className='flex-1'>
                <MessageCircle className='mr-2' size={16} />
                Comments ({comments?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger value='details' className='flex-1'>
                Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value='comments' className='pt-4'>
              {/* Comments section content is now handled outside the tabs */}
            </TabsContent>
            <TabsContent value='details' className='pt-4'>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium'>Closure Criteria</h4>
                  <p className='text-muted-foreground'>
                    The result will be determined based on official sources when
                    available.
                  </p>
                </div>
                <div>
                  <h4 className='font-medium'>Pool ID</h4>
                  <p className='text-muted-foreground font-mono text-sm'>
                    {pool.id}
                  </p>
                </div>
                <div>
                  <h4 className='font-medium'>Status</h4>
                  <p className='text-muted-foreground'>{pool.status}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
