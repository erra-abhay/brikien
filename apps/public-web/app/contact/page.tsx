'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactMessageSchema } from '@brikien/validators';
import api from '@/lib/api';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send, MessageSquare, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    api.get('/public/site-config').then(res => setConfig(res.data.data)).catch(() => {});
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactMessageSchema)
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await api.post('/public/contact', data);
      toast.success('Message sent! We will get back to you shortly.');
      reset();
    } catch (error: any) {
      toast.error(error.toString() || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-widest">
            <MessageSquare size={14} /> Establish Communication
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter">Initiate Contact</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Ready to transition from concept to production? Our heavy engineering units are standing by.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-black tracking-tight border-b-2 border-gray-100 dark:border-white/10 pb-6 uppercase text-[10px] tracking-[0.3em] text-gray-400">
                Connection Channels
              </h2>
              
              <div className="group flex items-center gap-6 p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-blue-500/30 transition-all duration-500">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Mail size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Direct Secure Line</h3>
                  <p className="text-xl font-bold">{config?.contact?.email || 'hello@brikienlabs.tech'}</p>
                </div>
              </div>

              <div className="group flex items-center gap-6 p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-purple-500/30 transition-all duration-500">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                  <Phone size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Encrypted Voice</h3>
                  <p className="text-xl font-bold">{config?.contact?.phone || '+1 (555) 000-0000'}</p>
                </div>
              </div>

              <div className="group flex items-center gap-6 p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-pink-500/30 transition-all duration-500">
                <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                  <MapPin size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Base of Operations</h3>
                  <p className="text-xl font-bold leading-tight">{config?.contact?.location || '123 Innovation Drive, Tech City, TC 10010'}</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-purple-600 text-white space-y-4 shadow-2xl shadow-blue-500/20">
              <h3 className="text-2xl font-black italic">Lab Operations: 24/7</h3>
              <p className="opacity-80 leading-relaxed">Our autonomous systems and lead engineers are processing requests across all time zones.</p>
              <div className="pt-4 flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                Real-time Response <ArrowRight size={14} className="animate-pulse" />
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="premium-glass p-10 md:p-12 rounded-[3.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
              
              <h2 className="text-4xl font-black tracking-tight mb-10">Broadcast Message</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Identity</label>
                    <input 
                      {...register('name')} 
                      className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-4 ring-blue-500/10 outline-none transition-all"
                      placeholder="Enter Full Name"
                    />
                    {errors.name?.message && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{String(errors.name.message)}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Secure Email</label>
                    <input 
                      {...register('email')} 
                      className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-4 ring-blue-500/10 outline-none transition-all"
                      placeholder="your@engine.id"
                    />
                    {errors.email?.message && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{String(errors.email.message)}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Subject Header</label>
                  <input 
                    {...register('subject')} 
                    className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:ring-4 ring-blue-500/10 outline-none transition-all"
                    placeholder="Brief description of inquiry"
                  />
                  {errors.subject?.message && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{String(errors.subject.message)}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Detailed Payload</label>
                  <textarea 
                    {...register('message')} 
                    className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-3xl px-6 py-4 h-48 resize-none focus:ring-4 ring-blue-500/10 outline-none transition-all"
                    placeholder="Outline your requirements or vision..."
                  />
                  {errors.message?.message && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{String(errors.message.message)}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full group bg-black dark:bg-white text-white dark:text-black rounded-full py-6 font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 dark:shadow-white/5 flex items-center justify-center gap-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Transmit Message <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
