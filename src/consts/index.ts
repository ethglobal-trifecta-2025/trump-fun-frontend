export const USDC_DECIMALS = 6; // USDC has 6 decimals
export const POINTS_DECIMALS = USDC_DECIMALS; // Points has 6 decimals
export const CHAIN_ID = 84532; // Base chain ID

export const POLLING_INTERVALS: Record<string, number> = {
  'landing-pools': 2000,
  'pool-lising': 5000,
  'pool-drilldown-main': 3000,
  'pool-drilldown-comments': 3000,
  'user-profile': 5000,
};
