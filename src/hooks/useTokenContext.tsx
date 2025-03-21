'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Address } from 'viem';
import Image from 'next/image';
import { POINTS_ADDRESS, USDC_ADDRESS } from '@/consts/addresses';

// Define token types
export type TokenType = 'USDC' | 'POINTS';

// Token logos/symbols
export const TOKEN_SYMBOLS: Record<
  TokenType,
  { symbol: string; logo: React.ReactNode }
> = {
  USDC: {
    symbol: 'USDC',
    logo: (
      <Image
        src='/usdc.svg'
        alt='USDC'
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
        src='/points.svg'
        alt='POINTS'
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
  POINTS: '🦅',
};

interface TokenContextType {
  tokenType: TokenType;
  setTokenType: (type: TokenType) => void;
  getTokenAddress: () => Address | null;
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
  const getTokenAddress = (): Address | null => {
    const address = tokenType === 'USDC' ? USDC_ADDRESS : POINTS_ADDRESS;
    return address ? (address as Address) : null;
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
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
};

// Hook for consuming the context
export const useTokenContext = () => useContext(TokenContext);
