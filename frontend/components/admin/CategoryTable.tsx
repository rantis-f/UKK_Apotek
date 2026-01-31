"use client";

import { Pencil, Trash2, Tag, Inbox } from "lucide-react";

interface Category {
  id: string;
  jenis: string;
  deskripsi_jenis: string;
}

interface CategoryTableProps {
  data: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export default function CategoryTable({ data = [], onEdit, onDelete }: CategoryTableProps) {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Nama Kategori</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Deskripsi</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {hasData ? (
            data.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="font-medium text-gray-800">{cat.jenis}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 italic max-w-xs truncate">
                  {cat.deskripsi_jenis || "-"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => onEdit(cat)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(cat.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                <div className="flex flex-col items-center gap-2">
                  <Inbox className="w-10 h-10 opacity-20" />
                  <p className="text-sm italic">Belum ada kategori obat...</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}