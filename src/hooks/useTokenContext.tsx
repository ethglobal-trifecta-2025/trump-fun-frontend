'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Address } from 'viem';
import Image from 'next/image';

// Define token types
export type TokenType = 'USDC' | 'POINTS';

// Token addresses per network
export const TOKEN_ADDRESSES: Record<string, Record<number, string>> = {
  USDC: {
    84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia USDC
    8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base Mainnet USDC
    1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Ethereum Mainnet USDC
  },
  POINTS: {
    84532: "0x123456789AbCdEf0123456789AbCdEf01234567", // Base Sepolia POINTS (placeholder)
    8453: "0x123456789AbCdEf0123456789AbCdEf01234567", // Base Mainnet POINTS (placeholder)
    1: "0x123456789AbCdEf0123456789AbCdEf01234567", // Ethereum Mainnet POINTS (placeholder)
  }
};

// Token logos/symbols
export const TOKEN_SYMBOLS: Record<TokenType, { symbol: string, logo: React.ReactNode }> = {
  USDC: {
    symbol: 'USDC',
    logo: (
      <Image 
        src="/usdc.svg" 
        alt="USDC" 
        width={16} 
        height={16}
        style={{ display: 'inline' }}
      />
    ),
  },
  POINTS: {
    symbol: 'POINTS',
    logo: (
      <Image 
        src="/points.svg" 
        alt="POINTS" 
        width={16} 
        height={16}
        style={{ display: 'inline' }}
      />
    ),
  },
};

// Simple text logos for places where React nodes can't be used
export const TOKEN_TEXT_LOGOS: Record<TokenType, string> = {
  USDC: '💲',
  POINTS: '🦅'
};

interface TokenContextType {
  tokenType: TokenType;
  setTokenType: (type: TokenType) => void;
  getTokenAddress: (chainId: number) => Address | null;
  tokenSymbol: string;
  tokenLogo: React.ReactNode;
  tokenTextLogo: string;
}

// Create context with default values
const TokenContext = createContext<TokenContextType>({
  tokenType: 'USDC',
  setTokenType: () => {},
  getTokenAddress: () => null,
  tokenSymbol: TOKEN_SYMBOLS.USDC.symbol,
  tokenLogo: TOKEN_SYMBOLS.USDC.logo,
  tokenTextLogo: TOKEN_TEXT_LOGOS.USDC,
});

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [tokenType, setTokenType] = useState<TokenType>('USDC');

  // Get token information
  const tokenSymbol = TOKEN_SYMBOLS[tokenType].symbol;
  const tokenLogo = TOKEN_SYMBOLS[tokenType].logo;
  const tokenTextLogo = TOKEN_TEXT_LOGOS[tokenType];
  
  // Function to get token address for current chain
  const getTokenAddress = (chainId: number): Address | null => {
    const address = TOKEN_ADDRESSES[tokenType][chainId];
    return address ? address as Address : null;
  };

  // Load saved preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trump-fun-token-type');
      if (saved && (saved === 'USDC' || saved === 'POINTS')) {
        setTokenType(saved);
      }
    }
  }, []);

  // Save preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('trump-fun-token-type', tokenType);
    }
  }, [tokenType]);

  const value = {
    tokenType,
    setTokenType,
    getTokenAddress,
    tokenSymbol,
    tokenLogo,
    tokenTextLogo,
  };

  return (
    <TokenContext.Provider value={value}>
      {children}
    </TokenContext.Provider>
  );
};

// Hook for consuming the context
export const useTokenContext = () => useContext(TokenContext); 