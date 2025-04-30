import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST for login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: 'Missing username or password' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('users');
    
    // Find user by username
    const user = await collection.findOne({ username: body.username });
    
    // For simplicity, we're using a direct password comparison
    // In a real app, you should use bcrypt or another secure password hashing method
    if (!user || user.password !== body.password) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Create a simple token (in a real app, use JWT)
    const token = {
      id: user._id,
      username: user.username,
      role: user.role || 'user',
      // Add an expiration time
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    };
    
    return NextResponse.json({
      message: 'Login successful',
      token: btoa(JSON.stringify(token)), // Simple base64 encoding
      user: {
        id: user._id,
        username: user.username,
        role: user.role || 'user',
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
