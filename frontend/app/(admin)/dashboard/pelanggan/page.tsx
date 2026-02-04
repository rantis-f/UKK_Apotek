"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Users, Search, RefreshCw, Loader2,
  UserX, Phone, Mail, ChevronRight, UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

import CustomerTable from "@/components/admin/CustomerTable";
import CustomerDetailModal from "@/components/admin/CustomerDetailModal";

export default function ManajemenPelangganPage() {
  const { token } = useAuth();

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const fetchCustomers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pelanggan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await response.json();
      setCustomers(res.data || []);
    } catch (error: any) {
      toast.error("Gagal sinkron data pelanggan");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isMounted) fetchCustomers();
  }, [isMounted, fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    const list = Array.isArray(customers) ? customers : [];
    return list.filter((c: any) =>
      c.nama_pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.no_telp?.includes(searchQuery)
    );
  }, [customers, searchQuery]);

  const handleViewDetail = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    toast.info("Fitur hapus pelanggan sedang dikembangkan");
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 pb-24 px-1 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-emerald-600 p-2.5 md:p-3 rounded-xl md:rounded-2xl text-white shadow-lg shadow-blue-100">
            <Users className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-sm md:text-2xl font-black text-gray-800 uppercase tracking-tight leading-none">Database Member</h1>
            <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">
              {customers.length} Pelanggan Terdaftar
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={fetchCustomers}
          disabled={loading}
          className="rounded-xl md:rounded-2xl border-2 border-gray-50 hover:bg-blue-50 transition-all font-black h-11 text-[10px] uppercase tracking-widest"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Cari nama, email, atau telepon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 h-12 bg-white border-none rounded-xl md:rounded-[1.5rem] focus:ring-2 focus:ring-blue-500/10 outline-none transition-all shadow-sm font-medium text-sm"
        />
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 className="animate-spin text-blue-600 h-8 w-8 mb-4" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">Syncing Database...</p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <>
            <div className="md:hidden divide-y divide-gray-50">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleViewDetail(customer)}
                  className="p-4 flex items-center justify-between active:bg-blue-50/50 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-400 shrink-0">
                      <UserCircle size={24} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 text-sm truncate uppercase tracking-tight">
                        {customer.nama_pelanggan}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-gray-400 flex items-center gap-1 font-medium">
                          <Phone size={10} /> {customer.no_telp || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 ml-2 shrink-0" />
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <CustomerTable
                data={filteredCustomers}
                onView={handleViewDetail}
                onDelete={handleDelete}
              />
            </div>
          </>
        ) : (
          <div className="py-24 text-center flex flex-col items-center">
            <UserX className="w-12 h-12 text-gray-100 mb-3" />
            <h3 className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Pelanggan Tidak Ditemukan</h3>
          </div>
        )}
      </div>

      <CustomerDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
      />

    </div>
  );
}