import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Comment } from '@/types/database.types';
import CommentSectionWrapper from '@/components/comments/comment-section-wrapper';

// Type for pools in the sample data
type SamplePool = {
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
  comments: Array<{
    id: string;
    user: string;
    text: string;
    avatar: string;
  }>;
};

// Sample data (would be fetched from API/blockchain in production)
const SAMPLE_POOLS: SamplePool[] = [
  {
    id: '1',
    title: "WILL I TWEET ABOUT THE DEMOCRATS TOMORROW? THEY'RE A DISASTER!",
    description:
      "I'm thinking about tweeting something BIG about the Democrats tomorrow. They've been causing MASSIVE problems for our country. Should I do it? Many people are saying I should!",
    creator: 'Trump.fun',
    creatorAvatar: '/trump.jpeg',
    endTime: '2024-04-30T00:00:00Z',
    yesPercentage: 75,
    noPercentage: 25,
    totalVolume: '10,000 USDC',
    isActive: true,
    comments: [
      {
        id: 'c1',
        user: 'PatriotFan45',
        text: 'You absolutely should, Mr. President!',
        avatar: '/placeholder.svg',
      },
      {
        id: 'c2',
        user: 'MAGA2024',
        text: 'Tell them like it is!',
        avatar: '/placeholder.svg',
      },
    ],
  },
  {
    id: '2',
    title: 'WILL I GO TO MADISON SQUARE GARDEN NEXT WEEK? BIG CROWDS!',
    description:
      'Madison Square Garden has invited me to speak next week. It&apos;s going to be HUGE, probably the biggest crowd they&apos;ve ever had. Many people are saying I should go!',
    creator: 'Trump.fun',
    creatorAvatar: '/trump.jpeg',
    endTime: '2024-04-15T00:00:00Z',
    yesPercentage: 60,
    noPercentage: 40,
    totalVolume: '25,000 USDC',
    isActive: true,
    comments: [
      {
        id: 'c1',
        user: 'NYCTrumpFan',
        text: 'Please come to NY! We love you!',
        avatar: '/placeholder.svg',
      },
    ],
  },
  {
    id: '3',
    title: 'WILL I ANNOUNCE A NEW POLICY ON IMMIGRATION? THE BORDER IS A MESS!',
    description:
      'The border is a complete DISASTER. I&apos;m considering announcing a new policy that would fix everything immediately. Many people want to hear my plan!',
    creator: 'Trump.fun',
    creatorAvatar: '/trump.jpeg',
    endTime: '2024-05-01T00:00:00Z',
    yesPercentage: 85,
    noPercentage: 15,
    totalVolume: '50,000 USDC',
    isActive: true,
    comments: [
      {
        id: 'c1',
        user: 'BorderPatrol4Trump',
        text: 'We need your leadership on this!',
        avatar: '/placeholder.svg',
      },
      {
        id: 'c2',
        user: 'AmericaFirst2024',
        text: "Can't wait to hear your plan!",
        avatar: '/placeholder.svg',
      },
    ],
  },
];

async function getComments(poolId: string): Promise<Comment[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('pool_id', poolId)
      .order('created_at', { ascending: false });

    return data as Comment[] || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export default async function PoolDetailPage({ params }: { params: { id: string } }) {
  const id = (await params).id;
  const comments = await getComments(id);

  // Find the pool from sample data (in production would come from database)
  const pool = SAMPLE_POOLS.find((p) => p.id === id) || null;
  
  if (!pool) {
    return notFound();
  }

  if (!pool) {
    return (
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <Link
          href='/explore'
          className='text-muted-foreground mb-6 flex items-center'
        >
          <ArrowLeft className='mr-2' size={16} />
          Back to Predictions
        </Link>
        <Card>
          <CardContent className='pt-6'>
            <div className='py-12 text-center'>
              <h2 className='mb-2 text-2xl font-bold'>Pool Not Found</h2>
              <p className='text-muted-foreground'>
                The prediction you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
              <Button className='mt-6' asChild>
                <Link href='/explore'>View All Predictions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

    // Helper function to format time remaining - now on server since we don't need real-time updates
  const formatTimeLeft = () => {
    const end = new Date(pool.endTime).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}d ${hours}h remaining`;
  };

  return (
    <div className='container mx-auto max-w-4xl px-4 py-8'>
      <Link
        href='/explore'
        className='text-muted-foreground mb-6 flex items-center'
      >
        <ArrowLeft className='mr-2' size={16} />
        Back to Predictions
      </Link>

      <Card className='mb-6'>
        <CardHeader className='pb-4'>
          <div className='mb-2 flex items-start justify-between'>
            <div className='flex items-center'>
              <Avatar className='mr-3 h-10 w-10'>
                <AvatarImage src={pool.creatorAvatar} alt={pool.creator} />
                <AvatarFallback>{pool.creator[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-medium'>{pool.creator}</p>
                <p className='text-muted-foreground text-sm'>
                  {new Date(pool.endTime).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge
              variant={pool.isActive ? 'default' : 'secondary'}
              className={pool.isActive ? 'bg-green-500' : ''}
            >
              {pool.isActive ? 'ACTIVE' : 'CLOSED'}
            </Badge>
          </div>
          <CardTitle className='text-2xl font-bold'>{pool.title}</CardTitle>
          <CardDescription className='mt-2 text-base'>
            {pool.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='mb-6'>
            <div className='mb-2 flex justify-between text-sm font-medium'>
              <span>YES {pool.yesPercentage}%</span>
              <span>NO {pool.noPercentage}%</span>
            </div>
            <div className='h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
              <div
                className='h-full bg-orange-600'
                style={{ width: `${pool.yesPercentage}%` }}
              />
            </div>
          </div>

          <div className='mb-6 grid grid-cols-2 gap-4'>
            <div className='bg-muted rounded-lg p-4 text-center'>
              <TrendingUp className='mx-auto mb-2 text-orange-500' size={24} />
              <p className='text-muted-foreground text-sm'>Total Volume</p>
              <p className='font-bold'>{pool.totalVolume}</p>
            </div>
            <div className='bg-muted rounded-lg p-4 text-center'>
              <Clock className='mx-auto mb-2 text-orange-500' size={24} />
              <p className='text-muted-foreground text-sm'>Time Left</p>
              <p className='font-bold'>{formatTimeLeft()}</p>
            </div>
          </div>

          {pool.isActive && (
            <div className='mb-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
              <h3 className='mb-4 text-lg font-bold'>Place Your Bet</h3>
              <div className='mb-4 flex gap-4'>
                <Button
                  className='flex-1 bg-gray-700'
                >
                  YES
                </Button>
                <Button
                  className='flex-1 bg-gray-700'
                >
                  NO
                </Button>
              </div>
            </div>
          )}

          <Tabs defaultValue='comments'>
            <TabsList className='w-full'>
              <TabsTrigger value='comments' className='flex-1'>
                <MessageCircle className='mr-2' size={16} />
                Comments ({comments.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value='comments' className='pt-4'>
              <Suspense fallback={<div className='py-8 text-center'>Loading comments...</div>}>
                <CommentSectionWrapper poolId={id} initialComments={comments} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
