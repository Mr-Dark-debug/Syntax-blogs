"use client";

import React, { useState, useEffect } from 'react';
import { NewBlogsHeader } from './NewBlogsHeader';
import { NewBlogGrid } from './NewBlogGrid';
import { NewTopicFilters } from './NewTopicFilters';
import { NewFollowSection } from './NewFollowSection';
import { useLoader } from '@/context/LoaderContext';

interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  accentColor?: string;
  status?: string;
  publishedAt?: string;
  date?: string;
  views?: number;
}

export function NewBlogsPage() {
  const { startLoading, stopLoading } = useLoader();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load published blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        startLoading('page');

        // Fetch published posts from API
        const response = await fetch('/api/posts?status=published');

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();

        // Format blogs to match our blog structure
        const formattedBlogs = data.map((blog: BlogPost) => ({
          _id: blog._id,
          slug: blog.slug,
          title: blog.title,
          excerpt: blog.excerpt || '',
          category: blog.category,
          accent: blog.accentColor || '#6C63FF',
          date: new Date(blog.publishedAt || blog.createdAt || Date.now()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          views: blog.views || 0
        }));

        setAllBlogs(formattedBlogs);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts');

        // Fallback to localStorage if API fails
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
          try {
            const publishedBlogs = JSON.parse(savedPosts).filter((post: BlogPost & { status?: string }) => post.status === 'published');
            const formattedBlogs = publishedBlogs.map((blog: BlogPost & { status?: string; publishedAt?: string }) => ({
              slug: blog.slug,
              title: blog.title,
              excerpt: blog.excerpt || '',
              category: blog.category,
              accent: blog.accentColor || '',
              date: new Date(blog.publishedAt || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              views: blog.views || 0
            }));

            setAllBlogs(formattedBlogs);
            setError(null);
          } catch (e) {
            console.error('Error parsing blogs from localStorage:', e);
          }
        }
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    };

    fetchBlogs();
  }, [startLoading, stopLoading]);

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <NewBlogsHeader />
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <div className="w-full lg:w-8/12">
          <NewTopicFilters
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border-4 border-black rounded-lg overflow-hidden animate-pulse">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error && allBlogs.length === 0 ? (
            <div className="mt-6 p-6 bg-red-50 border-4 border-red-200 rounded-lg">
              <p className="text-red-500">{error}</p>
              <p className="mt-2">Please try again later or contact support if the problem persists.</p>
            </div>
          ) : (
            <NewBlogGrid
              category={selectedCategory}
              blogs={allBlogs}
            />
          )}
        </div>
        <div className="w-full lg:w-4/12">
          <NewFollowSection />
        </div>
      </div>
    </div>
  );
}
