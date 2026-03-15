'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, Heading2, ImageIcon, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
      CharacterCount,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none min-h-[300px] p-4',
      },
    },
  });

  const uploadImage = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB');
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const res: any = await api.post('/upload/image?category=content', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = getImageUrl(res.data.url);
      editor?.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleImageInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg, image/png, image/webp, image/gif';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        uploadImage(file);
      }
    };
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) {
      return;
    }
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, isActive, disabled, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg hover:bg-muted disabled:opacity-50 transition-all ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card transition-all focus-within:ring-4 ring-primary/5">
      <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-border bg-muted/20">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
          <Strikethrough size={16} />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-2" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')}>
          <Code size={16} />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-2" />
        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
          <LinkIcon size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={handleImageInput} disabled={uploading}>
          <ImageIcon size={16} className={uploading ? 'animate-pulse text-primary' : ''} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="bg-card min-h-[300px] cursor-text" onClick={() => editor.commands.focus()} />
      <div className="px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-t border-border bg-muted/30 text-right">
        {editor.storage.characterCount.characters()} characters
      </div>
    </div>
  );
}
