"use client";

import { Edit3, Trash2, Mail, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserTableProps {
  data: any[];
  onEdit: (u: any) => void;
  onDelete: (id: string) => void;
}

export default function UserTable({ data, onEdit, onDelete }: UserTableProps) {

  const getRoleStyle = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-red-50 text-red-600 border-red-100';
      case 'pemilik': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'apoteker': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'kasir': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const safeData = data || [];

  return (
    <div className="w-full">
      <div className="md:hidden divide-y divide-gray-50">
        {safeData.length > 0 ? (
          safeData.map((user) => (
            <div key={user.id} className="p-5 space-y-4 active:bg-emerald-50/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm font-black border border-emerald-100">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-black text-gray-800 text-sm uppercase tracking-tight truncate">{user.name}</span>
                    <span className="text-[10px] text-gray-400 font-medium lowercase flex items-center gap-1">
                      <Mail className="w-2.5 h-2.5 text-emerald-500" /> {user.email}
                    </span>
                  </div>
                </div>
                <span className={cn("px-2.5 py-1 rounded-lg text-[8px] font-black uppercase border tracking-widest", getRoleStyle(user.jabatan))}>
                  {user.jabatan}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => onEdit(user)}
                  className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 border-none h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-100"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit Staff
                </Button>
                <Button
                  onClick={() => onDelete(user.id)}
                  variant="ghost"
                  className="h-10 w-12 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">Data Staff Kosong</div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="px-8 py-6">Nama Staff</th>
              <th className="px-8 py-6">Email & Akses</th>
              <th className="px-8 py-6 text-center">Jabatan</th>
              <th className="px-8 py-6 text-right">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {safeData.map((user) => (
              <tr key={user.id} className="hover:bg-emerald-50/20 transition-all group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm border border-emerald-100">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm uppercase tracking-tight leading-tight">{user.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold tracking-tighter mt-0.5">UID: #{user.id.toString().slice(-4)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {user.email}
                  </div>
                </td>
                <td className="px-8 py-4 text-center">
                  <span className={cn("px-4 py-1.5 rounded-xl text-[9px] font-black uppercase border tracking-widest shadow-sm", getRoleStyle(user.jabatan))}>
                    {user.jabatan}
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => onEdit(user)}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all active:scale-90"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onDelete(user.id)}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}