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

  const [betAmount, setBetAmount] = useState('0.01');

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

    setBetAmount('0.01');
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
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              min='0.001'
              step='0.001'
              className='w-full rounded-md border px-3 py-2 dark:bg-gray-800'
            />
          </div>

          <Button onClick={handleBetSubmit} className='w-full sm:w-auto'>
            Place Bet ({selectedOption === 'yes' ? yesBets : noBets} bets so
            far)
          </Button>
        </div>
      )}
    </div>
  );
}
