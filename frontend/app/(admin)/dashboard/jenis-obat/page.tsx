"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Search, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import CategoryTable from "@/components/admin/CategoryTable";
import CategoryForm from "@/components/admin/CategoryForm";
import { categoryService } from "@/services/category.service"; // Import Service
import { toast } from "sonner"; 

export default function JenisObatPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. FETCH DATA (Menggunakan Service)
  const fetchCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await categoryService.getAll(token);
      setCategories(data);
    } catch (error: any) {
      toast.error(error.message || "Gagal memuat data jenis obat");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // 2. LOGIKA PENCARIAN (Frontend Filtering)
  const filteredCategories = useMemo(() => {
    return categories.filter((cat: any) =>
      cat.jenis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.deskripsi_jenis?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // 3. FUNGSI HAPUS (Menggunakan Service)
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jenis obat ini?")) return;
    
    try {
      await categoryService.delete(token!, id);
      toast.success("Jenis obat berhasil dihapus");
      fetchCategories(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus data");
    }
  };

  // 4. FUNGSI SIMPAN/UPDATE (Menggunakan Service)
  const handleSave = async (formData: any) => {
    try {
      if (selectedCategory) {
        // Mode Edit
        await categoryService.update(token!, selectedCategory.id, formData);
        toast.success("Jenis obat berhasil diperbarui");
      } else {
        // Mode Tambah Baru
        await categoryService.create(token!, formData);
        toast.success("Jenis obat baru berhasil ditambahkan");
      }
      setIsModalOpen(false);
      fetchCategories(); // Refresh data
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan data");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Jenis Obat</h1>
        <Button 
          onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }} 
          className="bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Jenis
        </Button>
      </div>

      {/* SEARCH & REFRESH SECTION */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama atau deskripsi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm bg-white" 
          />
        </div>
        <Button 
          variant="outline" 
          onClick={fetchCategories} 
          disabled={loading} 
          className="rounded-xl border-emerald-100 hover:bg-emerald-50"
        >
          <RefreshCw className={`w-4 h-4 text-emerald-600 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* TABLE SECTION */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
           <Loader2 className="animate-spin text-emerald-600 h-12 w-12 mb-4" />
           <p className="animate-pulse font-medium">Mengambil data dari server...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <CategoryTable 
            data={filteredCategories} 
            onDelete={handleDelete}
            onEdit={(cat) => { setSelectedCategory(cat); setIsModalOpen(true); }}
          />
        </div>
      )}

      {/* MODAL FORM */}
      <CategoryForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSave} 
        initialData={selectedCategory} 
      />
    </div>
  );
}