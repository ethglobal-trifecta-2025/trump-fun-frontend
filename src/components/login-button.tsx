import { topUpBalance } from '@/utils/topUp';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { Button } from './ui/button';
import { useBalance } from './usePointsBalance';
import { useEmbeddedWallet } from './EmbeddedWalletProvider';

export const PrivyLogoutButton = () => {
  const { logout } = usePrivy();
  return <Button onClick={logout}>Log out</Button>;
};

export function PrivyLoginButton() {
  const { ready, authenticated } = usePrivy();
  const { embeddedWallet } = useEmbeddedWallet();
  const { refetch: fetchBalance } = useBalance();

  useEffect(() => {
    console.log(
      'ready in privy login button',
      ready,
      'authenticated:',
      authenticated,
      'wallet:',
      embeddedWallet
    );
    if (!ready || !authenticated) {
      return console.log('Not ready or not authenticated yet');
    }

    if (!embeddedWallet) {
      return console.log('No embedded wallet available yet');
    }

    const makeCall = async () => {
      try {
        console.log('embeddedWallet address:', embeddedWallet.address);
        console.log('topping up');
        const result = await topUpBalance({
          walletAddress: embeddedWallet.address,
        });

        if (!result.success) {
          if (result.error && result.rateLimitReset) {
            // Rate limited case - log but don't escalate
            console.log(
              ` top-up rate limited: ${result.error}. Available again in ${result.rateLimitReset}`
            );
          } else if (result.error) {
            // Other error - use console.error but don't escalate to user
            console.error(` top-up failed: ${result.error}`);
          }
        } else {
          console.log(' top-up result:', result);
          fetchBalance();
        }
      } catch (error) {
        console.error('Error in makeCall:', error);
      }
    };

    makeCall();
  }, [ready, authenticated, embeddedWallet, fetchBalance]);

  const { login } = useLogin({
    onError: (error) => {
      console.error('Login error:', error);
    },
    onComplete: async ({ user }) => {
      console.log('login complete', embeddedWallet, user);
      const result = await topUpBalance({
        walletAddress: user.wallet?.address || '',
      });

      if (!result.success) {
        if (result.error && result.rateLimitReset) {
          // Rate limited case - log but don't escalate
          console.log(
            ` top-up rate limited: ${result.error}. Available again in ${result.rateLimitReset}`
          );
        } else if (result.error) {
          // Other error - use console.error but don't escalate to user
          console.error(` top-up failed: ${result.error}`);
        }
      } else {
        console.log('onComplete useLogin  top-up result:', result);
      }

      //Sleep for 2 seconds to ensure the balance is updated
      await new Promise((resolve) => setTimeout(resolve, 2000));

      fetchBalance();
    },
  });

  const disableLogin = !ready || (ready && authenticated);

  return (
    <Button
      disabled={disableLogin}
      onClick={login}
      className='bg-orange-500 text-white hover:bg-orange-600'
    >
      Log in
    </Button>
  );
}
