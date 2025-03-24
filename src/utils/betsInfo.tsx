import { POINTS_DECIMALS, USDC_DECIMALS } from '@/consts';
import { TOKEN_SYMBOLS } from '@/hooks/useTokenContext';
import { GetPoolQuery, GetPoolsQuery, TokenType } from '@/lib/__generated__/graphql';
import React from 'react';

// Helper function to safely convert token amounts
const formatTokenAmount = (
  rawAmount: string | undefined,
  decimals: number,
  floor = false
): number => {
  const amount = Number(rawAmount || '0');
  const value = amount / Math.pow(10, decimals);
  return floor ? Math.floor(value) : value;
};
export const getVolumeForTokenType = (
  pool: GetPoolsQuery['pools'][number] | GetPoolQuery['pool'],
  tokenType: TokenType,
  raw = false
) => {
  if (!pool) return tokenType === TokenType.Usdc ? '0' : '0';

  const rawValue = tokenType === TokenType.Usdc ? pool.usdcVolume : pool.pointsVolume;

  if (raw) {
    return rawValue;
  }

  const decimals = tokenType === TokenType.Usdc ? USDC_DECIMALS : POINTS_DECIMALS;
  const value = Number(rawValue) / Math.pow(10, decimals);

  return Math.ceil(value);
};

export const getFormattedVolumeForTokenType = (
  pool: GetPoolsQuery['pools'][number] | GetPoolQuery['pool'],
  tokenType: TokenType,
  raw = false
) => {
  const volume = getVolumeForTokenType(pool, tokenType, raw);
  return Number(volume).toLocaleString();
};

export const calculateVolume = (
  pool: GetPoolsQuery['pools'][number] | GetPoolQuery['pool'],
  tokenType: TokenType
): React.ReactNode => {
  if (!pool) return tokenType === TokenType.Usdc ? '0' : '0';

  try {
    const isUsdc = tokenType === TokenType.Usdc;
    const rawAmount = isUsdc ? pool.usdcVolume : pool.pointsVolume;
    const decimals = isUsdc ? USDC_DECIMALS : POINTS_DECIMALS;
    const value = formatTokenAmount(rawAmount, decimals, !isUsdc);

    return (
      <>
        {TOKEN_SYMBOLS[tokenType].logo}
        <span className='ml-1'>{value.toLocaleString()}</span>
      </>
    );
  } catch (error) {
    console.error('Error calculating volume:', error);
    return tokenType === TokenType.Usdc ? '0' : '0';
  }
};

export const getBetTotals = (
  pool: GetPoolsQuery['pools'][number] | GetPoolQuery['pool'],
  tokenType: TokenType | string,
  optionIndex: number
): string => {
  if (!pool) return tokenType === TokenType.Usdc ? '$0' : '0';

  try {
    const isUsdc = tokenType === TokenType.Usdc;
    const betTotals = isUsdc ? pool.usdcBetTotals : pool.pointsBetTotals;
    if (!betTotals) return isUsdc ? '$0' : '0';

    const decimals = isUsdc ? USDC_DECIMALS : POINTS_DECIMALS;
    const value = formatTokenAmount(betTotals[optionIndex], decimals, !isUsdc);

    return value.toLocaleString();
  } catch (error) {
    console.error('Error getting bet totals:', error);
    return tokenType === TokenType.Usdc ? '$0' : '0';
  }
};
