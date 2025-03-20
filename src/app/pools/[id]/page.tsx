'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Pool {
  id: string;
  title: string;
  description: string;
  creator: string;
  creatorAvatar: string;
  endTime: string;
  yesPercentage: number;
  noPercentage: number;
  totalVolume: string;
  isActive: boolean;
  comments: Comment[];
}

interface Comment {
  id: string;
  user: string;
  text: string;
  avatar: string;
}

// Sample data (would be fetched from API/blockchain in production)
const SAMPLE_POOLS = [
  {
    id: "1",
    title: "WILL I TWEET ABOUT THE DEMOCRATS TOMORROW? THEY'RE A DISASTER!",
    description: "I'm thinking about tweeting something BIG about the Democrats tomorrow. They've been causing MASSIVE problems for our country. Should I do it? Many people are saying I should!",
    creator: "Trump.fun",
    creatorAvatar: "/trump.jpeg",
    endTime: "2024-04-30T00:00:00Z",
    yesPercentage: 75,
    noPercentage: 25,
    totalVolume: "10,000 USDC",
    isActive: true,
    comments: [
      { id: "c1", user: "PatriotFan45", text: "You absolutely should, Mr. President!", avatar: "/placeholder.svg" },
      { id: "c2", user: "MAGA2024", text: "Tell them like it is!", avatar: "/placeholder.svg" },
    ]
  },
  {
    id: "2",
    title: "WILL I GO TO MADISON SQUARE GARDEN NEXT WEEK? BIG CROWDS!",
    description: "Madison Square Garden has invited me to speak next week. It&apos;s going to be HUGE, probably the biggest crowd they&apos;ve ever had. Many people are saying I should go!",
    creator: "Trump.fun",
    creatorAvatar: "/trump.jpeg",
    endTime: "2024-04-15T00:00:00Z",
    yesPercentage: 60,
    noPercentage: 40,
    totalVolume: "25,000 USDC",
    isActive: true,
    comments: [
      { id: "c1", user: "NYCTrumpFan", text: "Please come to NY! We love you!", avatar: "/placeholder.svg" },
    ]
  },
  {
    id: "3",
    title: "WILL I ANNOUNCE A NEW POLICY ON IMMIGRATION? THE BORDER IS A MESS!",
    description: "The border is a complete DISASTER. I&apos;m considering announcing a new policy that would fix everything immediately. Many people want to hear my plan!",
    creator: "Trump.fun",
    creatorAvatar: "/trump.jpeg",
    endTime: "2024-05-01T00:00:00Z",
    yesPercentage: 85,
    noPercentage: 15,
    totalVolume: "50,000 USDC",
    isActive: true,
    comments: [
      { id: "c1", user: "BorderPatrol4Trump", text: "We need your leadership on this!", avatar: "/placeholder.svg" },
      { id: "c2", user: "AmericaFirst2024", text: "Can't wait to hear your plan!", avatar: "/placeholder.svg" },
    ]
  }
]

export default function PoolDetailPage() {
  const { id } = useParams() as { id: string }
  const [pool, setPool] = useState<Pool | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [betAmount, setBetAmount] = useState('')
  const [betChoice, setBetChoice] = useState<'yes' | 'no' | null>(null)
  const [comment, setComment] = useState('')
  const { authenticated, login } = usePrivy()

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      const found = SAMPLE_POOLS.find(p => p.id === id)
      setPool(found || null)
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [id])

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-40 bg-muted rounded mb-4"></div>
        <div className="h-12 bg-muted rounded mb-6"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    )
  }

  if (!pool) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Link href="/explore" className="flex items-center text-muted-foreground mb-6">
          <ArrowLeft className="mr-2" size={16} />
          Back to Predictions
        </Link>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Pool Not Found</h2>
              <p className="text-muted-foreground">The prediction you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Button className="mt-6" asChild>
                <Link href="/explore">View All Predictions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const timeLeft = () => {
    const end = new Date(pool.endTime).getTime()
    const now = new Date().getTime()
    const diff = end - now
    
    if (diff <= 0) return "Ended"
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return `${days}d ${hours}h remaining`
  }

  const handleBet = (choice: 'yes' | 'no') => {
    if (!authenticated) {
      login()
      return
    }
    
    setBetChoice(choice)
  }

  const placeBet = () => {
    if (!authenticated) {
      login()
      return
    }
    
    if (!betAmount || !betChoice) return
    
    // Here would be the actual betting logic with wallet interaction
    alert(`Placing ${betAmount} USDC bet on ${betChoice.toUpperCase()}`)
    
    // Reset form
    setBetAmount('')
    setBetChoice(null)
  }

  const submitComment = () => {
    if (!authenticated) {
      login()
      return
    }
    
    if (!comment.trim()) return
    
    // Here would be the actual comment submission logic
    alert(`Submitting comment: ${comment}`)
    
    // Reset form
    setComment('')
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Link href="/explore" className="flex items-center text-muted-foreground mb-6">
        <ArrowLeft className="mr-2" size={16} />
        Back to Predictions
      </Link>
      
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={pool.creatorAvatar} alt={pool.creator} />
                <AvatarFallback>{pool.creator[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{pool.creator}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(pool.endTime).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge variant={pool.isActive ? "default" : "secondary"} className={pool.isActive ? "bg-green-500" : ""}>
              {pool.isActive ? "ACTIVE" : "CLOSED"}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold">{pool.title}</CardTitle>
          <CardDescription className="mt-2 text-base">{pool.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2 text-sm font-medium">
              <span>YES {pool.yesPercentage}%</span>
              <span>NO {pool.noPercentage}%</span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full bg-orange-600"
                style={{ width: `${pool.yesPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted rounded-lg p-4 text-center">
              <TrendingUp className="mx-auto mb-2 text-orange-500" size={24} />
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="font-bold">{pool.totalVolume}</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <Clock className="mx-auto mb-2 text-orange-500" size={24} />
              <p className="text-sm text-muted-foreground">Time Left</p>
              <p className="font-bold">{timeLeft()}</p>
            </div>
          </div>
          
          {pool.isActive && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold mb-4">Place Your Bet</h3>
              <div className="flex gap-4 mb-4">
                <Button 
                  className={`flex-1 ${betChoice === 'yes' ? 'bg-blue-600' : 'bg-gray-700'}`}
                  onClick={() => handleBet('yes')}
                >
                  YES
                </Button>
                <Button 
                  className={`flex-1 ${betChoice === 'no' ? 'bg-red-600' : 'bg-gray-700'}`}
                  onClick={() => handleBet('no')}
                >
                  NO
                </Button>
              </div>
              {betChoice && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Amount (USDC)"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                    />
                    <Button onClick={placeBet} className="bg-orange-600 hover:bg-orange-700">
                      Place Bet
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You are betting {betAmount || '0'} USDC that the answer will be {betChoice?.toUpperCase()}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <Tabs defaultValue="comments">
            <TabsList className="w-full">
              <TabsTrigger value="comments" className="flex-1">
                <MessageCircle className="mr-2" size={16} />
                Comments ({pool.comments.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="comments" className="pt-4">
              {authenticated && (
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button onClick={submitComment}>Post</Button>
                </div>
              )}
              
              {pool.comments.map((comment: Comment) => (
                <div key={comment.id} className="border-t border-gray-200 dark:border-gray-700 py-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar} alt={comment.user} />
                      <AvatarFallback>{comment.user[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{comment.user}</p>
                      <p className="text-muted-foreground">{comment.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {pool.comments.length === 0 && (
                <p className="text-center text-muted-foreground py-6">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 