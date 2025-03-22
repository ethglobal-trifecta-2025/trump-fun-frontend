'use client';

import { AuthButton } from '@/components/auth-button';
import { PoolList } from '@/components/pools/pool-list';
import { Button } from '@/components/ui/button';
import { CheckCircle, Compass, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='bg-background flex min-h-screen'>
      <main className='flex-1'>
        <section className='py-12 md:py-24'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center gap-4 text-center'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl'>
                Predict Trump&apos;s Next Moves
              </h1>
              <p className='text-muted-foreground max-w-[700px] md:text-xl'>
                Place bets on what Trump will say or do next and win big when your predictions come
                true.
              </p>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                <Button
                  variant='default'
                  className='bg-orange-500 text-white hover:bg-orange-600'
                  asChild
                >
                  <Link href='/explore'>
                    <Compass className='mr-1 h-4 w-4' />
                    Explore
                  </Link>
                </Button>
                <AuthButton />
              </div>
            </div>
          </div>
        </section>

        <section className='py-12'>
          <div className='container px-4 md:px-6'>
            <PoolList />
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

        <footer className='bg-background border-t border-gray-200 py-8 dark:border-gray-800'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
              <div className='flex flex-col items-center gap-2 md:items-start'>
                <div className='text-2xl font-bold text-orange-500'>
                  <Link href='/'>Trump.fun</Link>
                </div>
                <p className='text-muted-foreground text-center text-sm md:text-left'>
                  Predict what Trump will do next and win big!
                </p>
              </div>
              <div className='flex flex-col items-center gap-4 md:flex-row'>
                <Link href='https://twitter.com/trumpfun' target='_blank' rel='noopener noreferrer'>
                  {/* <Image
                    src='/x.jpg'
                    alt='Twitter'
                    width={20}
                    height={20}
                    className='rounded-full'
                  /> */}
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
