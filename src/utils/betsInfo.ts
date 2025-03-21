import { TokenType } from '@/hooks/useTokenContext';
import { Pool } from '@/lib/__generated__/graphql';

const USDC_DECIMALS = 1;
const POINTS_DECIMALS = 6;

export const calculateVolume = (pool: Pool, tokenType: TokenType) => {
  if (!pool) return tokenType === TokenType.USDC ? '$0' : '0 pts';

  if (tokenType === TokenType.USDC) {
    const total = pool.usdcBetTotals.reduce(
      (sum: number, bet: string) => sum + Number(bet),
      0
    );
    const value = total / Math.pow(10, USDC_DECIMALS);
    return `$${value.toFixed(2)}`;
  } else {
    const total = pool.pointsBetTotals.reduce(
      (sum: number, bet: string) => sum + Number(bet),
      0
    );
    const value = total / Math.pow(10, POINTS_DECIMALS);
    return `${Math.floor(value)} pts`;
  }
};

export const getBetTotals = (
  pool: Pool,
  tokenType: TokenType,
  optionIndex: number
) => {
  if (!pool) return tokenType === TokenType.USDC ? '$0' : '0';

  const betTotals =
    tokenType === TokenType.USDC ? pool.usdcBetTotals : pool.pointsBetTotals;
  const amount = betTotals[optionIndex] || '0';
  const decimals =
    tokenType === TokenType.USDC ? USDC_DECIMALS : POINTS_DECIMALS;
  const value = Math.floor(parseInt(String(amount)) / Math.pow(10, decimals));

  return tokenType === TokenType.USDC ? `$${value}` : `${value}`;
};
