import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { IBlog } from '@brikien/types';

async function getBlog(slug: string) {
  try {
    const res = await api.get(`/public/blogs/${slug}`);
    return res.data.data;
  } catch (error) {
    return null;
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog: IBlog = await getBlog(params.slug);

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <Link href="/blogs" className="text-blue-600 hover:underline">Return to blogs</Link>
      </div>
    );
  }

  const author = blog.author as any;

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/blogs" className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white mb-8 transition">
        <ArrowLeft size={16} className="mr-2" /> Back to blogs
      </Link>

      <header className="mb-10">
        <div className="flex gap-2 mb-4">
          {blog.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded uppercase tracking-wide font-semibold">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 mt-2 leading-tight">{blog.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{blog.excerpt}</p>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full relative overflow-hidden bg-gray-100 border">
            {author?.photo && (
              <Image src={getImageUrl(author.photo)} alt={author.name} fill className="object-cover" />
            )}
          </div>
          <div>
            <p className="font-bold">{author?.name}</p>
            <p className="text-sm text-gray-500">{format(new Date(blog.createdAt!), 'MMMM d, yyyy')}</p>
          </div>
        </div>
      </header>

      {blog.featuredImage && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-12 border dark:border-gray-800">
          <Image 
            src={getImageUrl(blog.featuredImage)} 
            alt={blog.title} 
            fill 
            className="object-cover" 
          />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-xl">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </article>
  );
}
