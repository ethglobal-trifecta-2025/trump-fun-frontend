import { POINTS_DECIMALS, USDC_DECIMALS } from '@/consts';
import { TokenType } from '@/hooks/useTokenContext';
import { GetPoolQuery, GetPoolsQuery } from '@/lib/__generated__/graphql';

export const calculateVolume = (
  pool: GetPoolsQuery['pools'][number] | GetPoolQuery['pool'],
  tokenType: TokenType
): string => {
  try {
    if (!pool) {
      console.error('Pool is undefined in calculateVolume');
      return tokenType === TokenType.USDC ? '$0' : '0 pts';
    }

    if (tokenType === TokenType.USDC) {
      // Simple conversion for debugging
      const rawValue = Number(pool.usdcVolume || '0');
      // Divide by 10^USDC_DECIMALS (1)
      const value = rawValue / Math.pow(10, USDC_DECIMALS);

      // Check if value is NaN and return a default value
      if (isNaN(value)) {
        console.error('USDC volume is NaN', { raw: pool.usdcVolume });
        return '$0';
      }

      return `$${value.toLocaleString()}`;
    } else {
      // Simple conversion for debugging
      const rawValue = Number(pool.pointsVolume || '0');
      // Divide by 10^POINTS_DECIMALS (6)
      const value = rawValue / Math.pow(10, POINTS_DECIMALS);

      // Check if value is NaN and return a default value
      if (isNaN(value)) {
        console.error('Points volume is NaN', { raw: pool.pointsVolume });
        return '0 pts';
      }

      return `${Math.floor(value).toLocaleString()}`;
    }
  } catch (error) {
    console.error('Error calculating volume:', error, { pool, tokenType });
    return tokenType === TokenType.USDC ? '$0' : '0 pts';
  }
};

export const getBetTotals = (
  pool: GetPoolsQuery['pools'][number] | GetPoolQuery['pool'],
  tokenType: TokenType,
  optionIndex: number
) => {
  if (!pool) return tokenType === TokenType.USDC ? '$0' : '0';

  const betTotals = tokenType === TokenType.USDC ? pool.usdcBetTotals : pool.pointsBetTotals;

  // Check if betTotals is undefined
  if (!betTotals) {
    console.error('Bet totals are undefined', { pool, tokenType });
    return tokenType === TokenType.USDC ? '$0' : '0';
  }

  const amount = betTotals[optionIndex] || '0';
  const decimals = tokenType === TokenType.USDC ? USDC_DECIMALS : POINTS_DECIMALS;
  const value = Number(amount) / Math.pow(10, decimals);

  return tokenType === TokenType.USDC
    ? `$${value.toLocaleString()}`
    : `${Math.floor(value).toLocaleString()}`;
};
