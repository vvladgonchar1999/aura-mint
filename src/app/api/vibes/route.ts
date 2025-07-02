import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { creatorAddress, mintAddress } = await request.json();
    
    if (!creatorAddress || !mintAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('aura-mint');
    
    const vibeData = {
      creatorAddress,
      mintAddress,
      createdAt: new Date(),
    };

    const result = await db.collection('vibes').insertOne(vibeData);

    return NextResponse.json(
      { 
        success: true, 
        vibeId: result.insertedId,
        ...vibeData 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error storing vibe:', error);
    return NextResponse.json(
      { error: 'Failed to store vibe data' },
      { status: 500 }
    );
  }
} 