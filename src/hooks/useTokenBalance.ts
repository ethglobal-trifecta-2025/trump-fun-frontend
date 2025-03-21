'use client';

import { useBalance } from 'wagmi';
import { useWalletAddress } from './useWalletAddress';
import { type Address } from 'viem';
import { useState, useEffect } from 'react';
import { useTokenContext } from './useTokenContext';

interface UseTokenBalanceOptions {
  /** Whether to enable the balance query */
  enabled?: boolean;
}

/**
 * A custom hook to fetch token balances that works with both Privy and wagmi wallets.
 * 
 * @param tokenAddress Optional token address (uses the current selected token from context by default)
 * @param options Additional options for balance fetching
 */
export const useTokenBalance = (
  tokenAddress?: Address,
  options: UseTokenBalanceOptions = {}
) => {
  const { address, isConnected, chainId } = useWalletAddress();
  const { tokenType, getTokenAddress, tokenSymbol, tokenLogo, tokenTextLogo } = useTokenContext();
  const [lastSuccessfulBalance, setLastSuccessfulBalance] = useState<any>(null);
  const [lastSuccessfulChainId, setLastSuccessfulChainId] = useState<number | null>(null);
  
  // For POINTS, use ETH zero address (0x0000...) if on testnet/local, otherwise use the network specific address
  let finalTokenAddress;
  if (tokenType === 'POINTS') {
    finalTokenAddress = '0x0000000000000000000000000000000000000000' as Address;
  } else {
    finalTokenAddress = tokenAddress || (chainId ? getTokenAddress(chainId) : null);
  }
  
  // Only fetch if we have both a wallet address and a token address
  const shouldFetch = Boolean(
    isConnected && 
    address && 
    finalTokenAddress && 
    (options.enabled !== false)
  );
  
  const { 
    data: balance,
    isLoading,
    isError,
    error,
    refetch,
    isSuccess
  } = useBalance({
    address: shouldFetch ? address : undefined,
    token: shouldFetch && finalTokenAddress ? finalTokenAddress : undefined,
  });

  // Store the last successful balance to avoid flashing zeros during network changes
  useEffect(() => {
    if (isSuccess && balance && parseFloat(balance.formatted) > 0) {
      setLastSuccessfulBalance(balance);
      setLastSuccessfulChainId(chainId);
    }
  }, [isSuccess, balance, chainId]);
  
  // Use the current balance if available and non-zero, otherwise use the cached balance
  const finalBalance = 
    (balance && parseFloat(balance.formatted) > 0) ? balance : 
    (lastSuccessfulChainId === chainId && lastSuccessfulBalance) ? lastSuccessfulBalance : 
    balance || null;
  
  // Mock balances for demo purposes
  // This is a temporary solution until real token balances are integrated
  const mockBalance = {
    USDC: '10.000000',
    POINTS: '1.000000'
  };
  
  // Helper for formatted display with fixed decimal places
  const formattedBalance = tokenType === 'POINTS' 
    ? mockBalance.POINTS 
    : (finalBalance?.formatted ? parseFloat(finalBalance.formatted).toFixed(6) : mockBalance.USDC);
    
  return {
    balance: finalBalance,
    formattedBalance,
    symbol: tokenSymbol,
    decimals: finalBalance?.decimals || 6,
    tokenLogo,
    tokenTextLogo,
    isLoading,
    isError,
    error,
    refetch
  };
}
