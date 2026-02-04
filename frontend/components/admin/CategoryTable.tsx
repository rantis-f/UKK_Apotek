"use client";

import { Edit2, Trash2, ImageIcon } from "lucide-react";

interface CategoryTableProps {
  data: any[];
  onEdit: (category: any) => void;
  onDelete: (id: string) => void;
}

export default function CategoryTable({ data, onEdit, onDelete }: CategoryTableProps) {
  const safeData = data || [];

  return (
    <div className="w-full">
      <div className="md:hidden divide-y divide-gray-50">
        {safeData.length > 0 ? (
          safeData.map((cat: any) => (
            <div key={cat.id} className="p-4 flex items-center gap-4 hover:bg-emerald-50/30 active:bg-emerald-50 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center shadow-sm">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.jenis} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight truncate">{cat.jenis}</h4>
                <p className="text-[10px] text-gray-400 font-medium line-clamp-1 mt-0.5">
                  {cat.deskripsi_jenis || "Tanpa deskripsi"}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => onEdit(cat)} 
                  className="p-2.5 bg-blue-50 text-blue-600 rounded-xl active:scale-90 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => onDelete(cat.id)} 
                  className="p-2.5 bg-red-50 text-red-600 rounded-xl active:scale-90 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">Data Kosong</div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-widest font-black border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-center w-24">Foto</th>
              <th className="px-8 py-5">Nama Kategori</th>
              <th className="px-8 py-5">Deskripsi</th>
              <th className="px-8 py-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {safeData.length > 0 ? (
              safeData.map((cat: any) => (
                <tr key={cat.id} className="hover:bg-emerald-50/20 transition-all group">
                  <td className="px-8 py-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shadow-sm mx-auto group-hover:scale-105 transition-transform duration-300">
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.jenis} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="font-bold text-gray-800 text-sm uppercase tracking-tight">{cat.jenis}</span>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-xs text-gray-500 max-w-xs truncate">{cat.deskripsi_jenis || "-"}</p>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(cat)} className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-all active:scale-95"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => onDelete(cat.id)} className="p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-all active:scale-95"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-32 text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Data tidak ditemukan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}