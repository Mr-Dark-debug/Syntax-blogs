import React, { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { PostsTable } from './PostsTable'
import { PostForm } from './PostForm'
import { StatsSection } from './StatsSection'
import { useLocalStorage } from '../../utils/useLocalStorage'
import { Post, PostStatus } from '../../utils/types'
import { BlogPost } from '@/lib/models'

export const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<string>('overview')
  const [posts, setPosts] = useState<Post[]>([])
  const [localPosts, setLocalPosts] = useLocalStorage<Post[]>('blogPosts', [])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts');

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();

        // Convert API posts to the format expected by the admin dashboard
        const formattedPosts = data.map((post: BlogPost) => ({
          id: post._id as string,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || '',
          content: post.content,
          category: post.category,
          accentColor: post.accentColor || '#6C63FF',
          status: post.status as PostStatus,
          views: post.views,
          createdAt: post.createdAt,
          publishedAt: post.publishedAt,
          author: post.author || 'Developer',
        }));

        setPosts(formattedPosts);

        // Also update localStorage for backward compatibility
        setLocalPosts(formattedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Using local data instead.');

        // Fallback to localStorage
        setPosts(localPosts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [setLocalPosts, localPosts]);

  const handleCreatePost = () => {
    setEditingPost(null)
    setCurrentView('post-form')
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setCurrentView('post-form')
  }

  const handleSavePost = async (post: Post) => {
    try {
      const isNew = !post.id;

      if (isNew) {
        // Create new post via API
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            accentColor: post.accentColor,
            status: post.status,
            author: post.author || 'Developer',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create post');
        }

        const result = await response.json();

        // Fetch the updated post list
        const postsResponse = await fetch('/api/posts');
        const postsData = await postsResponse.json();

        // Convert API posts to the format expected by the admin dashboard
        const formattedPosts = postsData.map((apiPost: BlogPost) => ({
          id: apiPost._id as string,
          title: apiPost.title,
          slug: apiPost.slug,
          excerpt: apiPost.excerpt || '',
          content: apiPost.content,
          category: apiPost.category,
          accentColor: apiPost.accentColor || '#6C63FF',
          status: apiPost.status as PostStatus,
          views: apiPost.views,
          createdAt: apiPost.createdAt,
          publishedAt: apiPost.publishedAt,
          author: apiPost.author || 'Developer',
        }));

        setPosts(formattedPosts);
        setLocalPosts(formattedPosts);
      } else {
        // Update existing post via API
        const response = await fetch(`/api/posts/${post.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            accentColor: post.accentColor,
            status: post.status,
            views: post.views,
            author: post.author || 'Developer',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update post');
        }

        // Update local state
        const updatedPosts = posts.map((p) => (p.id === post.id ? post : p));
        setPosts(updatedPosts);
        setLocalPosts(updatedPosts);
      }

      setCurrentView('posts');
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Failed to save post. Please try again.');

      // Fallback to localStorage
      const isNew = !post.id;
      if (isNew) {
        const newPost = {
          ...post,
          id: Date.now().toString(),
          views: 0,
          createdAt: new Date().toISOString(),
        };
        const updatedPosts = [...posts, newPost];
        setPosts(updatedPosts);
        setLocalPosts(updatedPosts);
      } else {
        const updatedPosts = posts.map((p) => (p.id === post.id ? post : p));
        setPosts(updatedPosts);
        setLocalPosts(updatedPosts);
      }

      setCurrentView('posts');
    }
  }

  const handleDeletePost = async (id: string) => {
    try {
      // Delete post via API
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      // Update local state
      const updatedPosts = posts.filter((post) => post.id !== id);
      setPosts(updatedPosts);
      setLocalPosts(updatedPosts);
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');

      // Fallback to localStorage
      const updatedPosts = posts.filter((post) => post.id !== id);
      setPosts(updatedPosts);
      setLocalPosts(updatedPosts);
    }
  }

  const handlePublishPost = async (id: string) => {
    try {
      // Update post status via API
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: PostStatus.PUBLISHED,
          publishedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish post');
      }

      // Update local state
      const updatedPosts = posts.map((post) =>
        post.id === id
          ? {
              ...post,
              status: PostStatus.PUBLISHED,
              publishedAt: new Date().toISOString(),
            }
          : post
      );
      setPosts(updatedPosts);
      setLocalPosts(updatedPosts);
    } catch (err) {
      console.error('Error publishing post:', err);
      alert('Failed to publish post. Please try again.');

      // Fallback to localStorage
      const updatedPosts = posts.map((post) =>
        post.id === id
          ? {
              ...post,
              status: PostStatus.PUBLISHED,
              publishedAt: new Date().toISOString(),
            }
          : post
      );
      setPosts(updatedPosts);
      setLocalPosts(updatedPosts);
    }
  }

  const renderContent = () => {
    if (isLoading && currentView !== 'post-form') {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        </div>
      );
    }

    if (error && posts.length === 0 && currentView !== 'post-form') {
      return (
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'overview':
        return (
          <>
            <h1 className="text-[#2A2A2A] text-3xl font-bold mb-8">
              Dashboard Overview
            </h1>
            <StatsSection posts={posts} />
            <div className="bg-white border-3 border-[#2A2A2A]/20 rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          </>
        )
      case 'posts':
        return (
          <>
            <h1 className="text-[#2A2A2A] text-3xl font-bold mb-8">
              Blog Posts
            </h1>
            <PostsTable
              posts={posts}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onPublish={handlePublishPost}
            />
          </>
        )
      case 'post-form':
        return (
          <PostForm
            post={editingPost}
            onSave={handleSavePost}
            onCancel={() => setCurrentView('posts')}
          />
        )
      case 'analytics':
        return (
          <>
            <h1 className="text-[#2A2A2A] text-3xl font-bold mb-8">
              Analytics
            </h1>
            <div className="bg-white border-3 border-[#2A2A2A]/20 rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <p className="text-gray-500">Analytics features coming soon...</p>
            </div>
          </>
        )
      case 'settings':
        return (
          <>
            <h1 className="text-[#2A2A2A] text-3xl font-bold mb-8">Settings</h1>
            <div className="bg-white border-3 border-[#2A2A2A]/20 rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <p className="text-gray-500">Settings features coming soon...</p>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa]">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        onCreatePost={handleCreatePost}
      />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  )
}
