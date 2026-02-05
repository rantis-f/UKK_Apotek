"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "./StatusBadge";
import { 
  Package, User, Truck, Receipt, ImageIcon, 
  ImageOff, MapPin, Info, CreditCard, Coins, Banknote 
} from "lucide-react";

export default function OrderDetailModal({ isOpen, onClose, data }: any) {
  if (!data) return null;

  const subtotal = Number(data.total_bayar) - Number(data.ongkos_kirim || 0) - Number(data.biaya_app || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-2xl rounded-[1.5rem] md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border-none shadow-2xl bg-white overflow-y-auto max-h-[90vh] scrollbar-hide">
        
        {/* HEADER: Judul & Status */}
        <DialogHeader className="border-b pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shrink-0">
              <Receipt size={22} />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-lg md:text-2xl font-black text-gray-800 uppercase tracking-tighter leading-none">
                Detail Transaksi
              </DialogTitle>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                Invoice: #{data.id}
              </span>
            </div>
          </div>
          <div className="scale-90 sm:scale-100 origin-left">
            <StatusBadge status={data.status_order} />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-8">         
          
          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2 tracking-widest">
                <User size={14} className="text-emerald-600" /> Informasi Pelanggan
              </h3>
              <div className="bg-gray-50/80 p-5 rounded-[1.5rem] border border-gray-100/50">
                <p className="text-gray-900 font-black text-sm uppercase">
                  {data.pelanggan?.nama_pelanggan || "Pelanggan Umum"}
                </p>
                <div className="flex items-start gap-2 mt-3 text-gray-500">
                  <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
                  <p className="text-[11px] font-medium leading-relaxed italic">
                    <p>{data.pelanggan?.alamat1 || data.pelanggan?.alamat2 || data.pelanggan?.alamat3 || "Walk-in"}</p>
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-blue-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase">Metode Bayar</span>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                    {data.metode_bayar?.tempat_bayar || "Tunai"}
                  </span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2 tracking-widest">
                <Truck size={14} className="text-blue-600" /> Logistik
              </h3>
              <div className="bg-blue-50/30 p-5 rounded-[1.5rem] border border-blue-100/50">
                <p className="text-[11px] font-black text-blue-700 uppercase">
                  {data.jenis_pengiriman?.jenis_kirim || "Ambil di Tempat"}
                </p>
                <p className="text-[10px] text-blue-600/70 mt-1 italic">
                   {data.id_jenis_kirim === 1 ? "Pesanan diambil langsung oleh pelanggan" : "Dikirim melalui kurir"}
                </p>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2 tracking-widest">
                <Package size={14} className="text-orange-500" /> Daftar Obat
              </h3>
              <div className="space-y-2.5 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                {data.details?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black text-gray-700 uppercase">{item.obat?.nama_obat}</span>
                        <span className="text-[9px] text-gray-400 font-bold italic">Rp {Number(item.harga_beli).toLocaleString()} / item</span>
                    </div>
                    <span className="text-[11px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                        {item.jumlah_beli}x
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gray-900 p-6 rounded-[2rem] text-white shadow-xl shadow-gray-200">
                <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span>Rp {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Ongkos Kirim</span>
                        <span>Rp {Number(data.ongkos_kirim || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Biaya Layanan</span>
                        <span>Rp {Number(data.biaya_app || 0).toLocaleString()}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-700 flex justify-between items-center">
                        <span className="text-xs font-black uppercase text-emerald-400">Total Akhir</span>
                        <span className="text-xl font-black tracking-tighter text-emerald-400">
                            Rp {Number(data.total_bayar).toLocaleString()}
                        </span>
                    </div>
                </div>
            </section>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}