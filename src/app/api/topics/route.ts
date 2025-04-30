import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Topic, convertDocToTopic } from '@/lib/models';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// GET all topics
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('topics');

    const topics = await collection.find({}).toArray();

    // Convert MongoDB documents to Topic objects
    const formattedTopics = topics.map(convertDocToTopic);

    return NextResponse.json(formattedTopics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}

// POST a new topic
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new topic object
    const newTopic: Topic = {
      id: body.id,
      name: body.name,
    };

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('topics');

    // Check if topic with same ID already exists
    const existingTopic = await collection.findOne({ id: body.id });

    if (existingTopic) {
      return NextResponse.json(
        { error: 'Topic with this ID already exists' },
        { status: 409 }
      );
    }

    const result = await collection.insertOne(newTopic);

    return NextResponse.json(
      {
        message: 'Topic created successfully',
        id: result.insertedId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    );
  }
}
