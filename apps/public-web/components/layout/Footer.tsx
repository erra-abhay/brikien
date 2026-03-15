import Link from 'next/link';
import { ISiteConfig } from '@brikien/types';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer({ config }: { config: ISiteConfig | null }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{config?.startupName || 'Brikien Labs'}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
              {config?.tagline || 'Building the future of the web.'}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400">Links</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/" className="hover:text-black dark:hover:text-white">Home</Link></li>
              <li><Link href="/projects" className="hover:text-black dark:hover:text-white">Projects</Link></li>
              <li><Link href="/blogs" className="hover:text-black dark:hover:text-white">Blogs</Link></li>
              <li><Link href="/team" className="hover:text-black dark:hover:text-white">Team</Link></li>
              <li><Link href="/contact" className="hover:text-black dark:hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400">Connect</h4>
            <div className="flex space-x-4 text-gray-500">
              {config?.contact?.socialLinks?.github && (
                <a href={config.contact.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white">
                  <Github size={20} />
                </a>
              )}
              {config?.contact?.socialLinks?.linkedin && (
                <a href={config.contact.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white">
                  <Linkedin size={20} />
                </a>
              )}
              {config?.contact?.socialLinks?.twitter && (
                <a href={config.contact.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-black dark:hover:text-white">
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {year} {config?.startupName || 'Brikien Labs'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
