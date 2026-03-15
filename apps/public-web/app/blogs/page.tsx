import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { IBlog } from '@brikien/types';
import { ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getBlogs() {
  try {
    const res = await api.get('/public/blogs');
    return res.data.data;
  } catch (error) {
    return [];
  }
}

export default async function BlogsPage() {
  const blogs: IBlog[] = await getBlogs();

  return (
    <div className="min-h-screen bg-white dark:bg-black py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Engineers Log</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deep dives into architecture, performance, and the future of engineering.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
            <p className="text-muted-foreground">The archives are currently empty.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {blogs.map((blog) => (
              <article key={blog._id} className="group relative grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-3 pt-2">
                  <div className="flex md:flex-col gap-4 items-center md:items-start text-sm border-l-2 border-gray-100 dark:border-white/10 pl-6 group-hover:border-blue-500 transition-colors duration-500">
                    <time className="font-bold text-gray-400 uppercase tracking-widest">{format(new Date(blog.createdAt!), 'MMM d, yyyy')}</time>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 relative grayscale group-hover:grayscale-0 transition-all">
                        {(blog.author as any)?.photo && (
                          <Image src={getImageUrl((blog.author as any).photo)} alt={(blog.author as any).name} fill className="object-cover" />
                        )}
                      </div>
                      <span className="font-semibold text-gray-500">{(blog.author as any)?.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-9 space-y-4">
                  <Link href={`/blogs/${blog.slug}`} className="block group/link">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-3xl font-bold tracking-tight group-hover/link:text-blue-600 transition-colors duration-300">{blog.title}</h2>
                      <ArrowUpRight className="text-gray-300 group-hover/link:text-blue-600 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-all" size={24} />
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed mt-4 line-clamp-2">{blog.excerpt}</p>
                  </Link>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {blog.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-3 py-1 bg-gray-50 dark:bg-white/5 text-gray-400 font-bold rounded-full uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
