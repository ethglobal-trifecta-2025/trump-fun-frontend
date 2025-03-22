'use client';

import { isPoolFactsd, savePoolFacts } from '@/app/pool-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { TokenType, useTokenContext } from '@/hooks/useTokenContext';
import { usePrivy, useSignMessage, useWallets } from '@privy-io/react-auth';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BettingPostProps {
  id: string;
  avatar: string;
  username: string;
  time: number; // Changed to number (unix timestamp)
  question: string;
  options: string[];
  truthSocialId: string;
  commentCount?: number;
  volume?: string;
  optionBets?: string[];
}

export function BettingPost({
  id,
  avatar,
  username,
  time, // Now expecting unix timestamp
  question,
  options,
  truthSocialId,
  commentCount = 0,
  volume = '0',
  optionBets = [],
}: BettingPostProps) {
  const [betAmount, setBetAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showBetForm, setShowBetForm] = useState(false);
  const [factsCount, setFactsCount] = useState(Math.floor(Math.random() * 50) + 5);
  const [hasFactsed, setHasFactsed] = useState(false);
  const [sliderValue, setSliderValue] = useState([0]);
  const [isFactsProcessing, setIsFactsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const { signMessage } = useSignMessage();
  const { tokenType } = useTokenContext();

  // Use our custom hook for token balance
  const { balance, formattedBalance, symbol } = useTokenBalance();

  const isWalletConnected = authenticated && wallets && wallets.length > 0 && wallets[0]?.address;

  // Check localStorage when component mounts to see if this pool was FACTS'd before
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wasFactsd = isPoolFactsd(id);
      setHasFactsed(wasFactsd);
    }
  }, [id]);

  // Update bet amount when slider changes
  useEffect(() => {
    if (sliderValue[0] > 0 && balance) {
      const percentage = sliderValue[0] / 100;
      const maxAmount = parseFloat(balance.formatted);
      const amount = Math.floor(maxAmount * percentage).toString();
      setBetAmount(amount);
    } else if (sliderValue[0] === 0) {
      setBetAmount('');
    }
  }, [sliderValue, balance]);

  const handleBetClick = () => {
    if (!authenticated) {
      login();
      return;
    }
    setShowBetForm(!showBetForm);
  };

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

      // Optimistically update UI
      const isAdding = !hasFactsed;
      const newFactsCount = isAdding ? factsCount + 1 : factsCount - 1;

      setHasFactsed(isAdding);
      setFactsCount(newFactsCount);

      // Update localStorage to persist the like
      savePoolFacts(id, isAdding);

      const messageObj = {
        action: 'toggle_facts',
        poolId: id,
        operation: isAdding ? 'add_facts' : 'remove_facts',
        timestamp: new Date().toISOString(),
        account: wallet.address.toLowerCase(),
      };

      const messageStr = JSON.stringify(messageObj);

      const { signature } = await signMessage(
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

      // In the future, send this signature to your backend or smart contract
      // const result = await togglePoolFacts(id, isAdding, signature, messageStr);

      // For now just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      // Revert optimistic update on error
      const isAdding = !hasFactsed;
      setHasFactsed(!isAdding);
      setFactsCount(isAdding ? factsCount - 1 : factsCount + 1);

      // Revert localStorage
      savePoolFacts(id, !isAdding);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle percentage button clicks
  const handlePercentageClick = (percentage: number) => {
    if (balance) {
      const maxAmount = parseFloat(balance.formatted);
      const amount = Math.floor(maxAmount * (percentage / 100)).toString();
      setBetAmount(amount);
      setSliderValue([percentage]);
    }
  };

  const placeBet = () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!betAmount || selectedOption === null) return;

    // Here you would connect to the smart contract
    alert(`Placing ${betAmount} ${tokenType} bet on "${options[selectedOption]}"`);

    // Reset form
    setBetAmount('');
    setSelectedOption(null);
    setShowBetForm(false);
  };

  return (
    <div className='bg-background overflow-hidden rounded-lg border border-gray-800 transition-colors hover:border-gray-700'>
      <div className='p-4'>
        <div className='mb-2 flex items-center gap-2'>
          <Avatar className='h-10 w-10 overflow-hidden rounded-full'>
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <div className='font-bold'>{username}</div>
          </div>
          <Link
            href={`https://truthsocial.com/@realDonaldTrump/posts/${truthSocialId}`}
            target='_blank'
            className='flex items-center gap-2 text-sm text-gray-400'
          >
            <div className='flex items-center gap-2'>
              <span>{formatDistanceToNow(new Date(time * 1000), { addSuffix: true })}</span>
              <Image src='/truth-social.png' alt='truth-social' width={20} height={20} />
            </div>
          </Link>
        </div>

        <Link href={`/pools/${id}`} className='block'>
          <p className='mb-4 text-lg font-medium transition-colors hover:text-orange-500'>
            {question}
          </p>
        </Link>

        <div className='mb-3 rounded-md'>
          {volume === '0' ? (
            <div className='p-2 text-center text-gray-400'>
              <span>No bets</span>
            </div>
          ) : (
            <div className='relative'>
              {/* Progress bar for volume visualization */}
              <div className='flex-1 rounded-full bg-gray-800'>
                <div className='flex overflow-hidden rounded-full'>
                  {(() => {
                    const yes = parseFloat(optionBets[0].replace('$', '').replace(' pts', '')) || 0;
                    const no = parseFloat(optionBets[1].replace('$', '').replace(' pts', '')) || 0;
                    const total = yes + no;

                    // Default to 50/50 if no bets
                    const yesPercent = total > 0 ? (yes / total) * 100 : 50;
                    const noPercent = total > 0 ? (no / total) * 100 : 50;

                    return (
                      <>
                        <div
                          className={`h-2 rounded-l-full bg-orange-500`}
                          style={{ width: `${yesPercent}%` }}
                        ></div>
                        <div
                          className='h-2 rounded-r-full bg-gray-700'
                          style={{ width: `${noPercent}%` }}
                        ></div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Show total volume */}
              <div className='mt-1 flex justify-end'>
                <div className={`text-sm font-medium text-gray-400`}>{volume} vol.</div>
              </div>
            </div>
          )}
        </div>

        <div className='mb-4 space-y-2'>
          {options.map((option, i) => {
            // Calculate percentages for options
            const yes = parseFloat(optionBets[0].replace('$', '').replace(' pts', '')) || 0;
            const no = parseFloat(optionBets[1].replace('$', '').replace(' pts', '')) || 0;
            const total = yes + no;

            // Calculate percentage for this option
            const percent =
              total > 0 ? Math.round(((i === 0 ? yes : no) / total) * 100) : i === 0 ? 50 : 50;

            return (
              <div
                key={i}
                className={`flex items-center justify-between rounded-md p-2 transition-colors ${
                  selectedOption === i
                    ? 'border border-orange-500 bg-gray-800'
                    : 'bg-gray-900 opacity-70 hover:bg-gray-800'
                } cursor-pointer`}
                onClick={() => setSelectedOption(i)}
              >
                <span
                  className={`font-medium ${selectedOption === i ? 'text-white' : 'text-gray-400'}`}
                >
                  {i === 0 ? 'YES' : 'NO'} {percent}%
                </span>
                <div
                  className={`flex items-center justify-center rounded-full ${
                    tokenType === TokenType.POINTS
                      ? selectedOption === i
                        ? 'bg-orange-500'
                        : 'bg-orange-700'
                      : selectedOption === i
                        ? 'bg-blue-500'
                        : 'bg-blue-700'
                  } px-3 py-1 text-sm font-medium ${selectedOption === i ? '' : 'opacity-70'}`}
                >
                  {optionBets[i] || '0'}
                </div>
              </div>
            );
          })}
        </div>

        <div className='flex items-center justify-between'>
          <Button variant='ghost' size='sm' className='text-gray-400 hover:text-gray-300' asChild>
            <Link href={`/pools/${id}`}>
              <MessageCircle size={18} className='mr-1' />
              {commentCount > 0 ? commentCount : 'Comment'}
            </Link>
          </Button>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className={`gap-1 border-orange-500 font-bold ${
                hasFactsed
                  ? 'bg-orange-500/10 text-orange-500'
                  : 'text-orange-500 hover:text-orange-500'
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

            <Button
              size='sm'
              className='bg-orange-500/40 text-orange-500 hover:bg-orange-500/50 hover:text-orange-500'
              onClick={handleBetClick}
            >
              Bet
            </Button>
          </div>
        </div>

        {showBetForm && (
          <div className='mt-4 border-t border-gray-800 pt-4'>
            <h4 className='mb-2 text-sm font-medium'>Place your bet</h4>

            {/* Display Token Balance */}
            {balance && (
              <div className='mb-2 text-xs text-gray-400'>
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
              onValueChange={setSliderValue}
              className='mb-4'
            />

            <div className='flex gap-2'>
              <Input
                type='number'
                placeholder='Amount (whole numbers only)'
                className='flex-1'
                value={betAmount}
                onChange={(e) => {
                  // Only allow whole numbers
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setBetAmount(value);
                    if (balance && parseFloat(value) > 0) {
                      const maxAmount = parseFloat(balance.formatted);
                      const percentage = Math.min(
                        100,
                        Math.round((parseFloat(value) / maxAmount) * 100)
                      );
                      setSliderValue([percentage]);
                    }
                  }
                }}
              />
              <Button
                className='bg-orange-500 hover:bg-orange-600'
                onClick={placeBet}
                disabled={!betAmount || selectedOption === null}
              >
                Place Bet
              </Button>
            </div>
            {selectedOption !== null && (
              <p className='mt-2 text-xs text-gray-400'>
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
