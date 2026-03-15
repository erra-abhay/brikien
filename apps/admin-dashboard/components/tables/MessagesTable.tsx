'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { IMessage } from '@brikien/types';
import { Trash, Mail, MailOpen } from 'lucide-react';
import { format } from 'date-fns';
import ConfirmModal from '../shared/ConfirmModal';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface MessagesTableProps {
  data: IMessage[];
  onDelete: (id: string) => Promise<void>;
  onMarkRead: (id: string, isRead: boolean) => Promise<void>;
}

const columnHelper = createColumnHelper<IMessage>();

export default function MessagesTable({ data, onDelete, onMarkRead }: MessagesTableProps) {
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
    columnHelper.accessor('isRead', {
      header: '',
      cell: info => (
        <button 
          onClick={() => onMarkRead(info.row.original._id, !info.getValue())}
          className="text-gray-500 hover:text-black transition"
          title={info.getValue() ? "Mark unread" : "Mark read"}
        >
          {info.getValue() ? <MailOpen size={16} /> : <Mail size={16} className="text-blue-600" />}
        </button>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => <span className={info.row.original.isRead ? "" : "font-bold"}>{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    columnHelper.accessor('subject', {
      header: 'Subject',
      cell: info => <span className={info.row.original.isRead ? "" : "font-bold"}>{info.getValue()}</span>,
    }),
    columnHelper.accessor('message', {
      header: 'Message',
      cell: info => <span className="truncate max-w-[200px] inline-block">{info.getValue()}</span>,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      cell: info => format(new Date(info.getValue()), 'MMM d, yyyy'),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <button 
          onClick={() => setDeleteId(info.row.original._id)}
          className="p-1 hover:bg-red-50 rounded"
        >
          <Trash size={16} className="text-red-500" />
        </button>
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
      <div className="border rounded-md overflow-hidden bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 font-medium text-gray-500">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className={`border-b last:border-0 hover:bg-gray-50 ${row.original.isRead ? 'bg-white' : 'bg-blue-50/30'}`}>
                   {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <ConfirmModal 
        isOpen={!!deleteId}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Delete"
      />
    </>
  );
}
