import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

/**
 * API route to get FACTS data for a pool
 *
 * IMPORTANT: This requires the Supabase 'pool_facts' table to be created with:
 * - id (primary key)
 * - pool_id (string)
 * - user_address (string)
 * - created_at (timestamp)
 *
 * To set up this API route:
 * 1. Create the 'pool_facts' table in Supabase
 * 2. Ensure proper RLS policies are in place
 * 3. The table should allow select, insert, and delete operations
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const poolId = searchParams.get('poolId');
  const userAddress = searchParams.get('address')?.toLowerCase();

  if (!poolId) {
    return Response.json({ error: 'Pool ID is required' }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    // Get total count of FACTS for this pool
    const { count, error: countError } = await supabase
      .from('facts')
      .select('*', { count: 'exact', head: true })
      .eq('pool_id', poolId)
      .is('comment_id', null); // Only count pool FACTS, not comment FACTS

    if (countError) {
      console.error('Error getting pool FACTS count:', countError);
      return Response.json({ error: 'Failed to fetch pool FACTS count' }, { status: 500 });
    }

    // Check if user has already liked this pool
    let userLiked = false;
    if (userAddress) {
      const { data: userFact, error: userError } = await supabase
        .from('facts')
        .select('id')
        .eq('pool_id', poolId)
        .eq('user_id', userAddress)
        .is('comment_id', null)
        .maybeSingle();

      if (userError) {
        console.error('Error checking if user liked pool:', userError);
      } else {
        userLiked = !!userFact;
      }
    }

    return Response.json(
      {
        count: count || 0,
        userLiked,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching pool FACTS:', error);
    return Response.json({ error: 'Failed to fetch pool FACTS' }, { status: 500 });
  }
}
