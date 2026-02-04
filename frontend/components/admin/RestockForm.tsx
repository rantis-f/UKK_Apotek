"use client";

import { useState, useMemo } from "react";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Loader2, ShoppingCart } from "lucide-react";
import { restockService } from "@/services/restock.service";
import { toast } from "sonner";

export default function RestockForm({ isOpen, onClose, onSuccess, token, distributors = [], obats = [] }: any) {
    const [loading, setLoading] = useState(false);
    
    const [header, setHeader] = useState({
        nonota: "",
        tgl_pembelian: new Date().toISOString().split("T")[0],
        id_distributor: "",
    });

    const [items, setItems] = useState<any[]>([
        { id_obat: "", jumlah_beli: 1, harga_beli: 0, subtotal: 0 }
    ]);

    const totalBayar = useMemo(() => 
        items.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0), 
    [items]);

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index][field] = value;
        if (field === "jumlah_beli" || field === "harga_beli") {
            newItems[index].subtotal = Number(newItems[index].jumlah_beli) * Number(newItems[index].harga_beli);
        }
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!header.id_distributor) return toast.error("Pilih Distributor!");
        if (items.some(item => !item.id_obat)) return toast.error("Ada obat yang belum dipilih!");

        setLoading(true);
        try {
            await restockService.create(token, { ...header, items, total_bayar: totalBayar });
            toast.success("Stok masuk berhasil dicatat!");
            setItems([{ id_obat: "", jumlah_beli: 1, harga_beli: 0, subtotal: 0 }]); // Reset
            setHeader({ nonota: "", tgl_pembelian: new Date().toISOString().split("T")[0], id_distributor: "" });
            onSuccess();
        } catch (error: any) {
            toast.error(error.message || "Gagal menyimpan data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] lg:max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl md:rounded-[2rem] p-4 md:p-8 border-none shadow-2xl bg-white scrollbar-hide">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-sm md:text-lg font-black text-gray-800 flex items-center gap-2 uppercase tracking-tighter">
                        <div className="bg-emerald-600 p-1.5 rounded-lg text-white"><ShoppingCart size={16} /></div>
                        Penerimaan Stok PBF
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                        <div className="col-span-2 md:col-span-1 space-y-1">
                            <Label className="text-[9px] font-black text-gray-400 uppercase ml-1">No. Nota</Label>
                            <Input required className="h-9 rounded-lg border-none bg-white text-xs font-bold" placeholder="INV-XXXX" value={header.nonota} onChange={(e) => setHeader({...header, nonota: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[9px] font-black text-gray-400 uppercase ml-1">Tanggal</Label>
                            <Input required type="date" className="h-9 rounded-lg border-none bg-white text-xs font-bold" value={header.tgl_pembelian} onChange={(e) => setHeader({...header, tgl_pembelian: e.target.value})} />
                        </div>
                        <div className="space-y-1 col-span-1">
                            <Label className="text-[9px] font-black text-gray-400 uppercase ml-1">Distributor</Label>
                            <select 
                                required
                                className="w-full h-9 rounded-lg bg-white border-none text-[10px] font-bold px-2 outline-none shadow-sm"
                                value={header.id_distributor}
                                onChange={(e) => setHeader({...header, id_distributor: e.target.value})}
                            >
                                <option value="">Pilih PBF...</option>
                                {distributors.map((d: any) => <option key={d.id} value={d.id}>{d.nama_distributor}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Daftar Obat</Label>
                            <Button type="button" onClick={() => setItems([...items, { id_obat: "", jumlah_beli: 1, harga_beli: 0, subtotal: 0 }])} variant="ghost" className="h-7 text-[9px] font-black text-emerald-600 hover:bg-emerald-50 px-2 uppercase">
                                <Plus size={12} className="mr-1" /> Tambah
                            </Button>
                        </div>

                        <div className="space-y-1.5">
                            {items.map((item, index) => (
                                <div key={index} className="bg-gray-50/50 p-2 rounded-lg border border-gray-100 flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <select 
                                            required
                                            className="flex-1 h-8 rounded-md bg-white border-none text-[11px] font-bold px-2 outline-none shadow-sm"
                                            value={item.id_obat}
                                            onChange={(e) => updateItem(index, "id_obat", e.target.value)}
                                        >
                                            <option value="">Pilih Obat...</option>
                                            {obats.map((o: any) => <option key={o.id} value={o.id}>{o.nama_obat}</option>)}
                                        </select>
                                        {items.length > 1 && (
                                            <Button type="button" onClick={() => setItems(items.filter((_, i) => i !== index))} variant="ghost" className="h-8 w-8 text-red-300 p-0 hover:text-red-500">
                                                <Trash2 size={14} />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-gray-300 uppercase">Qty</span>
                                            <Input required type="number" min="1" className="h-8 pl-8 text-center text-xs font-bold border-none rounded-md" value={item.jumlah_beli} onChange={(e) => updateItem(index, "jumlah_beli", e.target.value)} />
                                        </div>
                                        <div className="relative col-span-2">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] font-black text-emerald-600 uppercase">Rp</span>
                                            <Input required type="number" className="h-8 pl-8 text-xs font-bold border-none rounded-md" placeholder="Harga Beli" value={item.harga_beli} onChange={(e) => updateItem(index, "harga_beli", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[8px] font-black text-gray-400 uppercase">Subtotal</span>
                                        <span className="text-[11px] font-black text-emerald-600">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                            <div>
                                <p className="text-[8px] font-black text-emerald-600/60 uppercase">Total Bayar</p>
                                <h2 className="text-lg font-black text-emerald-700 tracking-tight leading-none">Rp {totalBayar.toLocaleString('id-ID')}</h2>
                            </div>
                            <Button disabled={loading} type="submit" className="bg-emerald-600 hover:bg-emerald-700 h-10 px-6 rounded-lg font-black text-[10px] uppercase tracking-widest text-white shadow-lg transition-all active:scale-95">
                                {loading ? <Loader2 size={14} className="animate-spin" /> : "KONFIRMASI"}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}