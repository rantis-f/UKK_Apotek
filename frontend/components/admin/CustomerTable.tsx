"use client";

import { UserCircle, Phone, Mail, ChevronRight } from "lucide-react";
import CustomerRow from "./CustomerRow";

interface CustomerTableProps {
  data: any[];
  onView: (customer: any) => void;
  onDelete: (id: string) => void;
}

export default function CustomerTable({ data, onView, onDelete }: CustomerTableProps) {
  const safeData = data || [];

  return (
    <div className="w-full">
      <div className="md:hidden divide-y divide-gray-50">
        {safeData.length > 0 ? (
          safeData.map((customer) => (
            <div
              key={customer.id}
              onClick={() => onView(customer)}
              className="p-5 flex items-center justify-between active:bg-emerald-50/50 transition-all group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <UserCircle size={28} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-gray-800 text-sm uppercase tracking-tight truncate">
                    {customer.nama_pelanggan}
                  </h4>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <Phone size={10} className="text-emerald-500" /> {customer.no_telp || "-"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 truncate">
                      <Mail size={10} /> {customer.email || "-"}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-active:translate-x-1 transition-transform" />
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">Database Kosong</div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="px-8 py-6">Info Pelanggan</th>
              <th className="px-8 py-6">Kontak</th>
              <th className="px-8 py-6">Lokasi Utama</th>
              <th className="px-8 py-6 text-center">Status</th>
              <th className="px-8 py-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {safeData.map((customer) => (
              <CustomerRow
                key={customer.id.toString()}
                customer={customer}
                onView={onView}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}