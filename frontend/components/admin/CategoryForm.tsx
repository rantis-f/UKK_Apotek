"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  initialData?: any; // Data lama jika sedang mode Edit
}

export default function CategoryForm({ isOpen, onClose, onSubmit, initialData }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ nama_jenis: "", deskripsi_jenis: "" });

  // Update form jika sedang mode Edit
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {initialData ? "Ubah Kategori" : "Tambah Kategori"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nama_jenis">Nama Kategori</Label>
            <Input
              id="nama_jenis"
              value={formData.nama_jenis}
              onChange={(e) => setFormData({ ...formData, nama_jenis: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              value={formData.deskripsi_jenis}
              onChange={(e) => setFormData({ ...formData, deskripsi_jenis: e.target.value })}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Batal</Button>
            <Button type="submit" className="bg-emerald-600" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Simpan Kategori"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}