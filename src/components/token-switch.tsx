'use client';

import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tooltip } from '@/components/ui/tooltip';
import { POINTS_ADDRESS } from '@/consts/addresses';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { TokenType, useTokenContext } from '@/hooks/useTokenContext';
import { cn } from '@/lib/utils';

export function TokenSwitch() {
  const { tokenType, setTokenType, tokenTextLogo } = useTokenContext();

  // For POINTS, always use the zero address
  const { formattedBalance, symbol } = useTokenBalance(
    tokenType === TokenType.POINTS ? POINTS_ADDRESS : undefined
  );

  const handleToggle = (checked: boolean) => {
    setTokenType(checked ? TokenType.POINTS : TokenType.USDC);
  };

  return (
    <div className='flex items-center gap-2'>
      <Tooltip.Provider>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Badge
              variant='outline'
              className={cn(
                'flex items-center gap-1 px-2 py-1',
                tokenType === TokenType.USDC
                  ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
                  : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
              )}
            >
              <span>{tokenTextLogo}</span>
              <span className='ml-1 hidden sm:inline'>{tokenType}</span>
            </Badge>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>{tokenType === TokenType.POINTS ? 'Trump Points' : 'USDC'}</p>
            <p className='mt-1 text-xs text-gray-400'>
              Balance: {formattedBalance} {symbol}
            </p>
          </Tooltip.Content>
        </Tooltip>
      </Tooltip.Provider>

      <Switch
        checked={tokenType === TokenType.POINTS}
        onCheckedChange={handleToggle}
        className={cn('data-[state=checked]:bg-orange-500')}
      />
    </div>
  );
}
