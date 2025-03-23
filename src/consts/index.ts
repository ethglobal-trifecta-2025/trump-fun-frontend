export const USDC_DECIMALS = 6; // USDC has 6 decimals
export const POINTS_DECIMALS = USDC_DECIMALS; // Points has 6 decimals
export const CHAIN_ID = 84532; // Base chain ID

export const POLLING_INTERVALS: Record<string, number> = {
  'landing-pools': 1000,
  'pool-lising': 1000,
  'pool-drilldown-main': 1000,
  'pool-drilldown-comments': 1000,
  'explore-pools': 1000,
  'user-profile': 1000,
  'user-bets': 1000,
};
