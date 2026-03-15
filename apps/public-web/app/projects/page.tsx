import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { IProject } from '@brikien/types';
import { ExternalLink, Layers, Terminal } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getProjects() {
  try {
    const res = await api.get('/public/projects');
    return res.data.data;
  } catch (error) {
    return [];
  }
}

export default async function ProjectsPage() {
  const projects: IProject[] = await getProjects();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-widest">
            <Terminal size={14} /> The Prototype Gallery
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">System Architectures</h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            A curated showcase of high-performance digital solutions designed and engineered at Brikien Labs.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-white/10">
            <Layers className="mx-auto text-gray-300 dark:text-gray-700 mb-6" size={64} />
            <p className="text-muted-foreground text-lg">Inventory under preparation...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link key={project._id} href={`/projects/${project.slug}`} className="group relative block">
                <div className="relative bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] group-hover:-translate-y-2">
                  <div className="relative h-[280px] w-full overflow-hidden">
                    {project.featuredImage ? (
                      <Image 
                        src={getImageUrl(project.featuredImage)} 
                        alt={project.title} 
                        fill 
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <Terminal size={60} className="text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1.5 rounded-full glass-panel dark:bg-white/10 text-[9px] font-black uppercase tracking-widest text-white border-white/20">
                        {project.status}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-white tracking-tight leading-none group-hover:text-blue-400 transition-colors">
                            {project.title}
                          </h3>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 transform group-hover:rotate-12">
                          <ExternalLink size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="text-[8px] px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold rounded-md uppercase border border-gray-200/50 dark:border-white/5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
