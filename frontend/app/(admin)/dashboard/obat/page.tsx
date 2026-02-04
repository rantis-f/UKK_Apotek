"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus, Search, RefreshCw, PackageOpen,
  Edit3, Trash2, CameraOff, AlertTriangle, Loader2, MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { obatService } from "@/services/obat.service";
import { categoryService } from "@/services/category.service";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";
import ObatForm from "@/components/admin/ObatForm";

export default function ManajemenObatPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, nama: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const initData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [dataObat, dataKategori] = await Promise.all([
        obatService.getAll(token),
        categoryService.getAll(token)
      ]);
      setItems(dataObat.data || []);
      setCategories(dataKategori.data || []);
    } catch (error: any) {
      toast.error("Gagal sinkronisasi data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { initData(); }, [initData]);

  const filteredItems = useMemo(() => {
    return items.filter((item: any) =>
      item.nama_obat.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const handleDeleteClick = (id: string, nama: string) => {
    setItemToDelete({ id, nama });
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !token) return;
    try {
      await obatService.delete(token, itemToDelete.id);
      toast.success("Produk berhasil dimusnahkan!");
      setIsDeleteConfirmOpen(false);
      initData();
    } catch (error: any) {
      toast.error("Gagal menghapus data");
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      if (selectedItem) {
        await obatService.update(token!, selectedItem.id, data);
        toast.success("Update berhasil!");
      } else {
        await obatService.create(token!, data);
        toast.success("Produk baru terdaftar!");
      }
      setIsModalOpen(false);
      initData();
    } catch (e: any) {
      toast.error("Gagal menyimpan data");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 px-1 md:px-0 pb-20 animate-in fade-in duration-500">
      <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-gray-50 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 md:p-3 rounded-xl md:rounded-2xl text-white shadow-xl shadow-emerald-100">
              <PackageOpen className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-gray-800 tracking-tight uppercase">Katalog Obat</h1>
              <p className="text-[9px] md:text-xs text-gray-400 font-bold tracking-widest uppercase">
                {items.length} Produk Terdata
              </p>
            </div>
          </div>
          <Button
            onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 rounded-xl md:rounded-2xl font-bold h-11 md:h-12 px-6 shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 mr-2" /> Tambah Obat
          </Button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari obat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl md:rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all outline-none"
            />
          </div>
          <Button variant="outline" onClick={initData} className="rounded-xl md:rounded-2xl h-11 w-11 p-0 border-gray-100">
            <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin text-emerald-600 h-10 w-10 mb-4" />
          <p className="font-black text-[10px] uppercase tracking-widest">Sinkronisasi...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredItems.map((item: any) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                  {item.foto1 && item.foto1 !== "default.jpg" ? (
                    <img src={item.foto1} className="h-full w-full object-cover" alt="" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-300"><CameraOff size={20} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">{item.jenis_obat?.jenis}</span>
                  <h3 className="font-bold text-gray-800 text-sm truncate">{item.nama_obat}</h3>
                  <p className="text-emerald-600 font-black text-xs mt-1">{formatRupiah(item.harga_jual)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${item.stok <= 5 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-400"}`}>
                      Stok: {item.stok}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="icon" variant="ghost" onClick={() => { setSelectedItem(item); setIsModalOpen(true); }} className="h-8 w-8 text-blue-500 bg-blue-50 rounded-lg"><Edit3 size={14} /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(item.id.toString(), item.nama_obat)} className="h-8 w-8 text-red-500 bg-red-50 rounded-lg"><Trash2 size={14} /></Button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Produk</th>
                  <th className="px-8 py-5">Detail</th>
                  <th className="px-8 py-5 text-center">Stok</th>
                  <th className="px-8 py-5 text-right">Harga</th>
                  <th className="px-8 py-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredItems.map((item: any) => (
                  <tr key={item.id} className="group hover:bg-emerald-50/10 transition-colors">
                    <td className="px-8 py-4">
                      <div className="h-14 w-14 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 group-hover:scale-105 transition-transform">
                        <img src={item.foto1} className="h-full w-full object-cover" alt="" />
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{item.nama_obat}</span>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase mt-1">{item.jenis_obat?.jenis}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className={`font-mono font-bold ${item.stok <= 5 ? "text-red-500" : "text-gray-600"}`}>{item.stok}</span>
                    </td>
                    <td className="px-8 py-4 font-black text-emerald-600 text-right">{formatRupiah(item.harga_jual)}</td>
                    <td className="px-8 py-4">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsModalOpen(true); }} className="h-10 w-10 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item.id.toString(), item.nama_obat)} className="h-10 w-10 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ObatForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        initialData={selectedItem}
        onSubmit={handleFormSubmit}
      />

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="w-[92vw] max-w-sm rounded-[2.5rem] p-8 border-none shadow-2xl overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6">
            <div className="bg-red-50 p-5 rounded-full ring-8 ring-red-50/50">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Hapus Produk?</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Produk <span className="font-bold text-red-600">"{itemToDelete?.nama}"</span> akan dimusnahkan selamanya dari database.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)} className="flex-1 rounded-2xl font-bold text-gray-400">Batal</Button>
              <Button onClick={handleConfirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black shadow-xl shadow-red-100">Hapus!</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}