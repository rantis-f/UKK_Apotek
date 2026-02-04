import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Order {
  id: number;
  total_bayar: number;
  status_order: string;
  pelanggan?: {
    nama_pelanggan: string;
  };
}

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

export default function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <Card className="shadow-sm border-none bg-white rounded-[1.5rem] overflow-hidden">
      <div className="flex flex-row items-center justify-between p-4 md:p-6 border-b border-gray-50">
        <h3 className="text-sm md:text-lg font-black text-gray-800 uppercase tracking-tight">Transaksi Terbaru</h3>
        <Link href="/dashboard/transaksi">
          <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 font-black text-[10px] md:text-xs uppercase">
            Semua <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 uppercase text-[9px] md:text-[10px] tracking-widest font-black">
            <tr>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders?.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] md:text-sm font-bold text-gray-700 leading-tight truncate max-w-[120px] md:max-w-full">
                        {order.pelanggan?.nama_pelanggan || "Umum"}
                      </span>
                      <span className="text-[9px] font-mono text-gray-400 tracking-tighter">#{order.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[11px] md:text-sm font-black text-gray-800">
                      {formatRupiah(order.total_bayar)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-tighter ${order.status_order?.toLowerCase() === 'selesai'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                      }`}>
                      {order.status_order}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  Belum ada transaksi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}