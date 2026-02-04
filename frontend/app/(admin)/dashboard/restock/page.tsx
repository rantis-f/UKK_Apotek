"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PackagePlus, History, Loader2, Plus, Calendar,
  FileText, Truck, Search, CheckCircle2, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { restockService } from "@/services/restock.service";
import { toast } from "sonner";
import RestockForm from "@/components/admin/RestockForm";

export default function RestockPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRestock, setSelectedRestock] = useState<any | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const fetchHistory = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await restockService.getAll(token);
      setHistory(res.data || []);
    } catch (error: any) {
      toast.error("Gagal sinkronisasi data riwayat");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isMounted) fetchHistory();
  }, [isMounted, fetchHistory]);

  if (!isMounted) return null;

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-24 px-1 md:px-0">

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-100 shrink-0">
            <PackagePlus className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-sm md:text-2xl font-black text-gray-800 uppercase tracking-tight leading-none">Stok Masuk</h1>
            <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Inventory Control</p>
          </div>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 rounded-xl md:rounded-2xl font-black w-full md:w-auto px-8 h-11 md:h-12 shadow-xl shadow-emerald-100 transition-all active:scale-95 text-[10px] md:text-xs uppercase tracking-widest"
        >
          <Plus className="w-4 h-4 mr-2" /> INPUT NOTA BARU
        </Button>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-gray-100/30 border border-gray-50 overflow-hidden">
        <div className="p-4 md:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
          <h3 className="font-black text-[9px] md:text-xs uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
            <History className="w-4 h-4" /> Log Transaksi Pembelian
          </h3>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin text-emerald-600 h-8 w-8 mb-3" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">Syncing Database...</p>
          </div>
        ) : history.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] uppercase font-black tracking-widest text-gray-400 border-b">
                  <tr>
                    <th className="px-8 py-5">Invoice / Tgl</th>
                    <th className="px-8 py-5">Distributor</th>
                    <th className="px-8 py-5 text-center">Items</th>
                    <th className="px-8 py-5 text-right">Total</th>
                    <th className="px-8 py-5 text-center">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.map((item) => (
                    <tr key={item.id} onClick={() => setSelectedRestock(item)} className="hover:bg-emerald-50/30 transition-all cursor-pointer group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900 flex items-center gap-2 group-hover:text-emerald-700 transition-colors">
                            <FileText className="w-3.5 h-3.5 text-emerald-500" /> {item.nonota}
                          </span>
                          <span className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                            {new Date(item.tgl_pembelian).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs text-gray-700 font-black uppercase italic tracking-tight">
                        {item.distributor?.nama_distributor || 'Vendor Umum'}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg border border-emerald-100 uppercase">
                          {item.details?.length || 0} SKU
                        </span>
                      </td>
                      <td className="px-8 py-5 font-black text-gray-900 text-right text-sm">
                        Rp {Number(item.total_bayar).toLocaleString('id-ID')}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="bg-gray-100 p-2 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all inline-block">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-100">
              {history.map((item) => (
                <div key={item.id} onClick={() => setSelectedRestock(item)} className="p-5 active:bg-emerald-50/50 flex items-center justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-black text-gray-900 flex items-center gap-2 uppercase tracking-tight truncate">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" /> {item.nonota}
                      </p>
                      <span className="text-[8px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase shrink-0">
                        {item.details?.length} SKU
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-400 font-black uppercase truncate">{item.distributor?.nama_distributor}</p>
                    <div className="flex justify-between items-end pt-1">
                      <p className="text-xs font-black text-emerald-600">Rp {Number(item.total_bayar).toLocaleString('id-ID')}</p>
                      <p className="text-[8px] text-gray-400 font-bold italic">{new Date(item.tgl_pembelian).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-200" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-24 text-center text-gray-300 uppercase font-black text-[10px] tracking-[0.3em]">
            Riwayat Stok Belum Terdata
          </div>
        )}
      </div>

      <RestockForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => { setIsFormOpen(false); fetchHistory(); }}
      />

      <Dialog open={!!selectedRestock} onOpenChange={() => setSelectedRestock(null)}>
        <DialogContent className="max-w-2xl w-[96vw] md:w-full rounded-[2rem] p-0 border-none shadow-2xl overflow-hidden bg-white max-h-[92vh] flex flex-col scrollbar-hide">

          <div className="bg-emerald-600 px-6 md:px-10 py-6 md:py-8 text-white shrink-0">
            <DialogHeader>
              <DialogTitle className="text-sm md:text-lg font-black uppercase tracking-widest flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" /> Detail Transaksi
              </DialogTitle>
            </DialogHeader>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60 mt-2">Nota Vendor: {selectedRestock?.nonota}</p>

            <div className="mt-5 flex flex-col md:flex-row gap-2 md:gap-8 border-t border-white/10 pt-4 text-[9px] md:text-[10px] font-black uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 opacity-50" />
                <span>{selectedRestock && new Date(selectedRestock.tgl_pembelian).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Truck className="w-3.5 h-3.5 opacity-50" />
                <span className="truncate">{selectedRestock?.distributor?.nama_distributor || 'Vendor Umum'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8 overflow-y-auto flex-1 bg-gray-50/30">
            <div className="hidden md:block border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[9px] font-black uppercase tracking-widest text-gray-400 border-b">
                  <tr>
                    <th className="px-6 py-4">Produk Obat</th>
                    <th className="px-6 py-4 text-center">Kuantitas</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedRestock?.details?.map((detail: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800 text-sm uppercase tracking-tight">{detail.obat?.nama_obat}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-gray-600 text-xs">
                        {detail.jumlah_beli} <span className="text-[9px] text-gray-400">{detail.obat?.satuan}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-emerald-600 text-xs tracking-tighter">
                        Rp {Number(detail.subtotal).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-2">
              {selectedRestock?.details?.map((detail: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-gray-800 uppercase truncate leading-none">{detail.obat?.nama_obat}</p>
                    <p className="text-[8px] font-bold text-gray-400 mt-1">Qty: {detail.jumlah_beli} {detail.obat?.satuan}</p>
                  </div>
                  <p className="text-[11px] font-black text-emerald-600 ml-2 shrink-0">Rp {Number(detail.subtotal).toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-emerald-600 rounded-2xl p-4 md:p-6 text-white flex justify-between items-center shadow-xl shadow-emerald-100">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Total Dana Keluar</p>
                <h2 className="text-lg md:text-2xl font-black tracking-tighter">Rp {Number(selectedRestock?.total_bayar || 0).toLocaleString('id-ID')}</h2>
              </div>
              <div className="bg-white/20 p-2.5 rounded-xl">
                <PackagePlus className="w-6 h-6 md:w-8 md:h-8" />
              </div>
            </div>

            <Button
              onClick={() => setSelectedRestock(null)}
              className="mt-6 w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-400 font-black h-12 text-[9px] uppercase tracking-[0.3em] transition-all"
            >
              Tutup Rincian
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}