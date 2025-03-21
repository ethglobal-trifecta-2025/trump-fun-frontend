import { AuthButton } from '@/components/auth-button';
import { PoolList } from '@/components/pools/pool-list';

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
                Place bets on what Trump will say or do next and win big when
                your predictions come true.
              </p>
              <div className='flex flex-col gap-2 min-[400px]:flex-row'>
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

        <section className='bg-muted/50 py-12 md:py-24'>
          <div className='container px-4 md:px-6'>
            <div className='grid gap-6 lg:grid-cols-3 lg:gap-12'>
              <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                <div className='rounded-full bg-orange-100 p-4'>
                  <svg
                    className='h-6 w-6 text-orange-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    ></path>
                  </svg>
                </div>
                <h3 className='text-xl font-bold'>Predict</h3>
                <p className='text-muted-foreground'>
                  Bet on what Trump will tweet, say, or do next.
                </p>
              </div>
              <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                <div className='rounded-full bg-orange-100 p-4'>
                  <svg
                    className='h-6 w-6 text-orange-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    ></path>
                  </svg>
                </div>
                <h3 className='text-xl font-bold'>Earn</h3>
                <p className='text-muted-foreground'>
                  Win big when your predictions come true.
                </p>
              </div>
              <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                <div className='rounded-full bg-orange-100 p-4'>
                  <svg
                    className='h-6 w-6 text-orange-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
                    ></path>
                  </svg>
                </div>
                <h3 className='text-xl font-bold'>Connect</h3>
                <p className='text-muted-foreground'>
                  Join the community and discuss the latest happenings.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
