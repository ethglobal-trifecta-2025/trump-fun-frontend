'use client';

import { Button } from '@/components/ui/button';

import { useState } from 'react';

interface BettingUIProps {
  poolId: string;

  yesPercentage: number;

  noPercentage: number;

  yesBets: number;

  noBets: number;
}

export default function BettingUI({
  poolId,
  yesPercentage,
  noPercentage,
  yesBets,
  noBets,
}: BettingUIProps) {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(
    null
  );

  const [betAmount, setBetAmount] = useState('1');

  const handleOptionSelect = (option: 'yes' | 'no') => {
    setSelectedOption(option);
  };

  const handleBetSubmit = async () => {
    if (!selectedOption) return;

    // Here you would handle the actual bet submission

    try {
      // In a real implementation, we would call a server action with the poolId

      console.log(`Submitting bet for pool ${poolId}:`);

      console.log(
        `Option: ${selectedOption} (current percentage: ${selectedOption === 'yes' ? yesPercentage : noPercentage}%)`
      );

      console.log(
        `Current count: ${selectedOption === 'yes' ? yesBets : noBets} bets`
      );

      console.log(`Amount: ${betAmount} ETH`);

      alert(
        `Bet submitted: ${selectedOption.toUpperCase()} for ${betAmount} ETH`
      );
    } catch (error) {
      console.error('Error placing bet:', error);

      alert('There was an error placing your bet. Please try again.');
    }

    // Reset form

    setSelectedOption(null);

    setBetAmount('1');
  };

  return (
    <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50'>
      <h2 className='mb-4 text-lg font-medium'>Place Your Bet</h2>

      <div className='mb-4 flex gap-4'>
        <Button
          onClick={() => handleOptionSelect('yes')}
          variant={selectedOption === 'yes' ? 'default' : 'outline'}
          className='flex-1'
        >
          YES ({yesPercentage}%)
        </Button>

        <Button
          onClick={() => handleOptionSelect('no')}
          variant={selectedOption === 'no' ? 'default' : 'outline'}
          className='flex-1'
        >
          NO ({noPercentage}%)
        </Button>
      </div>

      {selectedOption && (
        <div className='flex flex-col items-end gap-4 sm:flex-row'>
          <div className='w-full sm:w-1/2'>
            <label className='mb-1 block text-sm'>Bet Amount (ETH)</label>

            <input
              type='number'
              min='1'
              step='1'
              value={betAmount}
              onChange={(e) => {
                // Only allow whole numbers
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  setBetAmount(value);
                }
              }}
              className='w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800'
              placeholder='Amount (whole numbers only)'
            />
          </div>

          <Button
            onClick={handleBetSubmit}
            disabled={!selectedOption || !betAmount}
            className='mt-2 w-full sm:mt-0 sm:w-auto'
          >
            Place Bet
          </Button>
        </div>
      )}
    </div>
  );
}
