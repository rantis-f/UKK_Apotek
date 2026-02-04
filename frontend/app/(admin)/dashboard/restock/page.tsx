"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  PackagePlus, History, Loader2, Plus, Calendar, 
  FileText, Truck, Search, CheckCircle2, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-10 px-2 md:px-0">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-100">
            <PackagePlus className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h1 className="text-base md:text-2xl font-black text-gray-800 uppercase tracking-tight">Stok Masuk</h1>
            <p className="text-[8px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Sistem Manajemen PBF</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 rounded-xl md:rounded-2xl font-bold w-full md:w-auto px-6 h-11 md:h-12 shadow-lg transition-all active:scale-95 text-xs md:text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> INPUT STOK BARU
        </Button>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-gray-100/30 border border-gray-50 overflow-hidden">
        <div className="p-5 md:p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-[10px] md:text-sm uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <History className="w-4 h-4" /> Log Transaksi Pembelian
            </h3>
        </div>
        
        {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 text-center">
              <Loader2 className="animate-spin text-emerald-600 h-8 w-8 mb-3" />
              <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Menghubungkan ke Server...</p>
            </div>
        ) : history.length > 0 ? (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] uppercase font-bold tracking-widest text-gray-600">
                  <tr>
                    <th className="px-8 py-5">Nomor Nota / Tgl</th>
                    <th className="px-8 py-5">Distributor (Vendor)</th>
                    <th className="px-8 py-5 text-center">Qty Item</th>
                    <th className="px-8 py-5 text-right">Total Bayar</th>
                    <th className="px-8 py-5 text-center">Opsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.map((item) => (
                    <tr key={item.id} onClick={() => setSelectedRestock(item)} className="hover:bg-emerald-50/30 transition-all cursor-pointer group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 flex items-center gap-1.5 group-hover:text-emerald-700">
                            <FileText className="w-3.5 h-3.5 text-emerald-500" /> {item.nonota}
                          </span>
                          <span className="text-[10px] text-gray-500 font-semibold mt-1">
                            {new Date(item.tgl_pembelian).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-700 font-bold uppercase italic">
                        {item.distributor?.nama_distributor || 'Vendor Umum'}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter">
                            {item.details?.length || 0} Produk
                        </span>
                      </td>
                      <td className="px-8 py-5 font-black text-gray-900 text-right text-sm">
                        Rp {Number(item.total_bayar).toLocaleString('id-ID')}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div className="bg-gray-100 p-2 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all inline-block shadow-sm">
                            <Search className="w-4 h-4" />
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
                  <div className="space-y-1.5 flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-black text-gray-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" /> {item.nonota}
                      </p>
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg uppercase">
                        {item.details?.length} Item
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase truncate max-w-50">{item.distributor?.nama_distributor}</p>
                    <div className="flex justify-between items-center pt-2">
                       <p className="text-sm font-black text-emerald-600">Rp {Number(item.total_bayar).toLocaleString('id-ID')}</p>
                       <p className="text-[9px] text-gray-500 font-bold">{new Date(item.tgl_pembelian).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-24 text-center text-gray-300 uppercase font-black text-xs tracking-[0.3em]">
            Database Stok Masuk Kosong
          </div>
        )}
      </div>

      <RestockForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={() => { setIsFormOpen(false); fetchHistory(); }} />

      <Dialog open={!!selectedRestock} onOpenChange={() => setSelectedRestock(null)}>
        <DialogContent className="max-w-2xl w-[96vw] md:w-full rounded-[2rem] p-0 border-none shadow-2xl overflow-hidden bg-white max-h-[95vh] flex flex-col">
          
          <div className="bg-emerald-600 px-8 md:px-10 py-6 md:py-8 text-white shrink-0">
            <DialogTitle className="text-base md:text-lg font-black uppercase tracking-tight flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" /> Rincian Transaksi
            </DialogTitle>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70 mt-1">Invoice: {selectedRestock?.nonota}</p>
            
            <div className="mt-6 flex flex-col md:flex-row gap-3 md:gap-8 border-t border-white/10 pt-4">
               <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 opacity-60" />
                  <span className="text-[10px] font-bold">{selectedRestock && new Date(selectedRestock.tgl_pembelian).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 opacity-60" />
                  <span className="text-[10px] font-bold uppercase truncate max-w-50">{selectedRestock?.distributor?.nama_distributor}</span>
               </div>
            </div>
          </div>

          <div className="p-5 md:p-8 overflow-y-auto flex-1 bg-gray-50/20">
            <div className="hidden md:block border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50/80 text-[9px] font-black uppercase tracking-widest text-gray-500 border-b">
                  <tr>
                    <th className="px-6 py-4">Nama Obat</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {selectedRestock?.details?.map((detail: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800 text-sm">{detail.obat?.nama_obat}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-gray-600 text-xs">
                        {detail.jumlah_beli}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-emerald-600 text-xs">
                        Rp {Number(detail.subtotal).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3">
              {selectedRestock?.details?.map((detail: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                   <p className="text-xs font-black text-gray-900 mb-2">{detail.obat?.nama_obat}</p>
                   <div className="flex justify-between items-end border-t border-gray-50 pt-2 text-[9px]">
                      <div className="font-bold text-gray-400 uppercase">
                        Qty: <span className="text-gray-800">{detail.jumlah_beli}</span>
                      </div>
                      <p className="text-xs font-black text-emerald-600">Rp {Number(detail.subtotal).toLocaleString('id-ID')}</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-emerald-600 rounded-2xl p-4 md:p-5 text-white flex justify-between items-center shadow-lg shadow-emerald-100/50">
               <div>
                 <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-70 mb-0.5">Total Bayar Nota</p>
                 <h2 className="text-lg md:text-2xl font-black tracking-tight">Rp {Number(selectedRestock?.total_bayar || 0).toLocaleString('id-ID')}</h2>
               </div>
               <div className="bg-white/10 p-2 md:p-2.5 rounded-xl">
                 <PackagePlus className="w-6 h-6 md:w-7 md:h-7 opacity-90" />
               </div>
            </div>

            <Button 
              onClick={() => setSelectedRestock(null)} 
              className="mt-6 w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold h-12 text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95"
            >
              Kembali
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}