"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Users, Package, Activity,
  Loader2, AlertCircle, ShieldCheck
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStock from "@/components/dashboard/LowStock";

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const isOwner = user?.role === "pemilik";
  const isAdmin = user?.role === "admin";
  const isApoteker = user?.role === "apoteker";
  const isKasir = user?.role === "kasir";
  const isStaff = isOwner || isAdmin || isApoteker || isKasir;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !isStaff) return;

      try {
        const res = await fetch(`${API_URL}/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (error) {
        console.error("Gagal sinkron data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    if (!authLoading && user) fetchDashboardData();
  }, [user, authLoading, isStaff, API_URL, token]);

  if (authLoading || dataLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-emerald-600" />
        <p className="animate-pulse font-medium">Menyiapkan Dashboard {user?.role}...</p>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Akses Terbatas</h2>
        <p className="text-gray-500 max-w-sm mt-2">Maaf, halaman ini hanya dapat diakses oleh Admin dan Staff internal apotek.</p>
        <Button className="mt-6 bg-emerald-600" onClick={() => window.location.href = "/"}>Kembali ke Beranda</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Internal Access</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-800 capitalize">
            Dashboard {user?.role}
          </h2>
          <p className="text-gray-500 font-medium">Selamat bekerja, {user?.name}. Berikut ringkasan hari ini.</p>
        </div>
        {(isOwner || isAdmin) && (
          <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md font-bold">Download Laporan Bulanan</Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(isOwner || isAdmin) ? (
          <StatsCard
            title="Total Pendapatan"
            value={formatRupiah(data?.cards?.revenue || 0)}
            subValue="Status: Selesai"
            icon={DollarSign}
            borderColor="border-l-emerald-500"
            iconColor="text-emerald-500"
          />
        ) : (
          <StatsCard
            title="Total Transaksi"
            value={data?.cards?.total_sales || 0}
            subValue="Hari ini"
            icon={Activity}
            borderColor="border-l-emerald-500"
            iconColor="text-emerald-500"
          />
        )}

        {(isOwner || isAdmin) && (
          <StatsCard
            title="Total Pelanggan"
            value={data?.cards?.total_customers || 0}
            subValue="Member terdaftar"
            icon={Users}
            borderColor="border-l-blue-500"
            iconColor="text-blue-500"
          />
        )}

        <StatsCard
          title="Jenis Obat"
          value={data?.cards?.total_products || 0}
          subValue={`${data?.alerts?.low_stock?.length || 0} item stok kritis`}
          icon={Package}
          borderColor="border-l-orange-500"
          iconColor="text-orange-500"
        />

        {(isOwner || isAdmin) && (
          <StatsCard
            title="Total Staff"
            value={data?.cards?.total_staff || 0}
            subValue="Personel aktif"
            icon={ShieldCheck}
            borderColor="border-l-indigo-500"
            iconColor="text-indigo-500"
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders orders={data?.recent_orders} />
        </div>
        <div className="h-full">
          <LowStock items={data?.alerts?.low_stock} />
        </div>
      </div>
    </div>
  );
}