"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp 
} from "lucide-react";

// --- 1. STRUKTUR DATA (Backend-Ready) ---
interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    cards: {
      revenue: number;
      total_sales: number;
      total_users: number;
      total_products: number;
    };
    alerts: {
      low_stock: { 
        id: number; 
        nama_obat: string; 
        stok: number;
      }[];
    };
    recent_orders: any[];
    chart_data: { 
      tgl_penjualan: string; 
      total_bayar: number; 
    }[];
  }
}

export default function DashboardPage() {
  
  // --- 2. DUMMY DATA ---
  const [dashboardData] = useState<DashboardResponse>({
    success: true,
    message: "Data dummy",
    data: {
      cards: {
        revenue: 15450000,
        total_sales: 42,
        total_users: 12,
        total_products: 150
      },
      alerts: {
        low_stock: [
          { id: 1, nama_obat: "Paracetamol 500mg", stok: 5 },
          { id: 2, nama_obat: "Amoxicillin Sirup", stok: 2 },
          { id: 3, nama_obat: "Betadine 30ml", stok: 0 }
        ]
      },
      recent_orders: [],
      chart_data: [
        { tgl_penjualan: "2024-01-20", total_bayar: 1200000 },
        { tgl_penjualan: "2024-01-21", total_bayar: 2500000 },
        { tgl_penjualan: "2024-01-22", total_bayar: 1800000 },
        { tgl_penjualan: "2024-01-23", total_bayar: 3200000 },
        { tgl_penjualan: "2024-01-24", total_bayar: 2100000 },
        { tgl_penjualan: "2024-01-25", total_bayar: 4500000 },
        { tgl_penjualan: "2024-01-26", total_bayar: 3800000 },
      ]
    }
  });

  const loading = false;
  const { data } = dashboardData; 

  // Fungsi Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Fungsi Format Tanggal (FIXED: Pakai 'any' biar Recharts aman saat build)
  const formatTanggal = (value: any) => {
    const date = new Date(value);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-800">Dashboard</h2>
        <p className="text-gray-500">Ringkasan performa apotek hari ini.</p>
      </div>

      {/* KARTU STATISTIK */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Omset */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Omset</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatRupiah(data.cards.revenue)} 
            </div>
            <p className="text-xs text-muted-foreground">Total pendapatan masuk</p>
          </CardContent>
        </Card>

        {/* Transaksi */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaksi</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {data.cards.total_sales} 
            </div>
            <p className="text-xs text-muted-foreground">Transaksi berhasil</p>
          </CardContent>
        </Card>

        {/* Obat */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Obat</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {data.cards.total_products} 
            </div>
            <p className="text-xs text-muted-foreground">Jenis obat terdaftar</p>
          </CardContent>
        </Card>

        {/* Pelanggan */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.cards.total_users} 
            </div>
            <p className="text-xs text-muted-foreground">User aktif terdaftar</p>
          </CardContent>
        </Card>
      </div>

      {/* GRAFIK & WARNING */}
      <div className="grid gap-6 md:grid-cols-7">
        
        {/* GRAFIK */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-500"/>
              Grafik Penjualan (7 Hari)
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={data.chart_data} 
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="tgl_penjualan" 
                    tickFormatter={formatTanggal} 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `Rp${value / 1000}k`} 
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    labelFormatter={formatTanggal}
                  />
                  <Bar dataKey="total_bayar" fill="oklch(0.546 0.245 262.88)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* WARNING STOK */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Peringatan Stok Menipis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.alerts.low_stock.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Stok aman semua</p>
              ) : (
                data.alerts.low_stock.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-sm font-medium text-gray-700">{item.nama_obat}</p>
                    </div>
                    <div className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                      Sisa: {item.stok}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}