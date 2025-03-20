'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useWallets } from '@privy-io/react-auth'
import { useLoginWithPasskey } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { Wallet, Plus, LogOut, Key } from 'lucide-react'
import { useAccount } from 'wagmi'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function AuthButton() {
  const { login, authenticated, ready: authReady, createWallet, logout } = usePrivy()
  const { loginWithPasskey } = useLoginWithPasskey()
  const { wallets, ready: walletsReady } = useWallets()
  const { address } = useAccount()

  // Only check authReady initially
  if (!authReady) {
    return (
      <Button disabled className="bg-gray-400">
        Loading Auth...
      </Button>
    )
  }

  // If not authenticated, show login options
  if (!authenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-orange-600 hover:bg-orange-700">
            Connect
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => login({
              loginMethods: ['email', 'wallet', 'twitter', 'google', 'discord', 'apple', 'farcaster']
            })}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Login with Social/Email
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => loginWithPasskey()}
          >
            <Key className="mr-2 h-4 w-4" />
            Login with Passkey
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // If authenticated but wallets aren't ready yet
  if (!walletsReady) {
    return (
      <Button disabled className="bg-gray-400">
        Loading Wallets...
      </Button>
    )
  }

  // If authenticated and wallets are ready, but no wallets exist
  if (wallets.length === 0) {
    return (
      <Button 
        onClick={() => createWallet()} 
        className="bg-orange-600 hover:bg-orange-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Wallet with Passkey
      </Button>
    )
  }
  
  // If authenticated and has wallets, show wallet menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className="border-orange-600 text-orange-600 hover:bg-orange-50"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {wallets.map((wallet) => (
          <DropdownMenuItem key={wallet.address} className="cursor-pointer">
            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
            {wallet.walletClientType === 'privy' ? ' (Embedded)' : ' (External)'}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-500 cursor-pointer" 
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 