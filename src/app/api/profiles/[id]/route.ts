import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { convertDocToProfile } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET a single profile by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('profiles');
    
    const profile = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(convertDocToProfile(profile));
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT (update) a profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.bio || !body.link) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('profiles');
    
    // Check if profile exists
    const existingProfile = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Update profile
    const updatedProfile = {
      name: body.name,
      bio: body.bio,
      description: body.description,
      link: body.link,
      imageUrl: body.imageUrl || existingProfile.imageUrl || '',
    };
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedProfile }
    );
    
    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// DELETE a profile
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('profiles');
    
    // Check if profile exists
    const existingProfile = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Delete profile
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}
