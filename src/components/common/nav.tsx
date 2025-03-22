'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User } from 'lucide-react';
import Link from 'next/link';
import { NetworkIndicator } from '../network-indicator';
import { ThemeToggle } from '../theme-toggle';
import { TrumpUserPill } from '../user-pill';

export default function Nav() {
  return (
    <>
      <header className='flex h-full items-center justify-between px-4 py-2 md:h-16 md:py-0'>
        <div className='text-2xl font-bold text-orange-500'>
          <Link href='/'>Trump.fun</Link>
        </div>
        <div className='flex h-full items-center gap-4'>
          {/* Desktop navigation */}
          <div className='hidden items-center gap-4 md:flex'>
            <NetworkIndicator />
            <ThemeToggle />
            <Button
              variant='outline'
              className='h-10.5 bg-transparent text-gray-400 hover:bg-transparent hover:text-orange-500'
              asChild
            >
              <Link href='/profile'>
                <User size={18} className='mr-0.5' />
                Profile
              </Link>
            </Button>
            <TrumpUserPill />
          </div>

          {/* Mobile navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden' aria-label='Toggle menu'>
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='flex h-full flex-col'>
              <SheetTitle></SheetTitle>
              <div className='mt-6 flex flex-1 flex-col items-center gap-6'>
                <NetworkIndicator />
                <TrumpUserPill />
              </div>
              <div className='flex flex-col items-center gap-4 pb-6'>
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
