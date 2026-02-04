"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  Truck, Plus, Search, Loader2, Trash2, 
  PackageSearch, Phone, MapPin, Edit3, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; 
import { toast } from "sonner";
import { distributorService } from "@/services/distributor.service";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import DistributorTable from "@/components/admin/DistributorTable";
import DistributorForm from "@/components/admin/DistributorForm";

export default function ManajemenDistributorPage() {
  const { token } = useAuth();
  
  const [distributors, setDistributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchDistributors = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await distributorService.getAll(token); 
      setDistributors(res.data || []); 
    } catch (error: any) {
      toast.error("Gagal memuat data vendor");
      setDistributors([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchDistributors(); }, [fetchDistributors]);

  const filteredDistributors = useMemo(() => {
    const list = Array.isArray(distributors) ? distributors : [];
    return list.filter((d: any) => 
      d.nama_distributor.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.telepon?.includes(searchQuery) ||
      d.alamat?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [distributors, searchQuery]);

  const handleSave = async (data: any) => {
    if (!token) return;
    try {
      if (selectedDistributor) {
        await distributorService.update(token, selectedDistributor.id, data);
        toast.success("Informasi vendor diperbarui");
      } else {
        await distributorService.create(token, data);
        toast.success("Vendor PBF berhasil didaftarkan");
      }
      setIsModalOpen(false);
      fetchDistributors();
    } catch (error: any) {
      toast.error("Gagal menyimpan data");
    }
  };

  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete || !token) return;
    setDeleteLoading(true);
    try {
      await distributorService.delete(token, idToDelete);
      toast.success("Vendor berhasil dihapus");
      fetchDistributors();
    } catch (error: any) {
      toast.error("Gagal menghapus data");
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setIdToDelete(null);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 pb-24 px-1 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
          <div className="bg-emerald-600 p-2.5 md:p-3 rounded-xl md:rounded-2xl text-white shadow-lg shadow-emerald-100">
            <Truck className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-sm md:text-2xl font-black text-gray-800 uppercase tracking-tight leading-none">Vendor PBF</h1>
            <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">
              {distributors.length} Distributor Terdata
            </p>
          </div>
        </div>
        <Button 
          onClick={() => { setSelectedDistributor(null); setIsModalOpen(true); }} 
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 rounded-xl md:rounded-2xl font-black h-11 md:h-12 px-8 shadow-xl shadow-emerald-100 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 mr-1 md:mr-2" /> DAFTARKAN PBF
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Cari nama, telepon, atau alamat..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 h-12 bg-white border-none rounded-xl md:rounded-[1.5rem] focus:ring-2 focus:ring-emerald-500/10 shadow-sm font-medium text-sm transition-all outline-none"
        />
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <Loader2 className="animate-spin text-emerald-600 h-8 w-8 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing Vendor Data...</p>
        </div>
      ) : filteredDistributors.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredDistributors.map((d) => (
              <div key={d.id} className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm space-y-3 relative overflow-hidden group active:bg-emerald-50/30 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-tight truncate">{d.nama_distributor}</h3>
                    <div className="flex items-center text-[10px] text-emerald-600 font-bold mt-1">
                      <Phone className="w-3 h-3 mr-1" /> {d.telepon || "-"}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button onClick={() => { setSelectedDistributor(d); setIsModalOpen(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDeleteClick(d.id)} className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 text-[10px] text-gray-400 bg-gray-50 p-2 rounded-lg">
                  <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                  <p className="line-clamp-2">{d.alamat || "Alamat belum diatur"}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
            <DistributorTable 
              data={filteredDistributors} 
              onEdit={(d: any) => { setSelectedDistributor(d); setIsModalOpen(true); }} 
              onDelete={handleDeleteClick} 
            />
          </div>
        </>
      ) : (
        <div className="py-20 text-center flex flex-col items-center bg-white rounded-[2rem] border border-dashed border-gray-200">
          <PackageSearch className="w-12 h-12 text-gray-100 mb-3" />
          <h3 className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Vendor Tidak Ditemukan</h3>
        </div>
      )}

      <DistributorForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSave} initialData={selectedDistributor} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[92vw] max-w-sm rounded-[2.5rem] border-none p-6 md:p-8 shadow-2xl">
          <AlertDialogHeader>
            <div className="mx-auto bg-red-50 w-14 h-14 rounded-full flex items-center justify-center mb-4 text-red-600 ring-8 ring-red-50/50">
               <Trash2 className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="font-black text-xl text-center uppercase tracking-tight text-gray-800">Hapus Vendor?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[11px] text-gray-500 leading-relaxed px-2">
              Tindakan ini permanen. Pastikan tidak ada data stok masuk yang sedang menggantung pada distributor ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 mt-6">
            <AlertDialogCancel className="flex-1 rounded-xl border-none bg-gray-100 font-bold h-11 text-xs">BATAL</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl font-black h-11 text-xs shadow-lg shadow-red-100 transition-all active:scale-95"
            >
              {deleteLoading ? "..." : "HAPUS"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}