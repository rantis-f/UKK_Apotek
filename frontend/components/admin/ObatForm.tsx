"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Upload, X, Loader2, Pill } from "lucide-react";
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
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setPreview(initialData.foto1 || null);
    } else if (isOpen) {
      setFormData({ nama_obat: "", idjenis: "", harga_jual: "", stok: "0", deskripsi_obat: "" });
      setPreview(null);
      setSelectedFile(null);
    }

    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return toast.error("File terlalu besar! Maksimal 2MB");
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
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
      
      if (selectedFile) dataToSend.append("foto1", selectedFile);

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
      <DialogContent className="w-[95vw] sm:max-w-125 max-h-[90vh] overflow-y-auto rounded-[1.5rem] sm:rounded-[2rem] border-none shadow-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-black text-gray-800 flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600" />
            {initialData ? "Ubah Data Obat" : "Obat Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Foto Produk</Label>
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className="relative border-2 border-dashed border-gray-100 rounded-3xl sm:rounded-[1.5rem] p-2 bg-gray-50/50 cursor-pointer min-h-30 sm:min-h-37.5 flex flex-col items-center justify-center overflow-hidden hover:bg-emerald-50/50 transition-all"
            >
              {preview ? (
                <div className="relative w-full h-28 sm:h-32">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg sm:rounded-xl" />
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-1 right-1 h-6 w-6 sm:h-7 sm:w-7 rounded-full shadow-lg" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setPreview(null); 
                      setSelectedFile(null); 
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-2 sm:py-4">
                  <Upload className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                  <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pilih foto</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nama Produk</Label>
              <Input 
                required 
                value={formData.nama_obat} 
                onChange={(e) => setFormData({...formData, nama_obat: e.target.value})} 
                className="rounded-xl sm:rounded-2xl border-gray-100 bg-gray-50/50 focus:border-emerald-500 text-sm" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Kategori</Label>
                <Select value={formData.idjenis} onValueChange={(val: string) => setFormData({...formData, idjenis: val})}>
                  <SelectTrigger className="rounded-xl sm:rounded-2xl border-gray-100 bg-gray-50/50 text-sm">
                    <SelectValue placeholder="Pilih..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat.id.toString()} value={cat.id.toString()}>
                        {cat.jenis}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Stok</Label>
                <Input 
                  type="number" 
                  value={formData.stok} 
                  onChange={(e) => setFormData({...formData, stok: e.target.value})} 
                  className="rounded-xl sm:rounded-2xl border-gray-100 bg-gray-50/50 text-sm" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Harga Jual (Rp)</Label>
              <Input 
                type="number" 
                value={formData.harga_jual} 
                onChange={(e) => setFormData({...formData, harga_jual: e.target.value})} 
                className="rounded-xl sm:rounded-2xl border-gray-100 bg-gray-50/50 font-bold text-emerald-600 text-sm" 
              />
            </div>

            <div className="space-y-1">
              <Label className="text-[10px] font-black uppercase text-gray-400 ml-1">Deskripsi</Label>
              <Textarea 
                value={formData.deskripsi_obat} 
                onChange={(e) => setFormData({...formData, deskripsi_obat: e.target.value})} 
                className="rounded-xl sm:rounded-2xl border-gray-100 bg-gray-50/50 min-h-15 sm:min-h-20 text-sm" 
              />
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2 flex flex-col sm:flex-row">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              className="rounded-xl font-bold text-gray-400 order-2 sm:order-1 w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-emerald-600 hover:bg-emerald-700 rounded-xl sm:rounded-2xl font-bold min-w-full sm:min-w-30 shadow-lg shadow-emerald-100 order-1 sm:order-2 h-10 sm:h-11"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} 
              Simpan Data
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}