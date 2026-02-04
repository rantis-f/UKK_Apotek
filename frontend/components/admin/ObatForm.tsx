"use client";

import React, { useEffect, useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Upload, X, Loader2, Pill, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ObatFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  categories?: any[]; 
  initialData?: any;
}

export default function ObatForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories = [], 
  initialData 
}: ObatFormProps) {
  const [loading, setLoading] = useState(false);
  
  const [previews, setPreviews] = useState<{ [key: string]: string | null }>({
    foto1: null, foto2: null, foto3: null
  });
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({
    foto1: null, foto2: null, foto3: null
  });

  const [formData, setFormData] = useState({
    nama_obat: "",
    idjenis: "",
    harga_jual: "",
    stok: "",
    deskripsi_obat: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        nama_obat: initialData.nama_obat || "",
        idjenis: initialData.idjenis?.toString() || "",
        harga_jual: initialData.harga_jual?.toString() || "",
        stok: initialData.stok?.toString() || "0",
        deskripsi_obat: initialData.deskripsi_obat || "",
      });
      setPreviews({
        foto1: initialData.foto1 || null,
        foto2: initialData.foto2 || null,
        foto3: initialData.foto3 || null,
      });
    } else if (isOpen) {
      setFormData({ nama_obat: "", idjenis: "", harga_jual: "", stok: "0", deskripsi_obat: "" });
      setPreviews({ foto1: null, foto2: null, foto3: null });
      setSelectedFiles({ foto1: null, foto2: null, foto3: null });
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("File terlalu besar! Maksimal 2MB");
      setSelectedFiles(prev => ({ ...prev, [field]: file }));
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const removeImage = (field: string) => {
    setPreviews(prev => ({ ...prev, [field]: null }));
    setSelectedFiles(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idjenis) return toast.error("Silakan pilih kategori obat!");

    setLoading(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("nama_obat", formData.nama_obat);
      dataToSend.append("idjenis", formData.idjenis);
      dataToSend.append("harga_jual", formData.harga_jual || "0");
      dataToSend.append("stok", formData.stok || "0");
      dataToSend.append("deskripsi_obat", formData.deskripsi_obat);
      
      if (selectedFiles.foto1) dataToSend.append("foto1", selectedFiles.foto1);
      if (selectedFiles.foto2) dataToSend.append("foto2", selectedFiles.foto2);
      if (selectedFiles.foto3) dataToSend.append("foto3", selectedFiles.foto3);

      await onSubmit(dataToSend);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-8 md:p-10 bg-white selection:bg-emerald-100">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black text-gray-800 flex items-center gap-3 uppercase tracking-tight">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-100">
              <Pill className="w-6 h-6" />
            </div>
            {initialData ? "Update Produk" : "Tambah Obat"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* --- 1. FOTO PRODUK --- */}
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Galeri Foto Produk</Label>
            <div className="grid grid-cols-3 gap-4">
              {["foto1", "foto2", "foto3"].map((field, index) => (
                <div key={field} className="relative aspect-square border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 cursor-pointer flex items-center justify-center overflow-hidden hover:bg-emerald-50/30 transition-all group">
                  {previews[field] && previews[field] !== "default.jpg" ? (
                    <>
                      <img src={previews[field]!} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(field)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <Upload className="w-5 h-5 text-gray-300 mb-1" />
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{index === 0 ? "Utama" : `Foto ${index + 1}`}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, field)} />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* --- 2. BARIS 1: NAMA OBAT & KATEGORI (SEBARIS) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nama Produk Obat</Label>
              <Input 
                required 
                value={formData.nama_obat} 
                onChange={(e) => setFormData({...formData, nama_obat: e.target.value})} 
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-bold focus:bg-white transition-all shadow-sm" 
                placeholder="Masukkan nama obat..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Kategori / Jenis Obat</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    role="combobox"
                    className="w-full h-12 justify-between rounded-2xl bg-gray-50/50 border-gray-100 font-bold text-gray-700 hover:bg-white transition-all shadow-sm"
                  >
                    <span className="truncate">
                      {formData.idjenis 
                        ? categories.find((cat) => cat.id.toString() === formData.idjenis)?.jenis 
                        : "Pilih Kategori..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0 rounded-2xl border-none shadow-2xl overflow-hidden bg-white animate-in zoom-in-95">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        <p className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">Daftar Kategori</p>
                        {categories?.map((cat: any) => (
                          <CommandItem
                            key={cat.id}
                            onSelect={() => setFormData({ ...formData, idjenis: cat.id.toString() })}
                            className={cn(
                              "flex items-center justify-between px-4 py-3.5 cursor-pointer",
                              formData.idjenis === cat.id.toString() 
                                ? "bg-emerald-600 text-white font-bold" 
                                : "text-gray-600 hover:bg-emerald-50"
                            )}
                          >
                            <span className="text-[10px] uppercase tracking-widest font-black">{cat.jenis}</span>
                            {formData.idjenis === cat.id.toString() && <Check className="w-4 h-4 text-white" />}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* --- 3. BARIS 2: HARGA & STOK (SEBARIS) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Harga Jual (Rp)</Label>
              <Input 
                type="number" 
                value={formData.harga_jual} 
                onChange={(e) => setFormData({...formData, harga_jual: e.target.value})} 
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-black text-emerald-600 focus:bg-white transition-all shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Stok Tersedia</Label>
              <Input 
                type="number" 
                value={formData.stok} 
                onChange={(e) => setFormData({...formData, stok: e.target.value})} 
                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 font-black text-gray-800 focus:bg-white transition-all shadow-sm" 
              />
            </div>
          </div>

          {/* --- 4. DESKRIPSI --- */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Deskripsi Produk</Label>
            <Textarea 
              value={formData.deskripsi_obat} 
              onChange={(e) => setFormData({...formData, deskripsi_obat: e.target.value})} 
              className="rounded-2xl border-gray-100 bg-gray-50/50 min-h-24 focus:bg-white transition-all p-4 font-medium text-sm shadow-sm" 
              placeholder="Indikasi, dosis, dan efek samping..."
            />
          </div>

          <DialogFooter className="pt-6 gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold text-gray-400 hover:text-gray-600 transition-colors">
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black px-10 h-12 shadow-lg shadow-emerald-100 transition-all active:scale-95 text-[11px] uppercase tracking-[0.15em]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} 
              SIMPAN PRODUK
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}