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
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Upload, X, Loader2, Pill, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ObatForm({ isOpen, onClose, onSubmit, categories = [], initialData }: any) {
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<any>({ foto1: null, foto2: null, foto3: null });
  const [formData, setFormData] = useState({
    nama_obat: "", idjenis: "", harga_jual: "", stok: "", deskripsi_obat: "",
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
      setPreviews({ foto1: initialData.foto1, foto2: initialData.foto2, foto3: initialData.foto3 });
    }
  }, [initialData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[98vw] max-w-md max-h-[94vh] overflow-y-auto rounded-xl border-none shadow-2xl p-4 md:p-6 bg-white scrollbar-hide">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-sm font-black text-gray-800 flex items-center gap-2 uppercase tracking-tighter">
            <div className="bg-emerald-600 p-1 rounded text-white"><Pill size={14} /></div>
            {initialData ? "Edit" : "Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)); }} className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {["foto1", "foto2", "foto3"].map((f, i) => (
              <div key={f} className="relative aspect-square border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50 flex items-center justify-center overflow-hidden">
                {previews[f] && previews[f] !== "default.jpg" ? (
                  <img src={previews[f]} className="w-full h-full object-cover" alt="" />
                ) : (
                  <label className="cursor-pointer text-center">
                    <Upload size={12} className="mx-auto text-gray-300" />
                    <span className="text-[6px] font-black text-gray-400 uppercase tracking-tighter block mt-0.5">F-{i + 1}</span>
                    <input type="file" name={f} className="hidden" />
                  </label>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="grid gap-1">
              <Label className="text-[9px] font-black text-gray-400 uppercase">Nama</Label>
              <Input name="nama_obat" required defaultValue={formData.nama_obat} className="h-9 rounded-lg bg-gray-50/50 border-none text-[13px] font-bold px-3" />
            </div>

            <div className="grid gap-1">
              <Label className="text-[9px] font-black text-gray-400 uppercase">Kategori</Label>
              <Input name="idjenis" defaultValue={formData.idjenis} className="hidden" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-9 justify-between rounded-lg bg-gray-50/50 border-none text-[12px] font-bold text-gray-600 px-3">
                    {formData.idjenis ? categories.find((c: any) => c.id.toString() === formData.idjenis)?.jenis : "Pilih..."}
                    <ChevronsUpDown size={12} className="opacity-40" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0 border-none shadow-2xl rounded-lg">
                  <Command><CommandList><CommandGroup>
                    {categories.map((c: any) => (
                      <CommandItem key={c.id} onSelect={() => setFormData({ ...formData, idjenis: c.id.toString() })} className="text-[10px] font-bold uppercase py-2">
                        {c.jenis}
                      </CommandItem>
                    ))}
                  </CommandGroup></CommandList></Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label className="text-[9px] font-black text-gray-400 uppercase">Harga</Label>
                <Input name="harga_jual" type="number" defaultValue={formData.harga_jual} className="h-9 rounded-lg bg-gray-50/50 border-none font-black text-emerald-600 text-[13px]" />
              </div>
              <div className="grid gap-1">
                <Label className="text-[9px] font-black text-gray-400 uppercase">Stok</Label>
                <Input name="stok" type="number" defaultValue={formData.stok} className="h-9 rounded-lg bg-gray-50/50 border-none font-black text-[13px]" />
              </div>
            </div>

            <div className="grid gap-1">
              <Label className="text-[9px] font-black text-gray-400 uppercase">Deskripsi</Label>
              <Textarea name="deskripsi_obat" defaultValue={formData.deskripsi_obat} className="rounded-lg bg-gray-50/50 border-none min-h-15 text-[12px] p-2" />
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2 flex flex-row">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 rounded-lg text-[10px] font-black uppercase text-gray-400 h-9">Batal</Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-[10px] uppercase tracking-widest h-9">
              {loading ? <Loader2 size={12} className="animate-spin" /> : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}