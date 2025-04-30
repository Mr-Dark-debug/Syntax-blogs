import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Profile, convertDocToProfile } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET all profiles
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('profiles');
    
    const profiles = await collection.find({}).toArray();
    
    // Convert MongoDB documents to Profile objects
    const formattedProfiles = profiles.map(convertDocToProfile);
    
    return NextResponse.json(formattedProfiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

// POST a new profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.bio || !body.link) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a new profile object
    const newProfile: Profile = {
      name: body.name,
      bio: body.bio,
      description: body.description,
      link: body.link,
      imageUrl: body.imageUrl || '',
    };
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('profiles');
    
    const result = await collection.insertOne(newProfile);
    
    return NextResponse.json(
      { 
        message: 'Profile created successfully', 
        id: result.insertedId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}
