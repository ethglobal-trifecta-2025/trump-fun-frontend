'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLoginWithPasskey, usePrivy, useWallets } from '@privy-io/react-auth';
import { Key, LogOut, Plus, Wallet } from 'lucide-react';
import { useAccount } from 'wagmi';

export function AuthButton() {
  const { login, authenticated, ready: authReady, createWallet, logout } = usePrivy();
  const { loginWithPasskey } = useLoginWithPasskey();
  const { wallets, ready: walletsReady } = useWallets();
  const { address } = useAccount();

  // Only check authReady initially
  if (!authReady) {
    return (
      <Button size='lg' disabled className='bg-gray-400 w-full max-w-48 h-12'>
        Loading Auth...
      </Button>
    );
  }

  // If not authenticated, show login options
  if (!authenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='lg' className='border-2 border-orange-500 bg-background/0 text-orange-500 hover:text-orange-600 hover:bg-orange-50 w-full md:max-w-48 h-12 text-lg font-semibold'>
            Connect
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() =>
              login({
                loginMethods: [
                  'email',
                  'wallet',
                  'twitter',
                  'google',
                  'discord',
                  'apple',
                  'farcaster',
                ],
              })
            }
          >
            <Wallet className='mr-2 h-4 w-4' />
            Login with Social/Email
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer' onClick={() => loginWithPasskey()}>
            <Key className='mr-2 h-4 w-4' />
            Login with Passkey
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If authenticated but wallets aren't ready yet
  if (!walletsReady) {
    return (
      <Button size='lg' disabled className='bg-gray-400 w-full max-w-48 h-12 text-lg font-semibold'>
        Loading Wallets...
      </Button>
    );
  }

  // If authenticated and wallets are ready, but no wallets exist
  if (wallets.length === 0) {
    return (
      <Button size='lg' onClick={() => createWallet()} className='bg-orange-500 hover:bg-orange-600 w-full md:max-w-48 h-12 text-lg font-semibold'>
        <Plus className='mr-2 h-4 w-4' />
        Create Wallet with Passkey
      </Button>
    );
  }

  // If authenticated and has wallets, show wallet menu and explore button
  return (
    <div className='flex gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            className='border-2 border-orange-500 bg-background/0 text-orange-500 hover:bg-orange-50 w-full md:max-w-48 h-12 text-lg font-semibold'
          >
            <Wallet className='mr-2 h-4 w-4' />
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          {wallets.map((wallet) => (
            <DropdownMenuItem key={wallet.address} className='cursor-pointer'>
              {wallet.address.slice(0, 6)}...
              {wallet.address.slice(-4)}
              {wallet.walletClientType === 'privy' ? ' (Embedded)' : ' (External)'}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className='cursor-pointer text-red-500' onClick={logout}>
            <LogOut className='mr-2 h-4 w-4' />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
