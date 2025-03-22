import { TokenType } from '@/hooks/useTokenContext';
import { Pool } from '@/lib/__generated__/graphql';

const USDC_DECIMALS = 1;
const POINTS_DECIMALS = 6;

// Helper function to safely handle incomplete Pool objects from GraphQL
export const safeCastPool = (poolData: any): Pool => {
  return {
    ...poolData,
    bets: poolData.bets || [],
    closureCriteria: poolData.closureCriteria || '',
    closureInstructions: poolData.closureInstructions || '',
    isDraw: poolData.isDraw || false,
    originalTruthSocialPostId: poolData.originalTruthSocialPostId || '',
    pointsBetTotals: poolData.pointsBetTotals || [],
    pointsVolume: poolData.pointsVolume || '0',
    usdcBetTotals: poolData.usdcBetTotals || [],
    usdcVolume: poolData.usdcVolume || '0',
    winningOption: poolData.winningOption || '0'
  } as Pool;
};

export const calculateVolume = (pool: Pool, tokenType: TokenType): string => {
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
      
      return `${Math.floor(value).toLocaleString()} pts`;
    }
  } catch (error) {
    console.error('Error calculating volume:', error, { pool, tokenType });
    return tokenType === TokenType.USDC ? '$0' : '0 pts';
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
  const value = Number(amount) / Math.pow(10, decimals);

  return tokenType === TokenType.USDC 
    ? `$${value.toLocaleString()}` 
    : `${Math.floor(value).toLocaleString()}`;
};
