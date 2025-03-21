'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNetwork } from '@/hooks/useNetwork';

// Export the USDC_ADDRESSES for other components to use
export const USDC_ADDRESSES: Record<number, string> = {
  [84532]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
  [8453]: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base Mainnet USDC
  [1]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Ethereum Mainnet USDC
};

export function NetworkIndicator() {
  const { 
    networkInfo, 
    switchNetwork, 
    isHovering, 
    setIsHovering,
    supportedNetworks 
  } = useNetwork();

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Badge 
        variant="outline" 
        className={`${networkInfo.color} mr-2 font-medium cursor-pointer ${!networkInfo.isSupported ? 'border-red-500 text-red-500' : ''}`}
        onClick={() => setIsHovering(!isHovering)}
      >
        {networkInfo.name}
      </Badge>
      
      {isHovering && (
        <div className="absolute z-50 mt-1 w-48 rounded-md bg-gray-900 p-2 text-xs shadow-lg border border-gray-700">
          {!networkInfo.isSupported ? (
            <>
              <p className="mb-2">Please switch to a supported network for best experience.</p>
              <p className="text-gray-400 mb-2">USDC betting requires Base, Base Sepolia, or Ethereum.</p>
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
            <>
              <p className="mb-2">You're on a supported network.</p>
              <p className="text-gray-400 mb-2">USDC betting is available.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
} 