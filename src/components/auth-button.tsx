'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'

export function AuthButton() {
  const { login, authenticated, ready } = usePrivy()

  if (!ready) {
    return (
      <Button disabled className="bg-gray-400">
        Loading...
      </Button>
    )
  }

  return (
    <Button 
      onClick={authenticated ? undefined : login} 
      variant={authenticated ? "outline" : "default"}
      className={authenticated ? "border-orange-600 text-orange-600" : "bg-orange-600 hover:bg-orange-700"}
    >
      {authenticated ? "Connected" : "Connect Wallet"}
    </Button>
  )
} 