import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  const { nftAddress, authorAddress, nftName, message } = await request.json();

  try {
    const { data, error } = await supabase
      .from('nfts')
      .insert([
        { 
          nft_address: nftAddress,
          author_address: authorAddress,
          name: nftName,
          message: message,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to save NFT data' },
      { status: 500 }
    );
  }
}