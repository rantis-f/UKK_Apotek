"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { 
    Trash2, 
    Plus, 
    Save, 
    Loader2, 
    Package, 
    AlertCircle, 
    ShoppingCart, 
    Calendar as CalendarIcon, 
    FileText, 
    Truck,
    Check,
    ChevronsUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { distributorService } from "@/services/distributor.service";
import { obatService } from "@/services/obat.service";
import { restockService } from "@/services/restock.service";
import { toast } from "sonner";

export default function RestockForm({ isOpen, onClose, onSuccess }: any) {
    const { token } = useAuth();
    const [distributors, setDistributors] = useState<any[]>([]);
    const [obats, setObats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [header, setHeader] = useState({
        nonota: "",
        tgl_pembelian: new Date().toISOString().split("T")[0],
        id_distributor: "",
    });

    const [items, setItems] = useState<any[]>([
        { id_obat: "", jumlah_beli: 1, harga_beli: 0, subtotal: 0 }
    ]);

    useEffect(() => {
        if (isOpen && token) {
            const loadData = async () => {
                try {
                    const [distRes, obatRes] = await Promise.all([
                        distributorService.getAll(token),
                        obatService.getAll(token)
                    ]);
                    setDistributors(distRes.data || []);
                    setObats(obatRes.data || []);
                } catch (error) {
                    toast.error("Gagal sinkronisasi data master");
                }
            };
            loadData();
        }
    }, [isOpen, token]);

    const totalBayar = useMemo(() => {
        return items.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0);
    }, [items]);

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index][field] = value;
        if (field === "jumlah_beli" || field === "harga_beli") {
            newItems[index].subtotal = Number(newItems[index].jumlah_beli) * Number(newItems[index].harga_beli);
        }
        setItems(newItems);
    };

    const removeRow = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        } else {
            toast.warning("Minimal harus ada 1 item obat dalam nota");
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!header.id_distributor) return toast.error("Pilih Distributor terlebih dahulu");
        if (items.some(item => !item.id_obat)) return toast.error("Ada baris obat yang belum dipilih");

        setLoading(true);
        try {
            await restockService.create(token!, { ...header, items, total_bayar: totalBayar });
            toast.success("Stok berhasil diperbarui!");
            onSuccess();
        } catch (error: any) {
            toast.error(error.message || "Gagal menyimpan transaksi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[98vw] lg:max-w-337.5 w-full max-h-[95vh] overflow-y-auto overflow-x-hidden rounded-[2.5rem] p-6 md:p-10 border-none shadow-2xl bg-white">

                <DialogHeader className="mb-6 border-b border-gray-50 pb-4">
                    <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                            <Package className="w-5 h-5 text-emerald-600" />
                        </div>
                        Input Transaksi Stok Masuk
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-10">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-2 ml-1 tracking-wider">
                                <FileText className="w-3.5 h-3.5" /> No. Nota / Invoice
                            </label>
                            <Input 
                                className="h-11 rounded-xl border-gray-200 text-sm focus:ring-emerald-500 bg-white px-5 shadow-sm" 
                                placeholder="CONTOH: INV-2026-X" 
                                value={header.nonota} 
                                onChange={(e) => setHeader({ ...header, nonota: e.target.value })} 
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-2 ml-1 tracking-wider">
                                <CalendarIcon className="w-3.5 h-3.5" /> Tanggal Transaksi
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full h-11 justify-start text-left font-medium rounded-xl border-gray-200 bg-white shadow-sm hover:bg-emerald-50", !header.tgl_pembelian && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500" />
                                        {header.tgl_pembelian ? format(new Date(header.tgl_pembelian), "PPP", { locale: id }) : <span>Pilih Tanggal</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent side="bottom" className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                                    <Calendar mode="single" selected={new Date(header.tgl_pembelian)} onSelect={(date) => setHeader({ ...header, tgl_pembelian: date?.toISOString().split('T')[0] || "" })} initialFocus className="p-3" />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase text-gray-400 flex items-center gap-2 ml-1 tracking-wider">
                                <Truck className="w-3.5 h-3.5" /> Vendor Distributor
                            </label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" role="combobox" className="w-full h-11 justify-between rounded-xl bg-white border-gray-200 font-bold text-gray-700 shadow-sm hover:bg-emerald-50">
                                        {header.id_distributor 
                                            ? distributors.find((d) => d.id.toString() === header.id_distributor)?.nama_distributor 
                                            : "-- Pilih Vendor Distributor --"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent side="bottom" className="w-87.5 p-0 rounded-2xl shadow-2xl border-none overflow-hidden">
                                    <Command>
                                        <CommandInput placeholder="Cari nama vendor..." className="h-12" />
                                        <CommandList>
                                            <CommandEmpty>Vendor tidak ditemukan.</CommandEmpty>
                                            <CommandGroup>
                                                {distributors.map((d) => (
                                                    <CommandItem
                                                        key={d.id.toString()}
                                                        value={d.nama_distributor}
                                                        onSelect={() => setHeader({ ...header, id_distributor: d.id.toString() })}
                                                        className="flex items-center py-3 cursor-pointer"
                                                    >
                                                        <Check className={cn("mr-2 h-4 w-4 text-emerald-600", header.id_distributor === d.id.toString() ? "opacity-100" : "opacity-0")} />
                                                        {d.nama_distributor}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h4 className="font-bold text-[11px] uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" /> Rincian Item Obat
                            </h4>
                            <Button type="button" onClick={() => setItems([...items, { id_obat: "", jumlah_beli: 1, harga_beli: 0, subtotal: 0 }])} variant="outline" className="h-9 rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-[10px] font-black uppercase px-6 tracking-widest transition-all">
                                <Plus className="w-4 h-4 mr-2" /> Tambah Baris
                            </Button>
                        </div>

                        <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-3 text-[10px] font-bold uppercase text-gray-400 border-b border-gray-50">
                            <div className="col-span-5">Pencarian Nama Obat</div>
                            <div className="col-span-2 text-center">Qty</div>
                            <div className="col-span-2 text-center">Harga Beli Satuan</div>
                            <div className="col-span-2 text-center">Subtotal</div>
                            <div className="col-span-1"></div>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 md:p-0 bg-gray-50/30 md:bg-transparent rounded-2xl border md:border-none border-gray-100">
                                    
                                    <div className="md:col-span-5">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" role="combobox" className="w-full h-11 justify-between rounded-xl bg-white md:bg-gray-50 border-gray-200 md:border-none font-medium text-xs shadow-sm">
                                                    {item.id_obat 
                                                        ? obats.find((o) => o.id.toString() === item.id_obat)?.nama_obat 
                                                        : "Cari & Pilih Nama Obat..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent side="bottom" className="w-112.5 p-0 rounded-2xl shadow-2xl border-none overflow-hidden">
                                                <Command>
                                                    <CommandInput placeholder="Ketik nama obat..." className="h-12" />
                                                    <CommandList>
                                                        <CommandEmpty>Obat tidak ditemukan.</CommandEmpty>
                                                        <CommandGroup>
                                                            {obats.map((o) => (
                                                                <CommandItem
                                                                    key={o.id.toString()}
                                                                    value={o.nama_obat}
                                                                    onSelect={() => updateItem(index, "id_obat", o.id.toString())}
                                                                    className="flex items-center justify-between py-3 cursor-pointer"
                                                                >
                                                                    <div className="flex items-center">
                                                                        <Check className={cn("mr-2 h-4 w-4 text-emerald-600", item.id_obat === o.id.toString() ? "opacity-100" : "opacity-0")} />
                                                                        <span className="font-semibold text-gray-700">{o.nama_obat}</span>
                                                                    </div>
                                                                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">Stok: {o.stok}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="md:col-span-2">
                                        <Input type="number" min="1" className="h-10 rounded-xl text-center font-bold border-gray-200 shadow-none focus-visible:ring-emerald-500" value={item.jumlah_beli} onChange={(e) => updateItem(index, "jumlah_beli", e.target.value)} required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input type="number" className="h-10 rounded-xl border-gray-200 px-5 text-center font-medium shadow-none focus-visible:ring-emerald-500" placeholder="0" value={item.harga_beli} onChange={(e) => updateItem(index, "harga_beli", e.target.value)} required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="h-10 px-5 flex items-center justify-center bg-emerald-50 text-emerald-700 rounded-xl font-bold text-[11px] truncate border border-emerald-100/50">
                                            Rp {item.subtotal.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                        <Button type="button" onClick={() => removeRow(index)} variant="ghost" className="text-gray-300 hover:text-red-500 h-9 w-9 p-0 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-[1.5rem] border border-gray-100 w-fit">
                            <div className="bg-emerald-500/10 p-2 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Bayar Nota</p>
                                <h2 className="text-xl font-bold text-gray-800 tracking-tight leading-none">Rp {totalBayar.toLocaleString('id-ID')}</h2>
                            </div>
                        </div>

                        <Button disabled={loading} type="submit" className="w-full md:w-72 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold h-14 shadow-lg shadow-emerald-100 text-white transition-all active:scale-95 text-sm uppercase tracking-widest">
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="w-5 h-5 mr-3" /> Konfirmasi Stok</>}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}