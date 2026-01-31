"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Search, RefreshCw, Loader2, PackageOpen, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [searchQuery, setSearchQuery] = useState("");

  const initData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [dataObat, dataKategori] = await Promise.all([
        obatService.getAll(token),
        categoryService.getAll(token)
      ]);
      setItems(dataObat);
      setCategories(dataKategori);
    } catch (error: any) {
      toast.error("Gagal sinkron data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { initData(); }, [initData]);

  const filteredItems = useMemo(() => {
    return items.filter((item: any) => item.nama_obat.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [items, searchQuery]);

  return (
    <div className="space-y-6 px-2 md:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-black text-gray-800 flex items-center gap-2">
          <PackageOpen className="w-7 h-7 text-emerald-600" /> Katalog Obat
        </h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={initData} className="rounded-2xl h-11"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /></Button>
          <Button onClick={() => { setSelectedItem(null); setIsModalOpen(true); }} className="bg-emerald-600 hover:bg-emerald-700 shadow-lg rounded-2xl flex-1 font-bold h-11">
            <Plus className="w-5 h-5 mr-1" /> Tambah Obat
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-162.5">
            <thead className="bg-gray-50 border-b text-gray-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-5">Nama Obat</th>
                <th className="px-8 py-5">Kategori</th>
                <th className="px-8 py-5 text-center">Stok</th>
                <th className="px-8 py-5">Harga</th>
                <th className="px-8 py-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.map((item: any) => (
                <tr key={item.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="px-8 py-5 font-bold text-gray-800 text-sm">{item.nama_obat}</td>
                  <td className="px-8 py-5">
                    <span className="bg-emerald-100/50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                      {item.jenis_obat?.jenis || "Umum"}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center font-mono font-bold text-gray-600 text-sm">{item.stok}</td>
                  <td className="px-8 py-5 font-black text-emerald-600 text-sm">{formatRupiah(item.harga_jual)}</td>
                  <td className="px-8 py-5 flex justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsModalOpen(true); }} className="h-9 w-9 text-blue-600 hover:bg-blue-50 rounded-xl"><Edit3 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ObatForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={async (data) => {
        try {
          if (selectedItem) await obatService.update(token!, selectedItem.id, data);
          else await obatService.create(token!, data);
          toast.success("Berhasil disimpan!");
          setIsModalOpen(false);
          initData();
        } catch (e: any) { toast.error(e.message); }
      }} categories={categories} initialData={selectedItem} />
    </div>
  );
}