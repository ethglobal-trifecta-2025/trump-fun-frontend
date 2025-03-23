import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ closesAt }: { closesAt: string | Date | number }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Function to calculate and format time remaining
    const calculateTimeRemaining = () => {
      try {
        const now = new Date();
        const closingTime = new Date(closesAt);

        // Check if closesAt is a valid date
        if (isNaN(closingTime.getTime())) {
          setTimeRemaining('--:--:--');
          return;
        }

        // Calculate difference in milliseconds
        const diff = closingTime.getTime() - now.getTime();

        // If expired
        if (diff <= 0) {
          setTimeRemaining('00:00:00');
          setIsExpired(true);
          return;
        }

        // Convert to hours, minutes, seconds
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Format as HH:MM:SS
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        setTimeRemaining(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      } catch (error) {
        console.error('Error calculating time:', error);
        setTimeRemaining('--:--:--');
      }
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Set up interval to update every second
    const timerId = setInterval(calculateTimeRemaining, 1000);

    // Clean up interval on unmount
    return () => clearInterval(timerId);
  }, [closesAt]);

  return (
    <div className='flex items-center'>
      <div className='mr-2 text-sm font-medium text-gray-500 dark:text-gray-400'>
        {isExpired ? 'Closed' : 'Closes in'}
      </div>
      <div
        className={`rounded px-2 py-1 font-mono text-sm font-bold ${
          isExpired
            ? 'bg-gray-200 text-gray-500 dark:bg-gray-700'
            : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
        }`}
      >
        {timeRemaining}
      </div>
    </div>
  );
};

export default CountdownTimer;
