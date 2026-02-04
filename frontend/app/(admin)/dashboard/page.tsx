"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DollarSign, Users, Package, Activity,
  Loader2, ShieldCheck, LayoutDashboard
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStock from "@/components/dashboard/LowStock";
import { dashboardService } from "@/services/dashboard.service";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { user, token, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => { setIsMounted(true); }, []);

  const userRole = user?.role?.toLowerCase() || user?.jabatan?.toLowerCase();
  const isPowerUser = ["pemilik", "admin"].includes(userRole || "");
  const isStaffInternal = isPowerUser || ["apoteker", "kasir", "karyawan"].includes(userRole || "");

  const fetchDashboardData = useCallback(async () => {
    if (!token || !isStaffInternal) { setDataLoading(false); return; }
    setDataLoading(true);
    try {
      const result = await dashboardService.getStats(token);
      setData(result.data);
    } catch (error: any) {
      toast.error("Gagal sinkronisasi statistik");
    } finally {
      setDataLoading(false);
    }
  }, [token, isStaffInternal]);

  useEffect(() => {
    if (isMounted && !authLoading && token) fetchDashboardData();
  }, [isMounted, authLoading, token, fetchDashboardData]);

  if (!isMounted) return null;

  if (authLoading || (dataLoading && token)) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-gray-400">
        <Loader2 className="h-7 w-7 animate-spin mb-3 text-emerald-600" />
        <p className="font-black text-[8px] uppercase tracking-[0.3em] animate-pulse">Syncing Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-10 px-2 md:px-0">
      <div className="bg-white p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2 md:p-4 rounded-xl md:rounded-2xl text-white shadow-xl shadow-emerald-100 hidden xs:block">
            <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Verified System</span>
            </div>
            <h2 className="text-sm md:text-2xl font-black tracking-tighter text-gray-800 uppercase leading-none">
              {userRole} Overview
            </h2>
            <p className="text-[9px] md:text-sm text-gray-400 font-bold mt-2">
              User: <span className="text-emerald-600">{user?.name?.split(' ')[0]}</span>
            </p>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-2 gap-3 md:gap-6 ${isPowerUser ? 'lg:grid-cols-4' : 'lg:grid-cols-2'}`}>
        <StatsCard
          title={isPowerUser ? "Pendapatan" : "Transaksi"}
          value={isPowerUser ? formatRupiah(data?.cards?.revenue || 0) : data?.cards?.total_sales || 0}
          subValue="Bulan ini"
          icon={isPowerUser ? DollarSign : Activity}
          borderColor="border-l-emerald-500"
          iconColor="text-emerald-500"
        />

        {isPowerUser && (
          <StatsCard
            title="Pelanggan"
            value={data?.cards?.total_customers || 0}
            subValue="Member aktif"
            icon={Users}
            borderColor="border-l-blue-500"
            iconColor="text-blue-500"
          />
        )}

        <StatsCard
          title="Stok Obat"
          value={data?.cards?.total_products || 0}
          subValue={`${data?.alerts?.low_stock_count || 0} kritis`}
          icon={Package}
          borderColor="border-l-orange-500"
          iconColor="text-orange-500"
        />

        <StatsCard
          title={isPowerUser ? "Total Staff" : "Status"}
          value={isPowerUser ? data?.cards?.total_staff || 0 : "Aktif"}
          subValue={isPowerUser ? "Personel" : userRole}
          icon={ShieldCheck}
          borderColor="border-l-indigo-500"
          iconColor="text-indigo-500"
        />
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Transaksi (Lebih Lebar) */}
        <div className="lg:col-span-2">
          <RecentOrders orders={data?.recent_orders || []} />
        </div>

        {/* Kolom Kanan: Stok Habis (Pojok Kanan Bawah) */}
        <div className="h-full">
          <LowStock items={data?.alerts?.low_stock || []} />
        </div>
      </div>
    </div>
  );
}