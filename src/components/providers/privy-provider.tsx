'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { baseSepolia, base, mainnet } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';

// Create a Wagmi config - ensure we're importing createConfig from @privy-io/wagmi
const wagmiConfig = createConfig({
  chains: [baseSepolia, mainnet, base],
  transports: {
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});

// Create a QueryClient instance
const queryClient = new QueryClient();

export function PrivyAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: [
          'email',
          'wallet',
          'twitter',
          'google',
          'discord',
          'apple',
          'farcaster',
          'passkey',
        ],
        appearance: {
          theme: 'dark',
          accentColor: '#ff6d00',
          logo: 'https://yourdomain.com/logo.png',
          walletList: [
            'metamask',
            'coinbase_wallet',
            'rainbow',
            'wallet_connect',
          ],
          walletChainType: 'ethereum-only',
        },
        embeddedWallets: {
          createOnLogin: 'all-users',
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia, mainnet, base],
        passkeys: {
          shouldUnlinkOnUnenrollMfa: false,
          shouldUnenrollMfaOnUnlink: false,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
