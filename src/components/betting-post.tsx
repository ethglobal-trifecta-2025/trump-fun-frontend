'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { X, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useTokenBalance } from '@/hooks/useTokenBalance';

interface BettingPostProps {
  id: string;
  avatar: string;
  username: string;
  time: number; // Changed to number (unix timestamp)
  question: string;
  options: string[];
  commentCount?: number;
  volume?: string;
}

export function BettingPost({
  id,
  avatar,
  username,
  time, // Now expecting unix timestamp
  question,
  options,
  commentCount = 0,
  volume = '0',
}: BettingPostProps) {
  const [betAmount, setBetAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showBetForm, setShowBetForm] = useState(false);
  const [factsCount, setFactsCount] = useState(
    Math.floor(Math.random() * 50) + 5
  );
  const [hasFactsed, setHasFactsed] = useState(false);
  const [sliderValue, setSliderValue] = useState([0]);
  const { authenticated, login } = usePrivy();

  // Use our custom hook for token balance
  const { balance, formattedBalance, symbol, tokenTextLogo } =
    useTokenBalance();

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

  const handleFacts = () => {
    if (!authenticated) {
      login();
      return;
    }

    if (hasFactsed) {
      setFactsCount((prev) => prev - 1);
    } else {
      setFactsCount((prev) => prev + 1);
    }
    setHasFactsed(!hasFactsed);
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
    alert(`Placing ${betAmount} USDC bet on "${options[selectedOption]}"`);

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
          <div className='flex items-center gap-2 text-sm text-gray-400'>
            <span>
              {formatDistanceToNow(new Date(time * 1000), { addSuffix: true })}
            </span>
            <X size={16} />
          </div>
        </div>

        <Link href={`/pools/${id}`} className='block'>
          <p className='mb-4 text-lg font-medium transition-colors hover:text-orange-500'>
            {question}
          </p>
        </Link>

        <div className='mb-3 flex items-center justify-between rounded-md bg-gray-800 p-2 text-center text-gray-400'>
          <span>No bets</span>
          {volume !== '0' && (
            <span className='text-orange-400'>{volume} vol.</span>
          )}
        </div>

        <div className='mb-4 space-y-2'>
          {options.map((option, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-md p-2 transition-colors ${
                selectedOption === i ? 'bg-gray-800' : 'hover:bg-gray-900'
              } cursor-pointer`}
              onClick={() => setSelectedOption(i)}
            >
              <span
                className={
                  i === selectedOption
                    ? 'font-medium text-white'
                    : 'text-gray-400'
                }
              >
                {option}
              </span>
              <div className='flex items-center gap-1'>
                <div className='flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs'>
                  0
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            size='sm'
            className='text-gray-400 hover:text-gray-300'
            asChild
          >
            <Link href={`/pools/${id}`}>
              <MessageCircle size={18} className='mr-1' />
              {commentCount > 0 ? commentCount : 'Comment'}
            </Link>
          </Button>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className={`gap-1 font-bold ${
                hasFactsed
                  ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                  : 'text-orange-500 hover:text-orange-500'
              }`}
              onClick={handleFacts}
            >
              {hasFactsed ? 'FACTS 🦅' : 'FACTS'}
              <span className='ml-1.5'>{factsCount}</span>
            </Button>

            <Button
              variant='ghost'
              size='sm'
              className='text-gray-400 hover:text-orange-500'
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
                Balance: {formattedBalance}{' '}
                <span className='mx-1'>{tokenTextLogo}</span> {symbol}
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
                className='bg-orange-600 hover:bg-orange-700'
                onClick={placeBet}
                disabled={!betAmount || selectedOption === null}
              >
                Place Bet
              </Button>
            </div>
            {selectedOption !== null && (
              <p className='mt-2 text-xs text-gray-400'>
                You are betting {betAmount || '0'} USDC on &quot;
                {options[selectedOption]}&quot;
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
