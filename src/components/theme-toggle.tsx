'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Computer, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center space-x-1 rounded-md border bg-background p-1">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setTheme('light')}
        className={cn(
          'transition-colors group',
          theme === 'light' 
            ? 'bg-[#ff6d00] hover:bg-[#ff6d00] focus:bg-[#ff6d00] active:bg-[#ff6d00] text-white' 
            : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
        )}
      >
        <Sun className={cn(
          'h-4 w-4',
          theme === 'light' && 'group-hover:text-black'
        )} />
        <span className="sr-only">Light Mode</span>
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setTheme('dark')}
        className={cn(
          'transition-colors group',
          theme === 'dark' 
            ? 'bg-[#ff6d00] hover:bg-[#ff6d00] focus:bg-[#ff6d00] active:bg-[#ff6d00] text-white' 
            : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
        )}
      >
        <Moon className={cn(
          'h-4 w-4',
          theme === 'dark' && 'group-hover:text-black'
        )} />
        <span className="sr-only">Dark Mode</span>
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setTheme('system')}
        className={cn(
          'transition-colors group',
          theme === 'system' 
            ? 'bg-[#ff6d00] hover:bg-[#ff6d00] focus:bg-[#ff6d00] active:bg-[#ff6d00] text-white' 
            : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
        )}
      >
        <Computer className={cn(
          'h-4 w-4',
          theme === 'system' && 'group-hover:text-black'
        )} />
        <span className="sr-only">System Mode</span>
      </Button>
    </div>
  )
} 