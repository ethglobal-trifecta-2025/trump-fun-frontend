import { USDC_DECIMALS } from '@/consts';
import { showSuccessToast } from './toast';
import { TopUpBalanceParams, TopUpBalanceResponse } from '@/app/api/mint/route';

export const topUpBalance = async (params: TopUpBalanceParams): Promise<TopUpBalanceResponse> => {
  console.log('calling topup');
  console.log('params', params);
  const response = await fetch('/api/mint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = (await response.json()) as TopUpBalanceResponse;
  console.log('topup response', data);
  if (data.success && parseFloat(data.amountMinted) > 0) {
    const formattedAmount = (parseFloat(data.amountMinted) / 10 ** USDC_DECIMALS).toLocaleString();
    showSuccessToast(
      `Thanks for dropping by! We've topped up your wallet with ${formattedAmount} POINTS, game on!`
    );
  } else if (data.success && parseFloat(data.amountMinted) === 0) {
    console.log('user already has enough POINTS, no need to top up');
  } else if (!data.success) {
    if (response.status === 429) {
      console.log(
        `User signed in has already received their POINTS mint, cooldown ends in ${
          data.rateLimitReset || '12 hours?'
        } (current time: ${new Date().toLocaleString()})`
      );
    } else {
      console.error('failed to top up USDC with non-429 error', response.status, data);
    }
  }
  return data;
};
