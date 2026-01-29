import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="shadow-sm border-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-bold text-gray-800">Transaksi Terbaru</CardTitle>
        <Link href="/dashboard/transaksi">
          <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Lihat Semua <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Pelanggan</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders?.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-400 text-xs">#{order.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">
                      {order.pelanggan?.nama_pelanggan || "Umum"}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">
                      {formatRupiah(order.total_bayar)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status_order === 'Selesai' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status_order}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    Belum ada data transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}