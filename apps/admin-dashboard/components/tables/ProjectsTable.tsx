'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { IProject } from '@brikien/types';
import StatusBadge from '../shared/StatusBadge';
import Link from 'next/link';
import { Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import ConfirmModal from '../shared/ConfirmModal';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ProjectsTableProps {
  data: IProject[];
  onDelete: (id: string) => Promise<void>;
  editPrefix: string;
}

const columnHelper = createColumnHelper<IProject>();

export default function ProjectsTable({ data, onDelete, editPrefix }: ProjectsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await onDelete(deleteId);
      } catch (e: any) {
        toast.error(e.toString());
      }
      setDeleteId(null);
    }
  };

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: info => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => <StatusBadge status={info.getValue() as 'completed' | 'in-progress' | 'upcoming'} />,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      cell: info => format(new Date(info.getValue()), 'MMM d, yyyy'),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex items-center gap-2">
          <Link href={`${editPrefix}/${info.row.original._id}/edit`} className="p-1 hover:bg-gray-100 rounded">
            <Edit size={16} className="text-gray-600" />
          </Link>
          <button 
            onClick={() => setDeleteId(info.row.original._id)}
            className="p-1 hover:bg-red-50 rounded"
          >
            <Trash size={16} className="text-red-500" />
          </button>
        </div>
      ),
    })
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="border border-border rounded-2xl overflow-hidden bg-card/30 backdrop-blur-xl shadow-2xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b border-border">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-4 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="transition-colors hover:bg-muted/20">
                   {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 italic">
                  No active projects found in registry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <ConfirmModal 
        isOpen={!!deleteId}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </>
  );
}
