import { ObjectId } from 'mongodb';

// Blog Post Model
export interface BlogPost {
  _id?: ObjectId | string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: string;
  accentColor?: string;
  status: 'draft' | 'scheduled' | 'published';
  views: number;
  createdAt: string;
  publishedAt?: string;
  author?: string;
  tags?: string[];
}

// Profile Model
export interface Profile {
  _id?: ObjectId | string;
  name: string;
  bio: string;
  description?: string;
  link: string;
  imageUrl: string;
}

// Topic Model
export interface Topic {
  _id?: ObjectId | string;
  id: string;
  name: string;
}

// Convert MongoDB document to BlogPost
export function convertDocToBlogPost(doc: any): BlogPost {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    category: doc.category,
    accentColor: doc.accentColor,
    status: doc.status,
    views: doc.views,
    createdAt: doc.createdAt,
    publishedAt: doc.publishedAt,
    author: doc.author,
    tags: doc.tags || [],
  };
}

// Convert MongoDB document to Profile
export function convertDocToProfile(doc: any): Profile {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    bio: doc.bio,
    description: doc.description,
    link: doc.link,
    imageUrl: doc.imageUrl,
  };
}

// Convert MongoDB document to Topic
export function convertDocToTopic(doc: any): Topic {
  return {
    _id: doc._id.toString(),
    id: doc.id,
    name: doc.name,
  };
}
