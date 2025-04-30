import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { BlogPost, convertDocToBlogPost } from '@/lib/models';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// GET all posts or filter by status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('posts');

    let query: any = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter by slug if provided
    if (slug) {
      query.slug = slug;
    }

    const posts = await collection.find(query).sort({ publishedAt: -1 }).toArray();

    // Convert MongoDB documents to BlogPost objects
    const formattedPosts = posts.map(convertDocToBlogPost);

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new post object
    const newPost: BlogPost = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || '',
      content: body.content,
      category: body.category,
      accentColor: body.accentColor || '#6C63FF',
      status: body.status || 'draft',
      views: 0,
      createdAt: new Date().toISOString(),
      publishedAt: body.status === 'published' ? new Date().toISOString() : undefined,
      author: body.author || 'Developer',
      tags: body.tags || [body.category],
    };

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('posts');

    const result = await collection.insertOne(newPost);

    return NextResponse.json(
      {
        message: 'Post created successfully',
        id: result.insertedId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
