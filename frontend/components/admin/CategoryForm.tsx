"use client";

import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X, FolderTree } from "lucide-react";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: any;
}

export default function CategoryForm({ isOpen, onClose, onSubmit, initialData }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (initialData && isOpen) {
      setNama(initialData.jenis || "");
      setDeskripsi(initialData.deskripsi_jenis || "");
      setPreview(initialData.image_url || "");
    } else if (isOpen) {
      setNama(""); setDeskripsi(""); setPreview(""); setImageFile(null);
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nama_jenis", nama);
      formData.append("deskripsi_jenis", deskripsi);
      if (imageFile) formData.append("image", imageFile);

      await onSubmit(formData);
      onClose();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] sm:max-w-md max-h-[92vh] overflow-y-auto rounded-[2rem] border-none shadow-2xl p-6 md:p-8 bg-white scrollbar-hide">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg md:text-xl font-black text-gray-800 flex items-center gap-3 uppercase tracking-tighter">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-100">
              <FolderTree className="w-5 h-5" />
            </div>
            {initialData ? "Update Jenis" : "Tambah Jenis"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Cover Kategori</Label>
            <div className="relative h-32 w-full rounded-2xl overflow-hidden border-2 border-dashed border-gray-100 bg-gray-50/50 flex items-center justify-center group hover:border-emerald-200 transition-all">
              {preview ? (
                <>
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    type="button"
                    onClick={() => { setPreview(""); setImageFile(null); }}
                    className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-lg shadow-sm hover:scale-110 transition-transform"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <Upload className="w-6 h-6 text-emerald-600/40 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Upload Gambar</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Nama Kategori</Label>
              <Input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Obat Bebas"
                required
                className="h-11 rounded-xl md:rounded-2xl border-none bg-gray-50/50 font-bold focus:bg-white transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">Deskripsi Singkat</Label>
              <Textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Penjelasan kategori..."
                className="rounded-xl md:rounded-2xl border-none bg-gray-50/50 min-h-24 focus:bg-white transition-all text-sm font-medium"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-xl font-bold text-gray-400 h-11"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl md:rounded-2xl font-black h-11 px-8 shadow-xl shadow-emerald-100 flex-1 transition-all active:scale-95 text-[10px] uppercase tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
              Simpan Kategori
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}