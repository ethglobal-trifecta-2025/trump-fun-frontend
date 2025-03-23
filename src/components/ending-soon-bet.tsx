import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { Clock, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface EndingSoonBetProps {
  avatar: string;
  question: string;
  volume: string;
  timeLeft: string;
  poolId: string;
}

export function EndingSoonBet({ avatar, question, volume, timeLeft, poolId }: EndingSoonBetProps) {
  const [remainingTime, setRemainingTime] = useState('');
  const { data: poolData } = useQuery({
    queryKey: ['ending-soon-bet', poolId],
    queryFn: async () => {
      const res = await fetch(`/api/post?poolId=${poolId}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      return res.json();
    },
    staleTime: 60000, // Consider data stale after 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const calculateRemainingTime = () => {
      const closeTime = parseInt(timeLeft) * 1000; // convert to milliseconds
      const now = Date.now();
      const difference = closeTime - now;

      if (difference <= 0) {
        setRemainingTime('Ended');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        setRemainingTime(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setRemainingTime(`${hours}h ${minutes}m`);
      } else {
        setRemainingTime(`${minutes}m ${seconds}s`);
      }
    };

    calculateRemainingTime();

    // Only set up the interval if the poll hasn't ended yet
    let timer: NodeJS.Timeout | null = null;
    if (parseInt(timeLeft) * 1000 > Date.now()) {
      timer = setInterval(calculateRemainingTime, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  return (
    <Link
      href={`/pools/${poolId}`}
      className='-m-2 block rounded-md p-2 transition-colors hover:bg-gray-900'
    >
      <div className='flex gap-3'>
        <Avatar className='h-8 w-8 overflow-hidden rounded-full'>
          <AvatarImage src={poolData ? poolData?.post?.image_url : avatar} alt='User' />
          <AvatarFallback>
            <Image src={'/trump.jpeg'} alt='User' width={32} height={32} />
          </AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <p className='mb-1 line-clamp-2 text-sm'>{question}</p>
          <div className='flex items-center justify-between gap-4 text-xs text-gray-400'>
            <div className='flex items-center gap-1'>
              <TrendingUp size={12} />
              <span>{volume}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Clock size={12} className='text-gray-400' />
              <span>{remainingTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
