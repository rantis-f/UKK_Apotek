"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, PackageX } from "lucide-react";

interface StockItem {
  id: number;
  nama_obat: string;
  stok: number;
  satuan: string;
}

export default function LowStock({ items }: { items: StockItem[] }) {
  return (
    <Card className="shadow-sm border-none bg-white rounded-[1.5rem] overflow-hidden h-full">
      <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-800">
          Stok Habis & Kritis
        </h3>
      </div>

      <div className="p-0">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 uppercase text-[9px] tracking-widest font-black">
            <tr>
              <th className="px-4 py-3">Nama Obat</th>
              <th className="px-4 py-3 text-center">Sisa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items?.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="group hover:bg-red-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-[11px] font-bold text-gray-700 leading-tight">
                      {item.nama_obat}
                    </p>
                    <p className="text-[9px] text-gray-400 font-medium">
                      {item.satuan}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {item.stok === 0 ? (
                        <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[9px] font-black uppercase animate-pulse">
                          <PackageX className="w-2.5 h-2.5" /> Habis
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[9px] font-black">
                          {item.stok} {item.satuan}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-4 py-12 text-center">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    Stok Aman Terkendali
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}