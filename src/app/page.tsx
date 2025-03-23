'use client';

import { AuthButton } from '@/components/auth-button';
import { PoolList } from '@/components/pools/pool-list';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import { TRUMP_FUN_TG_URL, TRUMP_FUN_TWITTER_URL } from '@/utils/config';
import { CheckCircle, Compass, DollarSign, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useCallback } from 'react';
import { topUpBalance } from '@/utils/topUp';
import { useBalance } from '@/components/usePointsBalance';

export default function Home() {
  const { ready, authenticated, user } = usePrivy();
  const { refetch: fetchBalance } = useBalance();

  // Use useCallback to prevent the function from being recreated on every render
  const handleTopUp = useCallback(async () => {
    console.log('handleTopUp called with:', {
      ready,
      authenticated,
      hasUser: !!user,
      walletAddress: user?.wallet?.address,
    });

    if (!ready || !authenticated || !user) {
      console.log('Not ready or not authenticated yet, skipping top-up');
      return;
    }

    if (!user.wallet?.address) {
      console.log('No wallet address available, skipping top-up');
      return;
    }

    try {
      const result = await topUpBalance({
        walletAddress: user.wallet.address,
      });

      if (!result.success) {
        if (result.error && result.rateLimitReset) {
          console.log(
            `Top-up rate limited: ${result.error}. Available again in ${result.rateLimitReset}`
          );
        } else if (result.error) {
          console.error(`Top-up failed: ${result.error}`);
        }
      } else {
        console.log('Top-up successful, result:', result);
      }

      // Sleep for 2 seconds to ensure the balance is updated
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Fetching updated balance...');
      fetchBalance();
    } catch (error) {
      console.error('Error in handleTopUp:', error);
    }
  }, [ready, authenticated, user, fetchBalance]);

  useEffect(() => {
    console.log('Home page mounted, initial state:', {
      ready,
      authenticated,
      hasUser: !!user,
      walletAddress: user?.wallet?.address,
    });
  }, [authenticated, ready, user]);

  useEffect(() => {
    console.log('Auth/wallet state changed:', {
      ready,
      authenticated,
      hasUser: !!user,
      walletAddress: user?.wallet?.address,
    });

    console.log(ready, authenticated, user);

    if (ready && authenticated && user) {
      console.log('All conditions met, calling handleTopUp');
      handleTopUp();
    } else {
      console.log('Conditions not met, skipping handleTopUp');
    }
  }, [ready, authenticated, user, handleTopUp]);

  return (
    <div className='bg-background flex min-h-screen'>
      <main className='flex-1'>
        <section>
          <div className='container'>
            <div className='relative flex flex-col items-center gap-4 text-center'>
              <Image
                src='/hero.png'
                alt='Trump'
                width={1000}
                height={1000}
                className='h-auto w-full rounded-lg'
              />
              <div className='mt-4 flex w-full flex-col gap-2 md:absolute md:bottom-28 md:left-10 md:mt-0 md:transform md:flex-row'>
                <Button
                  variant='default'
                  className='h-12 w-full bg-orange-500 text-lg font-semibold text-white hover:bg-orange-600 md:max-w-48'
                  asChild
                >
                  <Link href='/explore'>
                    <Compass className='mr-2 h-4 w-4' />
                    Explore
                  </Link>
                </Button>
                <AuthButton />
              </div>
            </div>
          </div>
        </section>
        <section className='bg-muted/50 py-12 md:py-18'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-3 lg:gap-12'>
              <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                <div className='rounded-full bg-orange-100 p-4'>
                  <CheckCircle className='h-6 w-6 text-orange-500' />
                </div>
                <h3 className='text-xl font-bold'>Predict</h3>
                <p className='text-muted-foreground'>
                  Bet on what Trump will tweet, say, or do next.
                </p>
              </div>
              <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                <div className='rounded-full bg-orange-100 p-4'>
                  <DollarSign className='h-6 w-6 text-orange-500' />
                </div>
                <h3 className='text-xl font-bold'>Earn</h3>
                <p className='text-muted-foreground'>Win big when your predictions come true.</p>
              </div>
              <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                <div className='rounded-full bg-orange-100 p-4'>
                  <Users className='h-6 w-6 text-orange-500' />
                </div>
                <h3 className='text-xl font-bold'>Connect</h3>
                <p className='text-muted-foreground'>
                  Join the community and discuss the latest happenings.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className='py-12'>
          <div className='container px-4 md:px-6'>
            <PoolList />
          </div>
        </section>

        <footer className='bg-background border-t border-gray-200 py-8 dark:border-gray-800'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
              <div className='flex flex-col items-center gap-2 md:items-start'>
                <div className='text-2xl font-bold text-orange-500'>
                  <Link href='/'>Trump.fun</Link>
                </div>
              </div>
              <div className='flex flex-col items-center gap-6 md:flex-row'>
                <Link href={TRUMP_FUN_TG_URL} target='_blank' rel='noopener noreferrer'>
                  <Image src='/tg.svg' alt='tg' width={20} height={20} className='size-7' />
                </Link>
                <Link href={TRUMP_FUN_TWITTER_URL} target='_blank' rel='noopener noreferrer'>
                  <svg
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                    className='size-6 fill-current text-orange-500'
                  >
                    <g>
                      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'></path>
                    </g>
                  </svg>
                </Link>
              </div>
            </div>
            <div className='text-muted-foreground mt-8 text-center text-xs'>
              © {new Date().getFullYear()} Trump.fun. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
