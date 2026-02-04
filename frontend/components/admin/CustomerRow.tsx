"use client";

import { Mail, Phone, MapPin, ShieldCheck, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerRowProps {
  customer: any;
  onView: (customer: any) => void;
  onDelete: (id: string) => void;
}

export default function CustomerRow({ customer, onView, onDelete }: CustomerRowProps) {
  const initial = customer.nama_pelanggan ? customer.nama_pelanggan.charAt(0).toUpperCase() : "?";

  return (
    <tr className="hover:bg-emerald-50/20 transition-all group border-b border-gray-50/50 last:border-none">
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-100 overflow-hidden flex items-center justify-center text-emerald-600 font-black shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            {customer.foto ? (
              <img src={customer.foto} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg">{initial}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <p className="font-black text-gray-800 text-sm uppercase tracking-tight truncate">
              {customer.nama_pelanggan}
            </p>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">
              ID: <span className="text-emerald-600/60">#{customer.id.toString().slice(-5)}</span>
            </p>
          </div>
        </div>
      </td>

      <td className="px-8 py-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
            <div className="w-5 h-5 rounded-lg bg-gray-50 flex items-center justify-center">
              <Phone className="w-3 h-3 text-emerald-500" />
            </div>
            {customer.no_telp || "-"}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400">
            <div className="w-5 h-5 rounded-lg bg-gray-50 flex items-center justify-center">
              <Mail className="w-3 h-3 text-gray-300" />
            </div>
            {customer.email || "-"}
          </div>
        </div>
      </td>

      <td className="px-8 py-5">
        <div className="flex items-start gap-2 max-w-55">
          <MapPin className="w-3.5 h-3.5 text-emerald-300 mt-0.5 shrink-0" />
          <span className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 italic font-medium">
            {customer.alamat1 ? `${customer.alamat1}, ${customer.kota1}` : "Alamat belum diatur"}
          </span>
        </div>
      </td>

      <td className="px-8 py-5 text-center">
        {customer.url_ktp ? (
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border border-emerald-100 tracking-tighter shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
          </div>
        ) : (
          <span className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest opacity-50">
            No Identity
          </span>
        )}
      </td>

      <td className="px-8 py-5 text-right">
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => onView(customer)}
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-xl transition-all active:scale-90"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(customer.id.toString())}
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all active:scale-90"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}