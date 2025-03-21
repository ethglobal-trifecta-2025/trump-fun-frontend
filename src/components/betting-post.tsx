'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, MessageCircle, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

interface BettingPostProps {
  id: string;
  avatar: string;
  username: string;
  time: string;
  question: string;
  options: { text: string; color: string }[];
  commentCount?: number;
  volume?: string;
}

export function BettingPost({
  id,
  avatar,
  username,
  time,
  question,
  options,
  commentCount = 0,
  volume = '0',
}: BettingPostProps) {
  const [betAmount, setBetAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showBetForm, setShowBetForm] = useState(false);
  const { authenticated, login } = usePrivy();

  const handleBetClick = () => {
    if (!authenticated) {
      login();
      return;
    }
    setShowBetForm(!showBetForm);
  };

  const placeBet = () => {
    if (!authenticated) {
      login();
      return;
    }

    if (!betAmount || selectedOption === null) return;

    // Here you would connect to the smart contract
    alert(`Placing ${betAmount} USDC bet on "${options[selectedOption].text}"`);

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
            <span>{time}</span>
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
          {options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center justify-between rounded-md p-2 transition-colors ${
                selectedOption === index ? 'bg-gray-800' : 'hover:bg-gray-900'
              } cursor-pointer`}
              onClick={() => setSelectedOption(index)}
            >
              <span className={option.color}>{option.text}</span>
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

          <Button
            variant='ghost'
            size='sm'
            className='text-gray-400 hover:text-orange-500'
            onClick={handleBetClick}
          >
            <ThumbsUp size={18} className='mr-1' />
            Bet
          </Button>
        </div>

        {showBetForm && (
          <div className='mt-4 border-t border-gray-800 pt-4'>
            <h4 className='mb-2 text-sm font-medium'>Place your bet</h4>
            <div className='flex gap-2'>
              <Input
                type='number'
                placeholder='Amount (USDC)'
                className='flex-1'
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
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
                {options[selectedOption].text}&quot;
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
