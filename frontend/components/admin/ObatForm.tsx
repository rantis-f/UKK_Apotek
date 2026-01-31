"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Pill } from "lucide-react";

interface ObatFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => Promise<void>;
    categories: any[];
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
    const [formData, setFormData] = useState({
        nama_obat: "",
        idjenis: "",
        harga_jual: "",
        stok: "",
        deskripsi_obat: "",
        foto1: "default.jpg"
    });

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                nama_obat: initialData.nama_obat || "",
                idjenis: initialData.idjenis?.toString() || "",
                harga_jual: initialData.harga_jual?.toString() || "",
                stok: initialData.stok?.toString() || "",
                deskripsi_obat: initialData.deskripsi_obat || "",
                foto1: initialData.foto1 || "default.jpg"
            });
        } else if (isOpen) {
            setFormData({ nama_obat: "", idjenis: "", harga_jual: "", stok: "", deskripsi_obat: "", foto1: "default.jpg" });
        }
    }, [initialData, isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[95vw] sm:max-w-125 rounded-3xl border-none shadow-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-gray-800 flex items-center gap-2">
                        <Pill className="text-emerald-600 w-5 h-5" />
                        {initialData ? "Ubah Data" : "Obat Baru"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={async (e) => { e.preventDefault(); setLoading(true); await onSubmit(formData); setLoading(false); }} className="space-y-4 py-2">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nama Produk</label>
                        <input required value={formData.nama_obat} onChange={(e) => setFormData({ ...formData, nama_obat: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 outline-none bg-gray-50/50 text-sm" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Kategori</label>
                        <select
                            required
                            value={formData.idjenis}
                            onChange={(e) => setFormData({ ...formData, idjenis: e.target.value })}
                            className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-2xl outline-none bg-white focus:border-emerald-500 text-sm appearance-none cursor-pointer"
                        >
                            <option value="">-- Pilih Jenis --</option>
                            {categories?.map((cat: any) => (
                                <option key={cat.id.toString()} value={cat.id.toString()}>{cat.jenis}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Harga (Rp)</label>
                            <input required type="number" value={formData.harga_jual} onChange={(e) => setFormData({ ...formData, harga_jual: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-sm font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Stok</label>
                            <input required type="number" value={formData.stok} onChange={(e) => setFormData({ ...formData, stok: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-100 rounded-2xl bg-gray-50/50 text-sm font-bold" />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 gap-2 flex-col sm:flex-row">
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold text-gray-400 order-2 sm:order-1">Batal</Button>
                        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-8 shadow-lg font-bold order-1 sm:order-2 h-11">
                            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4 mr-2" />} Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}