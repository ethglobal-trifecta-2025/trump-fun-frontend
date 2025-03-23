import { useEffect, useState } from 'react';

const CountdownTimer = ({ closesAt }: { closesAt: string | Date | number }) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    hours: string;
    minutes: string;
    seconds: string;
  }>({
    hours: '--',
    minutes: '--',
    seconds: '--',
  });
  const [isExpired, setIsExpired] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    // Function to calculate and format time remaining
    const calculateTimeRemaining = () => {
      try {
        const now = new Date();
        const closingTime = new Date(closesAt);

        // Check if closesAt is a valid date
        if (isNaN(closingTime.getTime())) {
          setTimeRemaining({ hours: '--', minutes: '--', seconds: '--' });
          return;
        }

        // Calculate difference in milliseconds
        const diff = closingTime.getTime() - now.getTime();

        // If expired
        if (diff <= 0) {
          setTimeRemaining({ hours: '00', minutes: '00', seconds: '00' });
          setIsExpired(true);
          return;
        }

        // Set urgent flag if less than 1 hour remains
        setIsUrgent(diff < 60 * 60 * 1000);

        // Convert to hours, minutes, seconds
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Format as HH:MM:SS
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        setTimeRemaining({
          hours: formattedHours,
          minutes: formattedMinutes,
          seconds: formattedSeconds,
        });
      } catch (error) {
        console.error('Error calculating time:', error);
        setTimeRemaining({ hours: '--', minutes: '--', seconds: '--' });
      }
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Set up interval to update every second
    const timerId = setInterval(calculateTimeRemaining, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timerId);
  }, [closesAt]);

  // Function to render a time digit with casino-style display
  const TimeDigit = ({ value, label }: { value: string; label: string }) => (
    <div className='flex flex-col items-center'>
      <div
        className={`mb-1 flex h-8 w-10 items-center justify-center rounded font-mono text-xs font-bold ${
          isExpired
            ? 'bg-gray-200 text-gray-500 dark:bg-gray-700'
            : isUrgent
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
        } ${isUrgent && !isExpired ? 'animate-pulse' : ''} `}
      >
        {value}
      </div>
      <span className='text-xs text-gray-500 dark:text-gray-400'>{label}</span>
    </div>
  );

  return (
    <div className='flex flex-col items-end'>
      <div className='mb-1 text-xs font-medium text-gray-500 dark:text-gray-400'>
        {isExpired ? 'Closed' : 'Closes in'}
      </div>
      <div className='flex justify-center gap-1'>
        <TimeDigit value={timeRemaining.hours} label='hr' />
        <div className='flex h-8 items-center font-bold text-orange-500'>:</div>
        <TimeDigit value={timeRemaining.minutes} label='min' />
        <div className='flex h-8 items-center font-bold text-orange-500'>:</div>
        <TimeDigit value={timeRemaining.seconds} label='sec' />
      </div>
    </div>
  );
};

export default CountdownTimer;
