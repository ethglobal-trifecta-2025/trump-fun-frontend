'use client'

import { useState, useEffect } from 'react'
import { PoolCard } from './pool-card'

// Sample data for demo purposes
const SAMPLE_POOLS = [
  {
    id: "1",
    title: "WILL I TWEET ABOUT THE DEMOCRATS TOMORROW? THEY'RE A DISASTER!",
    endTime: "2024-04-30T00:00:00Z",
    yesPercentage: 75,
    noPercentage: 25,
    totalVolume: "10,000 USDC",
    isActive: true
  },
  {
    id: "2",
    title: "WILL I GO TO MADISON SQUARE GARDEN NEXT WEEK? BIG CROWDS!",
    endTime: "2024-04-15T00:00:00Z",
    yesPercentage: 60,
    noPercentage: 40,
    totalVolume: "25,000 USDC",
    isActive: true
  },
  {
    id: "3",
    title: "WILL I ANNOUNCE A NEW POLICY ON IMMIGRATION? THE BORDER IS A MESS!",
    endTime: "2024-05-01T00:00:00Z",
    yesPercentage: 85,
    noPercentage: 15,
    totalVolume: "50,000 USDC",
    isActive: true
  }
]

export function PoolList() {
  const [pools] = useState(SAMPLE_POOLS)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[300px] rounded-lg bg-muted p-4 animate-pulse" />
        ))}
      </div>
    )
  }
  
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Active Prediction Markets</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pools.map((pool) => (
          <PoolCard key={pool.id} pool={pool} />
        ))}
      </div>
    </div>
  )
} 