'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNetwork } from '@/hooks/useNetwork';
import { TokenSwitch } from './token-switch';
import { cn } from '@/lib/utils';

export function NetworkIndicator() {
  const { 
    networkInfo, 
    switchNetwork, 
    isHovering, 
    setIsHovering,
    supportedNetworks 
  } = useNetwork();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div 
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Badge 
          variant="outline" 
          className={cn(
            networkInfo.color,
            "mr-2 font-medium cursor-pointer py-1 px-2",
            !networkInfo.isSupported && "border-red-500 text-red-500"
          )}
          onClick={() => setIsHovering(!isHovering)}
        >
          {networkInfo.name}
        </Badge>
        
        {isHovering && (
          <div className="absolute z-50 mt-1 w-48 rounded-md bg-gray-900 p-2 text-xs shadow-lg border border-gray-700">
            {!networkInfo.isSupported ? (
              <>
                <p className="mb-2">Please switch to a supported network.</p>
                <div className="flex flex-col gap-1 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs bg-blue-600/10 text-blue-500 hover:text-blue-400"
                    onClick={() => switchNetwork(supportedNetworks.baseSepolia.id)}
                  >
                    Switch to Base Sepolia
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs bg-blue-700/10 text-blue-600 hover:text-blue-500"
                    onClick={() => switchNetwork(supportedNetworks.base.id)}
                  >
                    Switch to Base
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs bg-blue-500/10 text-blue-500 hover:text-blue-400"
                    onClick={() => switchNetwork(supportedNetworks.mainnet.id)}
                  >
                    Switch to Ethereum
                  </Button>
                </div>
              </>
            ) : (
              <p className="mb-2">You're on a supported network.</p>
            )}
          </div>
        )}
      </div>
      
      <TokenSwitch />
    </div>
  );
} 