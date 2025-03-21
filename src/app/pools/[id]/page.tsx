'use client';

import { betABI } from '@/abi/bet';
import { GET_POOL } from '@/app/queries';
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
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useWalletAddress } from '@/hooks/useWalletAddress';
import { Pool, PoolStatus } from '@/lib/__generated__/graphql';
import { cn } from '@/lib/utils';
import { Comment } from '@/types';
import { useQuery as useQueryA } from '@apollo/client';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Clock,
  MessageCircle,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWriteContract } from 'wagmi';

export default function PoolDetailPage() {
  const { id } = useParams();
  const { login } = usePrivy();
  const { isConnected, authenticated } = useWalletAddress();

  const [betAmount, setBetAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState([0]);
  const [poolFacts, setPoolFacts] = useState(
    Math.floor(Math.random() * 50) + 5
  );
  const [hasFactsed, setHasFactsed] = useState(false);

  // Use our custom hook for token balance
  const { balance, formattedBalance, symbol, tokenTextLogo } =
    useTokenBalance();

  // Update bet amount when slider changes
  useEffect(() => {
    if (sliderValue[0] > 0 && balance) {
      const percentage = sliderValue[0] / 100;
      const maxAmount = parseFloat(balance.formatted);
      const amount = (maxAmount * percentage).toFixed(6);
      setBetAmount(amount);
    } else if (sliderValue[0] === 0) {
      setBetAmount('');
    }
  }, [sliderValue, balance]);

  // Handle percentage button clicks
  const handlePercentageClick = (percentage: number) => {
    if (balance) {
      const maxAmount = parseFloat(balance.formatted);
      const amount = Math.floor(maxAmount * (percentage / 100)).toString();
      setBetAmount(amount);
      setSliderValue([percentage]);
    }
  };

  const { data: hash, writeContract } = useWriteContract();
  const [chosenOption, setChosenOption] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const tokenType = 0;
  const { wallets } = useWallets();
  const { ready } = usePrivy();

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

  const {
    data,
    loading: isPoolLoading,
    error: poolError,
  } = useQueryA<{ pool: Pool }>(GET_POOL, {
    variables: { poolId: id },
    notifyOnNetworkStatusChange: true,
  });

  const handleFacts = () => {
    if (hasFactsed) return;

    // Increment the facts count
    setPoolFacts((prevCount) => prevCount + 1);
    setHasFactsed(true);

    // If the user is logged in, add a "FACTS" comment
    if (isConnected && authenticated) {
      // Attempt to refetch comments after a delay to show the new FACTS comment
      setTimeout(() => {
        refetchComments();
      }, 2000);
    }
  };

  // Place bet function
  const placeBet = () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!betAmount || selectedOption === null) return;

    // Here you would connect to the smart contract
    alert(`Placing ${betAmount} USDC bet on option: ${pool.options[selectedOption]}`);
  };

  if (isPoolLoading) {
    return (
      <div className='container mx-auto max-w-4xl px-4 py-8'>Loading...</div>
    );
  }

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

  // Format the time left - assuming endTime exists (added fallback)
  const formatTimeLeft = () => {
    if (!pool.betsCloseAt) return 'Time not specified'; // Fallback for missing endTime

    const end = new Date(pool.betsCloseAt).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h remaining`;
  };

  // Calculate YES/NO percentages - assuming usdcBetTotals has at least 2 elements
  const calculatePercentages = () => {
    // If usdcBetTotals doesn't exist or is not properly formatted, return default values
    if (!Array.isArray(pool.usdcBetTotals) || pool.usdcBetTotals.length < 2) {
      return { yesPercentage: 50, noPercentage: 50 };
    }

    const yesAmount = Number(pool.usdcBetTotals[0]) || 0;
    const noAmount = Number(pool.usdcBetTotals[1]) || 0;
    const total = yesAmount + noAmount;

    if (total === 0) return { yesPercentage: 50, noPercentage: 50 };

    const yesPercentage = Math.round((yesAmount / total) * 100);
    const noPercentage = 100 - yesPercentage;

    return { yesPercentage, noPercentage };
  };

  const { yesPercentage, noPercentage } = calculatePercentages();

  const handleBet = async () => {
    if (!writeContract) return;

    console.log(wallets);

    try {
      if (!ready) {
        console.error('Privy is not ready');
        return;
      }

      if (!wallets?.length) {
        console.error('No wallet connected');
        return;
      }

      if (!amount || amount <= 0) {
        console.error('Invalid amount');
        return;
      }

      const tx = await writeContract({
        args: [pool.id, chosenOption, amount, wallets[0].address, tokenType],
        abi: betABI,
        address: '0x20e975516Fae905839F61754778483ecEA7EB403',
        functionName: 'placeBet',
        value: BigInt(amount),
      });
      console.log('Transaction:', tx);
      console.log('Transaction hash:', hash);
      // Handle transaction success (e.g., show a success message)
    } catch (error) {
      console.error('Error placing bet:', error);
      // Handle transaction error (e.g., show an error message)
    }
  };

  // Format total volume
  const formatTotalVolume = () => {
    if (!Array.isArray(pool.usdcBetTotals)) return '$0';

    const total = pool.usdcBetTotals.reduce((sum, bet) => sum + Number(bet), 0);
    return `$${total.toLocaleString()}`;
  };

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
              <Avatar className='mr-3 h-10 w-10'>
                <AvatarImage
                  src={
                    'https://ui-avatars.com/api/?name=Creator&background=orange&color=fff'
                  }
                  alt='Creator'
                />
                <AvatarFallback>CR</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>Pool Creator</p>
                <p className='text-muted-foreground text-sm'>
                  {new Date(Number(pool.createdAt)).toLocaleDateString()}
                </p>
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
              <p className='font-bold'>{formatTotalVolume()}</p>
            </div>
            <div className='bg-muted rounded-lg p-4 text-center'>
              <Clock className='mx-auto mb-2 text-orange-500' size={24} />
              <p className='text-muted-foreground text-sm'>Time Left</p>
              <p className='font-bold'>{formatTimeLeft()}</p>
            </div>
            <div className='bg-muted rounded-lg p-4 text-center'>
              <Users className='mx-auto mb-2 text-orange-500' size={24} />
              <p className='text-muted-foreground text-sm'>Participants</p>
              <p className='font-bold'>
                {Math.floor(Math.random() * 100) + 10}
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
                  Balance: {formattedBalance}{' '}
                  <span className='ml-1'>{tokenTextLogo}</span> {symbol}
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
              
              <div className='mb-4 flex flex-col sm:flex-row gap-2'>
                <div className='relative flex-1'>
                  <Input
                    type='number'
                    placeholder='0'
                    value={betAmount}
                    onChange={(e) => {
                      // Only allow whole numbers
                      const value = e.target.value;
                      setBetAmount(value);
                      // Update slider if there's a balance
                      if (balance && parseFloat(value) > 0) {
                        const maxAmount = parseFloat(balance.formatted);
                        const percentage = Math.min(100, (parseFloat(value) / maxAmount) * 100);
                        setSliderValue([percentage]);
                      } else {
                        setSliderValue([0]);
                      }
                    }}
                    className='pr-16'
                  />
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-400'>
                    <span className='mr-1'>{tokenTextLogo}</span> {symbol}
                  </div>
                </div>
                <Button 
                  onClick={placeBet} 
                  disabled={!betAmount || selectedOption === null || !authenticated}
                  className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
                >
                  Confirm Bet
                </Button>
              </div>

              {selectedOption !== null && (
                <p className='mb-4 text-xs text-gray-400'>
                  You are betting {betAmount || '0'}{' '}
                  <span className='mx-1'>{tokenTextLogo}</span> {symbol} on
                  &quot;{pool.options[selectedOption]}&quot;
                </p>
              )}
              
              <Button
                variant='outline'
                size='sm'
                className={cn(
                  "gap-1 font-bold",
                  hasFactsed 
                    ? 'bg-orange-500/10 text-orange-500 border-orange-500' 
                    : 'text-orange-500 hover:text-orange-500'
                )}
                onClick={handleFacts}
              >
                {hasFactsed ? 'FACTS 🦅' : 'FACTS'}
                <span className="ml-1.5">{poolFacts}</span>
              </Button>
              <p className="mt-2 text-xs text-gray-400">Share your support for this prediction.</p>
            </div>
          )}

          {/* Comments Section */}
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
              {isCommentsLoading ? (
                <div className='py-8 text-center'>Loading comments...</div>
              ) : commentsError ? (
                <div className='py-8 text-center text-red-500'>
                  Failed to load comments
                </div>
              ) : !comments || comments.length === 0 ? (
                <div className='py-4 text-center text-gray-500'>
                  No comments yet
                </div>
              ) : (
                <CommentSectionWrapper
                  poolId={pool.id}
                  initialComments={comments}
                  isLoading={false}
                  error={null}
                />
              )}
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
