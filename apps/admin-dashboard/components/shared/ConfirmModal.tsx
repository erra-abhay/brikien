'use client';

import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm" }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-[2rem] p-8 max-w-md w-full shadow-2xl scale-in-center">
        <h3 className="text-xl font-black mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed font-medium">{message}</p>
        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-3 text-xs font-black uppercase tracking-[0.2em] border border-border rounded-xl hover:bg-muted transition-all"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm}
            className="px-6 py-3 text-xs font-black uppercase tracking-[0.2em] bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
