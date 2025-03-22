import POINTS_ABI from '@/abi/erc20.json';
import { POINTS_DECIMALS } from '@/consts';
import { POINTS_ADDRESS } from '@/consts/addresses';
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

export type TopUpBalanceParams = {
  walletAddress: string;
};

export type TopUpBalanceResponse = {
  success: boolean;
  transactionHash?: string;
  amountMinted: string;
  rateLimitReset?: string;
  error?: string;
  message?: string;
};

const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  return createClient(supabaseUrl, supabaseKey);
};

const checkRateLimit = async (walletAddress: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  try {
    // Query for the user record
    const { data, error } = await supabase
      .from('user_bonuses')
      .select('id, last_login_bonus')
      .eq('id', walletAddress.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" error
      console.error('Supabase error:', error);
      return true; // Allow the request if Supabase query fails
    }

    if (!data) {
      // No record found, user has never received a bonus
      return true;
    }

    // Check if the last bonus was given within the last 6 hours
    const lastBonus = data.last_login_bonus ? new Date(data.last_login_bonus) : null;
    if (!lastBonus) {
      return true; // No timestamp found, allow the request
    }

    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    return lastBonus < sixHoursAgo; // Allow if last bonus was more than 6 hours ago
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return true; // Allow the request if the check fails
  }
};

// Set rate limit timestamp
const setRateLimit = async (walletAddress: string): Promise<void> => {
  const supabase = getSupabaseClient();
  try {
    // Upsert the record with current timestamp
    const { error } = await supabase.from('user_bonuses').upsert([
      {
        id: walletAddress.toLowerCase(),
        name: '', // Unused as mentioned
        last_login_bonus: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Supabase error when setting rate limit:', error);
    }
  } catch (error) {
    console.error('Error setting rate limit:', error);
  }
};

export async function POST(request: Request) {
  try {
    const body: TopUpBalanceParams = await request.json();

    // Check rate limit
    const isAllowed = await checkRateLimit(body.walletAddress);
    if (!isAllowed) {
      return NextResponse.json<TopUpBalanceResponse>(
        {
          success: false,
          amountMinted: '0',
          rateLimitReset: (Math.floor(Date.now() / 1000) + 6 * 60 * 60).toLocaleString(),
          error: 'You can only request POINTS once every 6 hours',
        },
        { status: 429 }
      );
    }

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
    const privateKey = process.env.MAIN_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Relayer private key not configured');
    }
    const wallet = new ethers.Wallet(privateKey, provider);

    const pointsContract = new ethers.Contract(POINTS_ADDRESS, POINTS_ABI, wallet);
    const balance = await pointsContract.balanceOf(body.walletAddress);
    const targetAmount = BigInt(1000) * BigInt(10) ** BigInt(POINTS_DECIMALS);

    // If balance is less than target, add the difference, otherwise add 0
    const amountToAdd = balance < targetAmount ? targetAmount - balance : BigInt(0);

    if (amountToAdd > 0) {
      const tx = await pointsContract.mint(body.walletAddress, amountToAdd);

      // Set rate limit after successful mint
      await setRateLimit(body.walletAddress);

      // Don't wait for confirmations, just get the response
      return NextResponse.json<TopUpBalanceResponse>({
        success: true,
        transactionHash: tx.hash,
        amountMinted: amountToAdd.toString(),
        rateLimitReset: (Math.floor(Date.now() / 1000) + 6 * 60 * 60).toLocaleString(),
      });
    } else {
      return NextResponse.json<TopUpBalanceResponse>({
        success: true,
        amountMinted: '0',
        message: 'No additional POINTS needed for logged in user',
      });
    }
  } catch (error) {
    console.error('Error in minting points:', error);
    return NextResponse.json<TopUpBalanceResponse>(
      {
        success: false,
        amountMinted: '0',
        error: `Failed to mint testnet points: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
