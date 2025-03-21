import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, TrendingUp } from 'lucide-react';

interface EndingSoonBetProps {
  avatar: string;
  question: string;
  volume: string;
  timeLeft: string;
}

export function EndingSoonBet({
  avatar,
  question,
  volume,
  timeLeft,
}: EndingSoonBetProps) {
  return (
    <div className='flex gap-3'>
      <Avatar className='h-8 w-8 overflow-hidden rounded-full'>
        <AvatarImage src={avatar} alt='User' />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className='flex-1'>
        <p className='mb-1 line-clamp-2 text-sm'>{question}</p>
        <div className='flex items-center gap-4 text-xs text-gray-400'>
          <div className='flex items-center gap-1'>
            <TrendingUp size={12} />
            <span>{volume}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock size={12} />
            <span>{timeLeft}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
