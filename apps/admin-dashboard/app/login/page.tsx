'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@brikien/validators';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await login(data);
      toast.success('Logged in successfully');
    } catch (err: any) {
      toast.error(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-10 bg-card border border-border rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full"></div>
        <h1 className="text-3xl font-black text-center mb-10 tracking-tight">Brikien Labs Admin</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Secure Email</label>
            <input 
              {...register('email')} 
              className="w-full bg-background border border-border rounded-2xl px-5 py-3 focus:ring-4 ring-primary/10 outline-none transition-all"
              placeholder="admin@brikienlabs.tech"
            />
            {errors.email?.message && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{String(errors.email.message)}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password Phrase</label>
            <input 
              {...register('password')} 
              type="password"
              className="w-full bg-background border border-border rounded-2xl px-5 py-3 focus:ring-4 ring-primary/10 outline-none transition-all"
            />
            {errors.password?.message && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{String(errors.password.message)}</p>}
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/10 flex items-center justify-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : 'Initiate Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
