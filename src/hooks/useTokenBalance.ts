'use client';

import { useBalance } from 'wagmi';
import { useWalletAddress } from './useWalletAddress';
import { type Address } from 'viem';
import { useState, useEffect } from 'react';

interface UseTokenBalanceOptions {
  /** Whether to enable the balance query */
  enabled?: boolean;
}

/**
 * A custom hook to fetch token balances that works with both Privy and wagmi wallets.
 * 
 * @param tokenAddress Optional token address (uses USDC for the current chain by default)
 * @param options Additional options for balance fetching
 */
export const useTokenBalance = (
  tokenAddress?: Address,
  options: UseTokenBalanceOptions = {}
) => {
  const { address, usdcAddress, isConnected, chainId } = useWalletAddress();
  const [lastSuccessfulBalance, setLastSuccessfulBalance] = useState<any>(null);
  const [lastSuccessfulChainId, setLastSuccessfulChainId] = useState<number | null>(null);
  
  // Use the provided token address or default to USDC for the current chain
  const finalTokenAddress = tokenAddress || (usdcAddress as Address);
  
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
    token: shouldFetch ? finalTokenAddress : undefined,
  });

  // Store the last successful balance to avoid flashing zeros during network changes
  useEffect(() => {
    if (isSuccess && balance && parseFloat(balance.formatted) > 0) {
      setLastSuccessfulBalance(balance);
      setLastSuccessfulChainId(chainId);
    }
  }, [isSuccess, balance, chainId]);
  
  // Use the current balance if available and non-zero, otherwise use the cached balance if on the same chain
  const finalBalance = 
    (balance && parseFloat(balance.formatted) > 0) ? balance : 
    (lastSuccessfulChainId === chainId && lastSuccessfulBalance) ? lastSuccessfulBalance : 
    balance || null;
  
  // Helper for formatted display with fixed decimal places
  const formattedBalance = finalBalance?.formatted 
    ? parseFloat(finalBalance.formatted).toFixed(6)
    : '0';
    
  return {
    balance: finalBalance,
    formattedBalance,
    symbol: finalBalance?.symbol || 'USDC',
    decimals: finalBalance?.decimals || 6,
    isLoading,
    isError,
    error,
    refetch
  };
}; 