"use client";

import Link from "next/link";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Eye } from "lucide-react";

export default function ProductCard({ item }: { item: any }) {
  return (
    <div className="group bg-white rounded-[2rem] border border-gray-100 p-4 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-500">
      <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-gray-50 mb-4">
        <img 
          src={item.foto1 || "/default.jpg"} 
          alt={item.nama_obat}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link href={`/obat/${item.id}`}>
            <div className="bg-white p-3 rounded-full shadow-lg hover:bg-emerald-50 text-emerald-600 transition-transform hover:scale-110">
              <Eye className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </div>

      <div className="space-y-2 px-1">
        <Badge variant="outline" className="text-[9px] uppercase font-black tracking-tighter border-emerald-100 text-emerald-600 bg-emerald-50/50">
          {item.jenis_obat?.jenis || "Umum"}
        </Badge>
        <h3 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {item.nama_obat}
        </h3>
        <p className="text-emerald-600 font-black text-base">
          {formatRupiah(item.harga_jual)}
        </p>
        
        <Link href={`/obat/${item.id}`} className="block pt-2">
          <button className="w-full bg-gray-50 text-gray-400 group-hover:bg-emerald-600 group-hover:text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Detail Produk
          </button>
        </Link>
      </div>
    </div>
  );
}