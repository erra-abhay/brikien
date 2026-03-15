'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import MessagesTable from '@/components/tables/MessagesTable';
import { IMessage } from '@brikien/types';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res: any = await api.get('/admin/messages');
        setMessages(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/admin/messages/${id}`);
    setMessages(messages.filter(m => m._id !== id));
  };

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      await api.put(`/admin/messages/${id}`, { isRead });
      setMessages(messages.map(m => m._id === id ? { ...m, isRead } : m));
    } catch (e: any) {
      toast.error(e.toString());
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const res = await api.get('/admin/messages/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'messages.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e: any) {
      toast.error('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground">Manage messages from the public website.</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={exporting}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-black hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {exporting ? 'EXPORTING...' : 'EXPORT_CSV'}
        </button>
      </div>

      <MessagesTable data={messages} onDelete={handleDelete} onMarkRead={handleMarkRead} />
    </div>
  );
}
