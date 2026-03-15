'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { IUser } from '@brikien/types';
import Link from 'next/link';
import { Edit, Trash } from 'lucide-react';
import ConfirmModal from '../shared/ConfirmModal';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';

interface DevelopersTableProps {
  data: IUser[];
  onDelete: (id: string) => Promise<void>;
  editPrefix: string;
}

const columnHelper = createColumnHelper<IUser>();

export default function DevelopersTable({ data, onDelete, editPrefix }: DevelopersTableProps) {
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
    columnHelper.accessor('photo', {
      header: 'Photo',
      cell: info => (
        <div className="w-8 h-8 rounded-full overflow-hidden relative bg-gray-100 border">
          {info.getValue() && <Image src={getImageUrl(info.getValue())} alt="" fill className="object-cover" />}
        </div>
      )
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: info => <span className="capitalize">{info.getValue()}</span>,
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
                <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50">
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
                  No developers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <ConfirmModal 
        isOpen={!!deleteId}
        title="Deactivate Developer"
        message="Are you sure you want to soft delete this developer? This will prevent them from logging in."
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Deactivate"
      />
    </>
  );
}
