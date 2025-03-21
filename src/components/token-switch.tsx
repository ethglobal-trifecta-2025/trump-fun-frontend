'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { useTokenContext } from '@/hooks/useTokenContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { Address } from 'viem';

export function TokenSwitch() {
  const { tokenType, setTokenType, tokenTextLogo } = useTokenContext();
  
  // For POINTS, always use the zero address
  const pointsAddress = '0x0000000000000000000000000000000000000000' as Address;
  const { formattedBalance, symbol } = useTokenBalance(
    tokenType === 'POINTS' ? pointsAddress : undefined
  );

  const handleToggle = (checked: boolean) => {
    setTokenType(checked ? 'POINTS' : 'USDC');
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip.Provider>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <Badge 
              variant="outline" 
              className={cn(
                "flex items-center gap-1 py-1 px-2",
                tokenType === 'USDC' 
                  ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20' 
                  : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
              )}
            >
              <span>{tokenTextLogo}</span>
              <span className="hidden sm:inline ml-1">{tokenType}</span>
            </Badge>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>{tokenType === 'POINTS' ? 'Trump Points' : 'USDC'}</p>
            <p className="text-xs text-gray-400 mt-1">Balance: {formattedBalance} {symbol}</p>
          </Tooltip.Content>
        </Tooltip>
      </Tooltip.Provider>
      
      <Switch 
        checked={tokenType === 'POINTS'}
        onCheckedChange={handleToggle}
        className={cn(
          "data-[state=checked]:bg-orange-500"
        )}
      />
    </div>
  );
} 