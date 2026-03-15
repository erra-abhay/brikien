import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Code, Zap, Globe } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getSiteConfig() {
  try {
    const res = await api.get('/public/site-config');
    return res.data.data;
  } catch (error) {
    return null;
  }
}

export default async function Home() {
  const config = await getSiteConfig();

  if (!config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Orchestrating Experience...</p>
      </div>
    );
  }

  const { hero, about, startupName, tagline } = config;

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-black text-white">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          {hero?.backgroundImage && (
            <Image 
              src={getImageUrl(hero.backgroundImage)} 
              alt="Hero Background" 
              fill 
              className="object-cover opacity-20 scale-110 animate-subtle-zoom"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Accelerating Digital Evolution
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none animate-slide-up">
            {startupName}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 py-4">
              Next-Gen Labs
            </span>
          </h1>

          <p className="text-xl md:text-2xl font-light text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-in-delayed">
            {tagline}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-12 animate-fade-in-delayed-2">
            <Link 
              href="/projects"
              className="group px-10 py-5 bg-white text-black font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Explore Portfolio <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact"
              className="px-10 py-5 border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all flex items-center justify-center"
            >
              Start a Project
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Featured Capabilities */}
      <section className="py-32 bg-white dark:bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 space-y-4 hover:shadow-2xl transition-all duration-500 group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Code size={28} />
              </div>
              <h3 className="text-2xl font-bold">Engineering Excellence</h3>
              <p className="text-muted-foreground leading-relaxed">We write precise, performant code that defines the industry standard for modern web applications.</p>
            </div>
            <div className="p-8 rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 space-y-4 hover:shadow-2xl transition-all duration-500 group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold">Rapid Innovation</h3>
              <p className="text-muted-foreground leading-relaxed">Turn concepts into production-ready products at lightning speed with our agile development flow.</p>
            </div>
            <div className="p-8 rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 space-y-4 hover:shadow-2xl transition-all duration-500 group">
              <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-bold">Global Scale</h3>
              <p className="text-muted-foreground leading-relaxed">Architecture designed from day one to handle global traffic and enterprise-level complexity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-4 bg-gray-50 dark:bg-[#0c0c0e]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
             <Image 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070" 
              alt="Lab" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">{about?.heading || 'About the Lab'}</h2>
            <div 
              className="prose prose-lg dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: about?.content || '<p>Welcome to Brikien Labs.</p>' }}
            />
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200 dark:border-white/10">
              <div>
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">Deployments</div>
              </div>
              <div>
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest mt-1">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
