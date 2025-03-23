import { useEffect, useState } from 'react';

type CountdownTimerProps = {
  closesAt: string | Date | number;
  displayText?: boolean;
  containerClassName?: string;
  digitClassName?: string;
  colonClassName?: string;
  wrapperClassName?: string;
};

const CountdownTimer = ({
  closesAt,
  containerClassName = 'flex flex-col items-end',
  digitClassName = '',
  colonClassName = '',
  wrapperClassName = 'flex justify-center',
}: CountdownTimerProps) => {
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
  const TimeDigit = ({ value }: { value: string }) => (
    <div className='flex items-center'>
      <div
        className={`flex h-8 w-5 items-center justify-center font-mono text-xs font-bold ${
          isExpired
            ? 'text-gray-500'
            : isUrgent
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-600 dark:text-gray-400'
        } ${isUrgent && !isExpired ? 'animate-pulse' : ''} ${digitClassName}`}
      >
        {value}
      </div>
    </div>
  );

  const colonClass = `flex h-8 items-center px-0 font-bold text-gray-500 ${colonClassName}`;

  return (
    <div className={containerClassName}>
      <div className={wrapperClassName}>
        <TimeDigit value={timeRemaining.hours} />
        <div className={colonClass}>:</div>
        <TimeDigit value={timeRemaining.minutes} />
        <div className={colonClass}>:</div>
        <TimeDigit value={timeRemaining.seconds} />
      </div>
    </div>
  );
};

export default CountdownTimer;
