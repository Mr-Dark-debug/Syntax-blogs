import NewBlogPostClient from '@/app/blogs/[slug]/NewBlogPostClient';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Properly await the params object before accessing its properties
  // This follows Next.js's recommendation to avoid the warning
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  return <NewBlogPostClient slug={slug} />;
}

// Include all possible blog slugs for static export
export async function generateStaticParams() {
  try {
    // Fetch published posts from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/posts?status=published`, {
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts for static params');
    }

    const posts = await response.json();

    // Extract slugs from posts
    const slugs = posts.map((post: { slug: string }) => ({
      slug: post.slug,
    }));

    // Add some common variations with trailing characters that might occur
    const variations = slugs.map((item: { slug: string }) => ({
      slug: `${item.slug}-`,
    }));

    // Combine original slugs and variations
    const allSlugs = [...slugs, ...variations];

    // Fallback to default slugs if no posts are found
    if (allSlugs.length === 0) {
      return [
        { slug: 'how-llm-works' },
        { slug: 'neural-network-from-scratch' },
        { slug: 'future-quantum-computing' },
      ];
    }

    return allSlugs;
  } catch (error) {
    console.error('Error generating static params:', error);

    // Fallback to default slugs in case of error
    return [
      { slug: 'how-llm-works' },
      { slug: 'neural-network-from-scratch' },
      { slug: 'future-quantum-computing' },
      { slug: 'react-18-features' },
      { slug: 'ai-ethics' },
      { slug: 'data-science-python' },
    ];
  }
}