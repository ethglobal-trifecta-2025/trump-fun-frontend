'use client';

import { useChainId, useSwitchChain } from 'wagmi';
import { USDC_ADDRESSES } from '@/components/network-indicator';
import { baseSepolia, base, mainnet, sepolia } from 'viem/chains';
import { useState, useCallback } from 'react';

/**
 * Network information for a specific chain
 */
export interface NetworkInfo {
  id: number;
  name: string;
  color: string;
  isSupported: boolean;
}

/**
 * Custom hook for handling network information and chain switching
 */
export const useNetwork = () => {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [isHovering, setIsHovering] = useState(false);
  
  // Get network data using viem's chain objects
  const getNetworkInfo = useCallback((id: number): NetworkInfo => {
    // Check for known chains
    if (id === baseSepolia.id) {
      return {
        id,
        name: "Base Sepolia",
        color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
        isSupported: true
      };
    } else if (id === base.id) {
      return {
        id,
        name: "Base",
        color: 'bg-blue-600/10 text-blue-600 hover:bg-blue-600/20',
        isSupported: true
      };
    } else if (id === sepolia.id) {
      return {
        id,
        name: "Sepolia",
        color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
        isSupported: false
      };
    } else if (id === mainnet.id) {
      return {
        id,
        name: "Ethereum",
        color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
        isSupported: true
      };
    }
    
    // Default for unknown chains
    return {
      id,
      name: `Chain ${id}`,
      color: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
      isSupported: false
    };
  }, []);

  // Get the current network info
  const networkInfo = getNetworkInfo(chainId);
  
  // Handle network switching
  const handleSwitchNetwork = useCallback((targetChainId: number) => {
    try {
      switchChain({ chainId: targetChainId });
    } catch (error) {
      // Silently handle the error
    }
  }, [switchChain]);
  
  // Get USDC address for current chain
  const usdcAddress = USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] || null;
  
  // Check if USDC is supported on current chain
  const isUsdcSupported = Boolean(usdcAddress);
  
  return {
    chainId,
    networkInfo,
    usdcAddress,
    isUsdcSupported,
    supportedNetworks: {
      baseSepolia,
      base,
      mainnet
    },
    switchNetwork: handleSwitchNetwork,
    isSwitchingNetwork: isPending,
    isHovering,
    setIsHovering
  };
}; 