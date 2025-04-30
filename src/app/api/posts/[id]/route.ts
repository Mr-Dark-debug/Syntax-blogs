import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { convertDocToBlogPost } from '@/lib/models';
import { ObjectId } from 'mongodb';

// GET a single post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('posts');
    
    let post;
    
    // Check if the ID is a valid ObjectId
    if (ObjectId.isValid(id)) {
      post = await collection.findOne({ _id: new ObjectId(id) });
    } else {
      // If not a valid ObjectId, try to find by slug
      post = await collection.findOne({ slug: id });
    }
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(convertDocToBlogPost(post));
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT (update) a post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('posts');
    
    // Check if post exists
    const existingPost = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Update post
    const updatedPost = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || '',
      content: body.content,
      category: body.category,
      accentColor: body.accentColor || '#6C63FF',
      status: body.status || 'draft',
      views: body.views || existingPost.views || 0,
      createdAt: existingPost.createdAt,
      publishedAt: body.status === 'published' && !existingPost.publishedAt 
        ? new Date().toISOString() 
        : existingPost.publishedAt,
      author: body.author || existingPost.author || 'Developer',
      tags: body.tags || [body.category],
    };
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPost }
    );
    
    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('posts');
    
    // Check if post exists
    const existingPost = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // Delete post
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

// PATCH to update post views
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('posts');
    
    let query = {};
    
    // Check if the ID is a valid ObjectId
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      // If not a valid ObjectId, try to find by slug
      query = { slug: id };
    }
    
    // Check if post exists
    const existingPost = await collection.findOne(query);
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // If incrementing views
    if (body.incrementViews) {
      await collection.updateOne(
        query,
        { $inc: { views: 1 } }
      );
      
      return NextResponse.json({ message: 'Post views incremented successfully' });
    }
    
    // For other partial updates
    const updateData: any = {};
    
    if (body.status) updateData.status = body.status;
    if (body.publishedAt) updateData.publishedAt = body.publishedAt;
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    await collection.updateOne(
      query,
      { $set: updateData }
    );
    
    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}
