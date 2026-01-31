"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Users, Package, Activity,
  Loader2, AlertCircle, ShieldCheck, RefreshCcw
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStock from "@/components/dashboard/LowStock";
import { dashboardService } from "@/services/dashboard.service";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // FIX: Gunakan toLowerCase() agar pengecekan role admin/pemilik lebih akurat
  const userRole = user?.role?.toLowerCase();
  const isOwner = userRole === "pemilik";
  const isAdmin = userRole === "admin";
  const isPowerUser = isOwner || isAdmin; // Admin & Owner bisa lihat statistik sensitif
  
  const isStaffInternal = isPowerUser || userRole === "apoteker" || userRole === "kasir";

  const fetchDashboardData = useCallback(async () => {
    if (!token || !isStaffInternal) return;
    
    setDataLoading(true);
    try {
      const result = await dashboardService.getStats(token);
      setData(result);
    } catch (error: any) {
      toast.error(error.message);
      setData(null);
    } finally {
      setDataLoading(false);
    }
  }, [token, isStaffInternal]);

  useEffect(() => {
    if (!authLoading && user) fetchDashboardData();
  }, [user, authLoading, fetchDashboardData]);

  // STATE: LOADING
  if (authLoading || dataLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-gray-400">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-emerald-600" />
        <p className="animate-pulse font-medium">Sinkronisasi Dashboard {user?.role}...</p>
      </div>
    );
  }

  // STATE: NO ACCESS
  if (!isStaffInternal) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Akses Terbatas</h2>
        <Button className="mt-6 bg-emerald-600" onClick={() => window.location.href = "/"}>Kembali</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Terverifikasi</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-800 capitalize">
            Dashboard {user?.role}
          </h2>
          <p className="text-gray-500">Selamat bekerja, {user?.name}.</p>
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className={`grid gap-4 md:grid-cols-2 ${isPowerUser ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`}>
        
        {/* KARTU 1: PENDAPATAN / TRANSAKSI */}
        {isPowerUser ? (
          <StatsCard
            title="Total Pendapatan"
            value={formatRupiah(data?.cards?.revenue)}
            subValue="Bulan ini"
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

        {/* KARTU 2: PELANGGAN (HANYA OWNER/ADMIN) */}
        {isPowerUser && (
          <StatsCard
            title="Total Pelanggan"
            value={data?.cards?.total_customers || 0}
            subValue="Member aktif"
            icon={Users}
            borderColor="border-l-blue-500"
            iconColor="text-blue-500"
          />
        )}

        {/* KARTU 3: STOK OBAT (SEMUA STAFF) */}
        <StatsCard
          title="Data Obat"
          value={data?.cards?.total_products || 0}
          subValue={`${data?.alerts?.low_stock?.length || 0} stok kritis`}
          icon={Package}
          borderColor="border-l-orange-500"
          iconColor="text-orange-500"
        />

        {/* KARTU 4: TOTAL AKUN / STAFF (FIXED LOGIC) */}
        {isPowerUser ? (
          <StatsCard
            title="Total Staff"
            value={data?.cards?.total_staff || 0} // Data dari User::count() di Laravel
            subValue="Personel terdaftar"
            icon={Users}
            borderColor="border-l-indigo-500"
            iconColor="text-indigo-500"
          />
        ) : (
          <StatsCard
            title="Status Akun"
            value="Aktif"
            subValue={`Role: ${user?.role}`}
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