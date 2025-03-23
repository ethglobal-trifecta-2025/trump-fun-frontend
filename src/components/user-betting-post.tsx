import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { POINTS_DECIMALS, USDC_DECIMALS } from '@/consts';
import { TokenType } from '@/hooks/useTokenContext';
import { PoolStatus } from '@/lib/__generated__/graphql';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TruthSocial from './common/truth-social';
import CountdownTimer from './Timer';
import { Badge } from './ui/badge';

interface UserBettingPostProps {
  id: string;
  avatar: string;
  username: string;
  time: number;
  question: string;
  options: string[];
  volume: string;
  status: PoolStatus;
  selectedOption: number;
  closesAt: number;
  userBet: {
    amount: string;
    selectedOption: number;
    outcome?: 'won' | 'lost' | 'pending';
    payout?: string;
    netWinnings?: string;
    winningOption?: string;
  };
  tokenType: TokenType | string;
  truthSocialId?: string;
}

export function UserBettingPost({
  id,
  avatar,
  username,
  time,
  question,
  options,
  volume,
  selectedOption,
  closesAt,
  userBet,
  status,
  tokenType,
  truthSocialId,
}: UserBettingPostProps) {
  const [highlight, setHighlight] = useState(false);
  const [timePercent, setTimePercent] = useState(100);

  // Calculate time percentage for progress bar
  useEffect(() => {
    if (status === PoolStatus.Pending) {
      const updateTimePercent = () => {
        const now = new Date().getTime();
        const closeTime = closesAt * 1000;
        const creationTime = time * 1000;
        const totalDuration = closeTime - creationTime;
        const elapsed = now - creationTime;
        const percent = Math.max(0, Math.min(100, 100 - (elapsed / totalDuration) * 100));
        setTimePercent(percent);
      };

      updateTimePercent();
      const interval = setInterval(updateTimePercent, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [closesAt, time, status]);

  // Create highlight effect when component mounts
  useEffect(() => {
    setHighlight(true);
    const timer = setTimeout(() => setHighlight(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const resolvedTokenType =
    typeof tokenType === 'string'
      ? tokenType === 'USD' || tokenType === 'USDC'
        ? TokenType.USDC
        : TokenType.POINTS
      : tokenType;

  const symbol = resolvedTokenType === TokenType.USDC ? '💲' : '🦅';
  const decimals = resolvedTokenType === TokenType.USDC ? USDC_DECIMALS : POINTS_DECIMALS;
  const isActive = status === PoolStatus.Pending || status === PoolStatus.None;

  const formattedAmount = (parseFloat(userBet.amount) / Math.pow(10, decimals)).toFixed(0);
  const formattedPayout = userBet.payout
    ? (parseFloat(userBet.payout) / Math.pow(10, decimals)).toFixed(0)
    : undefined;
  const formattedNetWinnings = userBet.netWinnings
    ? (parseFloat(userBet.netWinnings) / Math.pow(10, decimals)).toFixed(0)
    : undefined;

  const isClosed = new Date(closesAt * 1000) < new Date();

  return (
    <div
      className={`bg-background overflow-hidden rounded-lg border border-gray-200 transition-all duration-300 hover:border-gray-100 dark:border-gray-800 dark:hover:border-gray-700 ${
        highlight ? 'shadow-lg ring-2 ring-orange-500' : ''
      }`}
    >
      <div className='p-4'>
        {/* Time progress bar for active bets */}
        {isActive && !isClosed && (
          <div className='-mt-4 mb-3 h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
            <div
              className='h-full bg-orange-500 transition-all duration-500 ease-in-out'
              style={{ width: `${timePercent}%` }}
            ></div>
          </div>
        )}

        <div className='mb-2 flex items-center gap-2'>
          <Avatar className='h-10 w-10 overflow-hidden rounded-full'>
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <div className='font-bold'>{username}</div>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
            {isActive ? (
              <div className='flex items-center'>
                <span className='relative flex h-3 w-3'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75'></span>
                  <span className='relative inline-flex h-3 w-3 rounded-full bg-green-500'></span>
                </span>
              </div>
            ) : (
              <Badge
                variant='secondary'
                className={`${
                  userBet.outcome === 'won'
                    ? 'animate-pulse bg-green-500'
                    : userBet.outcome === 'lost'
                      ? 'bg-red-500'
                      : 'bg-orange-500'
                }`}
              >
                {userBet.outcome === 'won'
                  ? 'WON'
                  : userBet.outcome === 'lost'
                    ? 'LOST'
                    : 'PENDING'}
              </Badge>
            )}
            <span className='text-muted-foreground text-xs'>
              {formatDistanceToNow(new Date(time * 1000), { addSuffix: true })}
            </span>
            {truthSocialId && <TruthSocial postId={truthSocialId} />}
          </div>
        </div>

        <Link href={`/pools/${id}`} className='block'>
          <p className='mb-4 text-lg font-medium transition-colors hover:text-orange-500'>
            {question}
          </p>
        </Link>

        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <span className='!text-sm !font-normal text-gray-600 dark:text-gray-400'>
              Option Selected:
            </span>
            <span
              className={`text-base font-semibold ${
                options[selectedOption]?.toLowerCase() === 'yes'
                  ? 'text-green-500'
                  : options[selectedOption]?.toLowerCase() === 'no'
                    ? 'text-red-500'
                    : 'text-orange-500'
              }`}
            >
              {` `}
              {options[selectedOption]}
            </span>
          </div>
          <div className={`${isActive && !isClosed ? 'font-semibold text-orange-500' : ''}`}>
            {isClosed ? (
              userBet.outcome === 'pending' ? (
                <div className='flex items-center gap-1'>
                  <span className='relative flex h-2 w-2'>
                    <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75'></span>
                    <span className='relative inline-flex h-2 w-2 rounded-full bg-orange-500'></span>
                  </span>
                  <span>Awaiting Results</span>
                </div>
              ) : (
                <span
                  className={`font-medium ${
                    userBet.outcome === 'won' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {userBet.outcome === 'won' ? 'You Won! 🎉' : 'You Lost 😢'}
                </span>
              )
            ) : (
              <CountdownTimer closesAt={closesAt * 1000} />
            )}
          </div>
        </div>

        <div className='mt-2 flex flex-col gap-2 text-sm'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <span className='text-gray-600 dark:text-gray-400'>Amount Bet:</span>
              <span className='font-medium'>
                {symbol} {formattedAmount}
              </span>
            </div>

            <div className='text-sm font-medium text-orange-500 dark:text-orange-400'>
              {volume} Vol.
            </div>
          </div>

          {userBet.outcome === 'won' && userBet.payout && (
            <div className='mt-2 flex flex-col gap-2 border-t border-gray-200 pt-2 dark:border-gray-700'>
              <div className='flex items-center justify-between'>
                <span className='text-gray-600 dark:text-gray-400'>Total Payout:</span>
                <span className='font-medium text-green-600 dark:text-green-500'>
                  {symbol} {formattedPayout}
                </span>
              </div>

              {formattedNetWinnings && parseInt(formattedNetWinnings) > 0 && (
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600 dark:text-gray-400'>Profit:</span>
                  <span className='animate-pulse font-semibold text-green-600 dark:text-green-500'>
                    +{symbol} {formattedNetWinnings}
                  </span>
                </div>
              )}
            </div>
          )}

          {userBet.outcome === 'lost' && userBet.winningOption && (
            <div className='mt-2 flex flex-col gap-2 border-t border-gray-200 pt-2 dark:border-gray-700'>
              <div className='flex items-center justify-between'>
                <span className='text-gray-600 dark:text-gray-400'>Winning Option:</span>
                <span
                  className={`font-medium ${
                    userBet.winningOption.toLowerCase() === 'yes'
                      ? 'text-green-600 dark:text-green-500'
                      : userBet.winningOption.toLowerCase() === 'no'
                        ? 'text-red-600 dark:text-red-500'
                        : 'text-orange-600 dark:text-orange-500'
                  }`}
                >
                  {userBet.winningOption}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-600 dark:text-gray-400'>Amount Lost:</span>
                <span className='font-medium text-red-600 dark:text-red-500'>
                  {symbol} {formattedAmount}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
