'use client';

import { isPoolFactsd, savePoolFacts } from '@/app/pool-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { USDC_DECIMALS } from '@/consts';
import { APP_ADDRESS } from '@/consts/addresses';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { TokenType, useTokenContext } from '@/hooks/useTokenContext';
import { PoolStatus } from '@/lib/__generated__/graphql';
import { bettingContractAbi, pointsTokenAbi } from '@/lib/contract.types';
import { usePrivy, useSignMessage, useWallets } from '@privy-io/react-auth';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { HandCoins, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import TruthSocial from './common/truth-social';
import CountdownTimer from './Timer';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { Badge } from './ui/badge';
import Image from 'next/image';

interface BettingPostProps {
  id: string;
  avatar: string;
  username: string;
  time: number; // Unix timestamp
  question: string;
  options: string[];
  truthSocialId: string;
  status: PoolStatus;
  commentCount?: number;
  volume?: string;
  optionBets?: string[];
  closesAt?: number;
  gradedBlockTimestamp?: number;
}

export function BettingPost({
  id,
  avatar,
  username,
  time,
  question,
  options,
  truthSocialId,
  status,
  commentCount = 0,
  volume = '0',
  optionBets = [],
  gradedBlockTimestamp,
  closesAt,
}: BettingPostProps) {
  // Form state
  const [betAmount, setBetAmount] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showBetForm, setShowBetForm] = useState(false);
  const [sliderValue, setSliderValue] = useState([0]);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [userEnteredValue, setUserEnteredValue] = useState<string>('');

  const { data: poolData } = useQuery({
    queryKey: ['pool', id],
    queryFn: async () => {
      const res = await fetch(`/api/post?poolId=${id}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      return res.json();
    },
    staleTime: 60000, // Consider data stale after 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState('0');

  // FACTS feature state
  const [factsCount, setFactsCount] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem(`pool_facts_${id}`) || '0', 10);
    }
    return 5;
  });
  const [hasFactsed, setHasFactsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`pool_facts_liked_${id}`) === 'true';
    }
    return false;
  });

  // Contract and wallet states
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const { signMessage } = useSignMessage();
  const { tokenType, getTokenAddress } = useTokenContext();
  const tokenTypeC = tokenType === TokenType.USDC ? 0 : 1;

  // Contract interaction hooks
  const publicClient = usePublicClient();
  const account = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Pool status
  const isActive = status === PoolStatus.Pending || status === PoolStatus.None;

  // Token balance
  const { balance, formattedBalance, symbol } = useTokenBalance();

  // Wallet connection status
  const isWalletConnected = authenticated && wallets && wallets.length > 0 && wallets[0]?.address;

  // Parse bets and calculate percentages
  const betData = useMemo(() => {
    // Parse all option bet amounts, removing any currency symbols and converting to numbers
    const betAmounts = optionBets.map(
      (bet) => parseFloat(bet.replace(/[$£€]/g, '').replace(/\s+pts/g, '')) || 0
    );

    // Calculate total volume
    const totalVolume = betAmounts.reduce((sum, amount) => sum + amount, 0);

    // Calculate exact percentages for each option
    const percentages = betAmounts.map((amount) =>
      totalVolume > 0 ? (amount / totalVolume) * 100 : 0
    );

    // For display, ensure percentages add up to 100% by rounding all but the last one
    // and setting the last one to the remainder
    const displayPercentages = [...percentages];
    if (totalVolume > 0) {
      // Round all percentages except the last one
      let total = 0;
      for (let i = 0; i < displayPercentages.length - 1; i++) {
        displayPercentages[i] = Math.round(displayPercentages[i]);
        total += displayPercentages[i];
      }
      // Set the last percentage to ensure sum is 100%
      displayPercentages[displayPercentages.length - 1] = 100 - total;
    }

    return {
      betAmounts,
      totalVolume,
      exactPercentages: percentages,
      displayPercentages,
    };
  }, [optionBets]);

  // Check localStorage for FACTS status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wasFactsd = isPoolFactsd(id);
      setHasFactsed(wasFactsd);
    }
  }, [id]);

  // Update bet amount when slider changes
  useEffect(() => {
    // Skip during user typing or if no balance
    if (isUserTyping || !balance) return;

    // Don't update if user directly typed a value
    if (userEnteredValue) return;

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

      // Calculate amount based on percentage (minimum 1)
      const amount = Math.max(Math.ceil(rawBalanceValue * percentage), 1);
      const amountStr = amount.toString();

      // Only update if value changed (prevents cursor jumping)
      if (amountStr !== betAmount) {
        setBetAmount(amountStr);
      }
    } else if (sliderValue[0] === 0 && betAmount !== '') {
      setBetAmount('');
    }
  }, [sliderValue, balance, betAmount, isUserTyping, userEnteredValue]);

  // Fetch approved token amount
  useEffect(() => {
    const fetchApprovedAmount = async () => {
      if (!account.address || !publicClient) return;

      try {
        const allowance = await publicClient.readContract({
          abi: pointsTokenAbi,
          address: getTokenAddress() as `0x${string}`,
          functionName: 'allowance',
          args: [account.address, APP_ADDRESS],
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

  // Handle bet button click
  const handleBetClick = () => {
    if (!authenticated) {
      login();
      return;
    }
    setShowBetForm(!showBetForm);
  };

  // Handle FACTS feature
  const handleFacts = async () => {
    if (!isWalletConnected) {
      login();
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const wallet = wallets?.[0];

      if (!wallet || !wallet.address) {
        console.warn('Please connect a wallet to FACTS posts');
        setIsSubmitting(false);
        return;
      }

      const isAdding = !hasFactsed;
      const messageObj = {
        action: 'toggle_facts',
        poolId: id,
        operation: isAdding ? 'add_facts' : 'remove_facts',
        timestamp: new Date().toISOString(),
        account: wallet.address.toLowerCase(),
      };

      const messageStr = JSON.stringify(messageObj);
      await signMessage(
        { message: messageStr },
        {
          uiOptions: {
            title: isAdding ? 'Sign to FACTS' : 'Sign to remove FACTS',
            description: 'Sign this message to verify your action',
            buttonText: 'Sign',
          },
          address: wallet.address,
        }
      );

      // Calculate new facts count
      const newFactsCount = isAdding ? factsCount + 1 : factsCount - 1;

      // Update UI
      setHasFactsed(isAdding);
      setFactsCount(newFactsCount);

      // Update localStorage
      savePoolFacts(id, isAdding);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`pool_facts_${id}`, newFactsCount.toString());
        localStorage.setItem(`pool_facts_liked_${id}`, isAdding.toString());
      }

      // Simulate backend delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      // Only log non-user rejection errors
      if (
        error instanceof Error &&
        !error.message.includes('rejected') &&
        !error.message.includes('cancel') &&
        !error.message.includes('user rejected')
      ) {
        console.error('Failed to sign message:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle percentage button clicks
  const handlePercentageClick = (percentage: number) => {
    if (!balance) return;

    const rawBalanceValue = Number(balance.value) / Math.pow(10, balance.decimals);

    let amount;
    if (percentage === 100) {
      // For 100%, use the exact integer
      amount = Math.ceil(rawBalanceValue);
    } else if (percentage === 0) {
      amount = 0;
    } else {
      // Calculate percentage with minimum value of 1
      amount = Math.max(Math.ceil(rawBalanceValue * (percentage / 100)), 1);
    }

    setBetAmount(amount.toString());
    setSliderValue([percentage]);
    setUserEnteredValue(''); // Clear user entered value
  };

  // Place bet function
  const placeBet = async () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!betAmount || selectedOption === null) return;

    // Validation checks
    if (!writeContract || !publicClient || !wallets?.length) {
      console.error('Wallet or contract not ready');
      return;
    }

    if (!account.address) {
      console.error('Account address is not available');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert amount to token units
      const amount = parseInt(betAmount, 10);
      const tokenAmount = BigInt(Math.floor(amount * 10 ** USDC_DECIMALS));

      // Check if approval is needed
      if (approvedAmount && parseFloat(approvedAmount) < amount) {
        // Approve tokens first
        const { request: approveRequest } = await publicClient.simulateContract({
          abi: pointsTokenAbi,
          address: getTokenAddress() as `0x${string}`,
          functionName: 'approve',
          account: account.address as `0x${string}`,
          args: [APP_ADDRESS, tokenAmount],
        });

        writeContract(approveRequest);
      }

      // Place bet after approval or if already approved
      if (isConfirmed || parseFloat(approvedAmount) >= amount) {
        const { request } = await publicClient.simulateContract({
          abi: bettingContractAbi,
          address: APP_ADDRESS,
          functionName: 'placeBet',
          account: account.address as `0x${string}`,
          args: [BigInt(id), BigInt(selectedOption), tokenAmount, account.address, tokenTypeC],
        });

        writeContract(request);

        // Reset form after transaction sent
        if (!isPending) {
          setBetAmount('');
          setSelectedOption(null);
          setShowBetForm(false);
          showSuccessToast(
            `Bet placed successfully! You bet ${betAmount} ${tokenType} on "${options[selectedOption]}"!`
          );
        }
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      showErrorToast('Error placing bet. Please check your wallet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render volume progress bar
  const renderVolumeBar = () => {
    if (volume === '0') {
      return (
        <div className='relative'>
          {/* Empty progress bar */}
          <div className='flex-1 rounded-full bg-gray-200 dark:bg-gray-800'>
            <div className='flex overflow-hidden rounded-full'>
              <div className='h-2 w-full bg-gray-300 dark:bg-gray-700'></div>
            </div>
          </div>

          {/* Zero volume text */}
          <div className='mt-1 flex justify-end'>
            <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>
              {volume} vol.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='relative'>
        {/* Progress bar for volume visualization */}
        <div className='flex-1 rounded-full bg-gray-200 dark:bg-gray-800'>
          <div className='flex overflow-hidden rounded-full'>
            {betData.exactPercentages.map((percent, index) => {
              // Generate colors for each option (extend beyond just red/green for multiple options)
              const colors = [
                'bg-green-500',
                'bg-red-500 dark:bg-red-700',
                'bg-blue-500',
                'bg-yellow-500',
                'bg-purple-500',
              ];

              // Use mod operator to cycle through colors if more options than colors
              const colorClass = colors[index % colors.length];

              // Apply rounded corners only to first and last segments
              const roundedClass =
                index === 0
                  ? 'rounded-l-full'
                  : index === betData.exactPercentages.length - 1
                    ? 'rounded-r-full'
                    : '';

              return (
                <div
                  key={index}
                  className={`h-2 ${colorClass} ${roundedClass}`}
                  style={{ width: `${percent.toFixed(2)}%` }}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Show total volume */}
        <div className='mt-1 flex justify-end'>
          <div className='text-sm font-medium text-gray-500 dark:text-gray-400'>{volume} vol.</div>
        </div>
      </div>
    );
  };

  return (
    <div className='bg-background overflow-hidden rounded-lg border border-gray-200 transition-colors hover:border-gray-100 dark:border-gray-800 dark:hover:border-gray-700'>
      <div className='p-4'>
        <div className='mb-2 flex items-center gap-2'>
          <Avatar className='h-10 w-10 overflow-hidden rounded-full'>
            <AvatarImage src={poolData ? poolData?.post?.image_url : avatar} alt={username} />
            <AvatarFallback>
              <Image src={'/trump.jpeg'} alt='User' width={32} height={32} />
            </AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <div className='font-bold'>{username}</div>
          </div>
          <div className='flex items-center gap-2'>
            {isActive ? (
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
              {formatDistanceToNow(
                new Date(
                  status === PoolStatus.Graded &&
                  gradedBlockTimestamp &&
                  !isNaN(new Date(gradedBlockTimestamp * 1000).getTime())
                    ? gradedBlockTimestamp * 1000
                    : time && !isNaN(new Date(time * 1000).getTime())
                      ? time * 1000
                      : Date.now()
                ),
                { addSuffix: true }
              )}
            </span>
            <TruthSocial postId={truthSocialId} />
          </div>
        </div>

        <Link href={`/pools/${id}`} className='block'>
          <p className='mb-4 text-lg font-medium transition-colors hover:text-orange-500'>
            {question}
          </p>
        </Link>

        <div className='mb-3 rounded-md'>{renderVolumeBar()}</div>

        <div className='mb-4 space-y-2'>
          {options.map((option, i) => {
            // Get option colors (extend beyond red/green for more than 2 options)
            const optionColors = [
              { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-500' },
              { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-500' },
              { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500' },
              { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500' },
              { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500' },
            ];

            // Use modulo to cycle through colors if more options than colors
            const colorIndex = i % optionColors.length;
            const { text: textColor, bg: bgColor } = optionColors[colorIndex];

            // Get display percentage for this option
            const percent = betData.displayPercentages[i] || 0;

            return (
              <div
                key={i}
                className={`flex items-center justify-between rounded-md p-2 transition-colors ${
                  selectedOption === i
                    ? `border border-${bgColor.replace('bg-', '')} bg-gray-100 dark:bg-gray-800`
                    : 'bg-gray-50 opacity-90 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800'
                } cursor-pointer`}
                onClick={() => setSelectedOption(i)}
              >
                <span className={`font-medium ${textColor}`}>
                  {option} {percent}%
                </span>

                <div
                  className={`flex items-center justify-center rounded-full ${bgColor} px-3 py-1 text-sm font-medium text-white`}
                >
                  {optionBets[i] || '0'}
                </div>
              </div>
            );
          })}
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {closesAt && !isNaN(new Date(closesAt * 1000).getTime()) && (
              <CountdownTimer closesAt={closesAt * 1000} />
            )}

            <Button
              variant='ghost'
              size='sm'
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              asChild
            >
              <Link href={`/pools/${id}`}>
                <MessageCircle size={18} className='mr-1' />
                {commentCount > 0 ? commentCount : 'Comment'}
              </Link>
            </Button>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              onClick={handleBetClick}
            >
              <HandCoins size={18} className='mr-1' />
              Bet
            </Button>

            <Button
              variant={hasFactsed ? 'default' : 'outline'}
              size='sm'
              className={`gap-1 font-medium ${
                hasFactsed
                  ? 'bg-orange-500 text-black hover:bg-orange-600 hover:text-black dark:text-black'
                  : 'border-orange-500 text-orange-500 hover:text-orange-500 dark:border-orange-500 dark:text-orange-500'
              }`}
              onClick={handleFacts}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent'></span>
              ) : (
                <>FACTS{hasFactsed ? <span className='ml-1.5'>🦅</span> : ''}</>
              )}
              <span className='ml-1.5'>{factsCount}</span>
            </Button>
          </div>
        </div>

        {showBetForm && (
          <div className='mt-4 border-t border-gray-200 pt-4 dark:border-gray-800'>
            <h4 className='mb-2 text-sm font-medium'>Place your bet</h4>

            {/* Display Token Balance */}
            {balance && (
              <div className='mb-2 text-xs text-gray-500 dark:text-gray-400'>
                Balance: {formattedBalance} {symbol}
              </div>
            )}

            {/* Percentage Buttons */}
            <div className='mb-2 flex gap-1'>
              {[25, 50, 75, 100].map((percent) => (
                <Button
                  key={percent}
                  variant='outline'
                  size='sm'
                  className='flex-1 text-xs'
                  onClick={() => handlePercentageClick(percent)}
                >
                  {percent}%
                </Button>
              ))}
            </div>

            {/* Slider */}
            <Slider
              defaultValue={[0]}
              max={100}
              step={1}
              value={sliderValue}
              onValueChange={(newValue) => {
                setUserEnteredValue('');
                setSliderValue(newValue);
              }}
              className='mb-4'
            />

            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Input
                  type='text'
                  inputMode='numeric'
                  placeholder='0'
                  className='h-10 pr-16'
                  value={betAmount}
                  onChange={(e) => {
                    const value = e.target.value;

                    setIsUserTyping(true);
                    setUserEnteredValue(value);

                    if (value === '') {
                      setBetAmount('');
                      setSliderValue([0]);
                      setTimeout(() => setIsUserTyping(false), 1000);
                      return;
                    }

                    if (/^[0-9]+$/.test(value)) {
                      setBetAmount(value);

                      if (balance) {
                        const inputNum = parseInt(value, 10);
                        const balanceNum = Number(balance.value) / Math.pow(10, balance.decimals);

                        if (inputNum > 0 && balanceNum > 0) {
                          const percentage = Math.min(
                            100,
                            Math.ceil((inputNum / balanceNum) * 100)
                          );
                          setSliderValue([percentage]);
                        }
                      } else {
                        setSliderValue([0]);
                      }
                    }

                    setTimeout(() => {
                      setIsUserTyping(false);
                    }, 2000);
                  }}
                />
              </div>
              <Button
                className='bg-orange-500 font-medium text-black hover:bg-orange-600 hover:text-black dark:text-black'
                onClick={placeBet}
                disabled={!betAmount || selectedOption === null || isSubmitting || isPending}
              >
                {isPending ? 'Processing...' : isSubmitting ? 'Waiting...' : 'Place Bet'}
              </Button>
            </div>
            {selectedOption !== null && (
              <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                You are betting {betAmount || '0'} {tokenType} on &quot;
                {options[selectedOption]}&quot;
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
