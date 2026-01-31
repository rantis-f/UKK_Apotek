"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  initialData?: any;
}

export default function CategoryForm({ isOpen, onClose, onSubmit, initialData }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nama_jenis: "", deskripsi_jenis: "" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_jenis: initialData.jenis || "",
        deskripsi_jenis: initialData.deskripsi_jenis || ""
      });
    } else {
      setFormData({ nama_jenis: "", deskripsi_jenis: "" });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-gray-800">
            {initialData ? "Ubah Kategori" : "Tambah Kategori"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="nama_jenis" className="text-xs font-black uppercase text-gray-400 ml-1">Nama Kategori</Label>
            <Input
              id="nama_jenis"
              value={formData.nama_jenis}
              onChange={(e) => setFormData({ ...formData, nama_jenis: e.target.value })}
              required
              className="rounded-2xl border-2 border-gray-100 py-6 focus:border-emerald-500 transition-all bg-gray-50/50"
              placeholder="Contoh: Tablet, Sirup, dll"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deskripsi" className="text-xs font-black uppercase text-gray-400 ml-1">Deskripsi Singkat</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi_jenis}
              onChange={(e) => setFormData({ ...formData, deskripsi_jenis: e.target.value })}
              className="rounded-2xl border-2 border-gray-100 focus:border-emerald-500 transition-all bg-gray-50/50 min-h-25"
              placeholder="Jelaskan kategori ini..."
            />
          </div>

          <DialogFooter className="pt-6 flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl font-bold order-2 sm:order-1 text-gray-400"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-6 sm:py-2 font-bold shadow-lg shadow-emerald-100 order-1 sm:order-2 flex-1"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {loading ? "Menyimpan..." : "Simpan Kategori"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}