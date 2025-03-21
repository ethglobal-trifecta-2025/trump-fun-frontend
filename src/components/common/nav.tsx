'use client';

import React from 'react';
import { ThemeToggle } from '../theme-toggle';
import { TrumpUserPill } from '../user-pill';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import Link from 'next/link';

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
            <ThemeToggle />
            <TrumpUserPill />
          </div>

          {/* Mobile navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden'
                aria-label='Toggle menu'
              >
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='flex h-full flex-col'>
              <SheetTitle></SheetTitle>
              <div className='mt-6 flex flex-1 flex-col items-center space-y-4'>
                <TrumpUserPill />
              </div>
              <div className='flex justify-center pb-6'>
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
