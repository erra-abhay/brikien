import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import { Github, Linkedin, Twitter, Globe, Award } from 'lucide-react';
import { IUser } from '@brikien/types';

export const dynamic = 'force-dynamic';

async function getDevelopers() {
  try {
    const res = await api.get('/public/developers');
    return res.data.data;
  } catch (error) {
    return [];
  }
}

export default async function TeamPage() {
  const developers: IUser[] = await getDevelopers();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-widest mb-2">
            The Collective
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight">Our Elite Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            United by a passion for perfection, driven by the desire to build the impossible.
          </p>
        </div>

        {developers.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-muted-foreground">The lab is currently recruiting...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {developers.map((dev) => (
              <div key={dev._id} className="group relative bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2">
                <div className="p-8 pb-32">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-24 h-24 rounded-3xl relative overflow-hidden bg-gray-100 ring-4 ring-white dark:ring-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                      {dev.photo ? (
                        <Image src={getImageUrl(dev.photo)} alt={dev.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50 dark:bg-gray-800 uppercase font-bold text-2xl">
                          {dev.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <Award className="text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" size={24} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-1 tracking-tight">{dev.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wide mb-6">{dev.role}</p>
                  
                  {dev.bio && (
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">
                      {dev.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {dev.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="text-[10px] px-2.5 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 font-bold rounded-lg uppercase tracking-wider">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-0">
                  <div className="flex items-center gap-4 py-6 border-t border-gray-100 dark:border-white/10">
                    {dev.socialLinks?.github && (
                      <a href={dev.socialLinks.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/20 transition-all">
                        <Github size={18} />
                      </a>
                    )}
                    {dev.socialLinks?.linkedin && (
                      <a href={dev.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#0077b5] hover:bg-gray-100 dark:hover:bg-white/20 transition-all">
                        <Linkedin size={18} />
                      </a>
                    )}
                    {dev.socialLinks?.twitter && (
                      <a href={dev.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#1da1f2] hover:bg-gray-100 dark:hover:bg-white/20 transition-all">
                        <Twitter size={18} />
                      </a>
                    )}
                    {dev.socialLinks?.portfolio && (
                      <a href={dev.socialLinks.portfolio} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-gray-100 dark:hover:bg-white/20 transition-all">
                        <Globe size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
