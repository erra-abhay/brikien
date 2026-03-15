import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Globe, ArrowLeft } from 'lucide-react';
import { IProject } from '@brikien/types';

async function getProject(slug: string) {
  try {
    const res = await api.get(`/public/projects/${slug}`);
    return res.data.data;
  } catch (error) {
    return null;
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project: IProject = await getProject(params.slug);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link href="/projects" className="text-blue-600 hover:underline">Return to projects</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/projects" className="inline-flex items-center text-sm text-gray-500 hover:text-black dark:hover:text-white mb-8 transition">
        <ArrowLeft size={16} className="mr-2" /> Back to projects
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 mt-2">{project.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{project.description}</p>
        
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-500">Status:</span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded uppercase tracking-wider text-xs font-bold">{project.status}</span>
          </div>

          {(project.githubUrl || project.liveUrl) && (
            <div className="flex gap-4">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition">
                  <Github size={18} /> Source Code
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition">
                  <Globe size={18} /> Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {project.featuredImage && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-12 border dark:border-gray-800">
          <Image 
            src={getImageUrl(project.featuredImage)} 
            alt={project.title} 
            fill 
            className="object-cover" 
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: project.content }} />
        </div>
        
        <aside className="space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.developers && project.developers.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-4">Team</h3>
              <div className="space-y-4">
                {project.developers.map((dev: any) => (
                  <div key={dev._id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full relative overflow-hidden bg-gray-100 border">
                      {dev.photo ? (
                        <Image src={getImageUrl(dev.photo)} alt={dev.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{dev.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{dev.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
