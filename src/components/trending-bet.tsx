import { TrendingUp } from 'lucide-react';

interface TrendingBetProps {
  question: string;
  volume: string;
  progress: number;
}

export function TrendingBet({ question, volume, progress }: TrendingBetProps) {
  return (
    <div>
      <p className='mb-2 font-medium line-clamp-3'>{question}</p>
      <div className='mb-2 flex items-center gap-2'>
        <div className='h-1 flex-1 overflow-hidden rounded-full bg-gray-800'>
          <div
            className='h-full bg-gradient-to-r from-blue-500 to-orange-500'
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className='flex items-center gap-1 text-sm text-gray-400'>
          <TrendingUp size={14} />
          <span>{volume}</span>
        </div>
      </div>
    </div>
  );
}
