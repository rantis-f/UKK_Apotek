"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Search, RefreshCw, Loader2, Trash2, Edit3, FolderTree, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import CategoryTable from "@/components/admin/CategoryTable";
import CategoryForm from "@/components/admin/CategoryForm";
import { categoryService } from "@/services/category.service";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function JenisObatPage() {
  const { token } = useAuth();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await categoryService.getAll(token);
      setCategories(res.data || []);
    } catch (error: any) {
      toast.error("Gagal memuat data");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    return list.filter((cat: any) =>
      cat.jenis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.deskripsi_jenis?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete || !token) return;
    setDeleteLoading(true);
    try {
      await categoryService.delete(token, idToDelete);
      toast.success("Kategori berhasil dihapus");
      fetchCategories();
    } catch (error: any) {
      toast.error("Gagal menghapus data");
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async (formData: FormData) => {
    try {
      if (selectedCategory) {
        await categoryService.update(token!, selectedCategory.id, formData);
        toast.success("Kategori diperbarui");
      } else {
        await categoryService.create(token!, formData);
        toast.success("Kategori ditambahkan");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error("Gagal menyimpan data");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 px-1 md:px-0 pb-24 animate-in fade-in duration-500">
      <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-50 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-100">
              <FolderTree className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-sm md:text-xl font-black text-gray-800 uppercase tracking-tight leading-none">Jenis Obat</h1>
              <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">
                {categories.length} Kategori
              </p>
            </div>
          </div>
          <Button
            onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100 rounded-xl md:rounded-2xl font-bold h-10 px-4 md:px-6 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Tambah Jenis</span>
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-11 bg-gray-50/50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-sm font-medium"
            />
          </div>
          <Button variant="outline" onClick={fetchCategories} disabled={loading} className="rounded-xl border-gray-100 h-11 w-11 p-0 transition-all active:rotate-180">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 text-gray-400">
          <Loader2 className="animate-spin text-emerald-600 h-10 w-10 mb-3" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Syncing Database...</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredCategories.map((cat) => (
              <div key={cat.id} className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm flex justify-between items-center group active:bg-emerald-50/30 transition-all">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-tight truncate">{cat.jenis}</h3>
                  <p className="text-[10px] text-gray-400 font-medium line-clamp-1 mt-0.5">
                    {cat.deskripsi_jenis || "Tanpa deskripsi"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => { setSelectedCategory(cat); setIsModalOpen(true); }}
                    className="h-9 w-9 text-blue-500 bg-blue-50 rounded-xl"
                  >
                    <Edit3 size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteClick(cat.id.toString())}
                    className="h-9 w-9 text-red-500 bg-red-50 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
            <CategoryTable
              data={filteredCategories}
              onDelete={handleDeleteClick}
              onEdit={(cat) => { setSelectedCategory(cat); setIsModalOpen(true); }}
            />
          </div>
        </div>
      )}

      <CategoryForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={selectedCategory}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[92vw] max-w-sm rounded-[2.5rem] border-none p-6 md:p-8 shadow-2xl overflow-hidden">
          <AlertDialogHeader>
            <div className="mx-auto bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50/50">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <AlertDialogTitle className="font-black text-xl md:text-2xl text-center uppercase tracking-tighter">Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-xs text-gray-500 px-2 leading-relaxed">
              Tindakan ini permanen. Pastikan tidak ada obat yang sedang menggunakan kategori ini sebelum dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-3 mt-8">
            <AlertDialogCancel className="flex-1 rounded-xl border-none bg-gray-50 font-bold text-gray-400 h-12">BATAL</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl font-black h-12 shadow-xl shadow-red-100 transition-all active:scale-95"
            >
              {deleteLoading ? <Loader2 className="animate-spin" /> : "YA, HAPUS"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}