"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail, Phone, MapPin, ShieldCheck,
  CreditCard, X, UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

export default function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] md:max-w-3xl rounded-[2rem] md:rounded-[2.5rem] p-0 overflow-y-auto max-h-[95vh] border-none shadow-2xl bg-white [&>button]:hidden scrollbar-hide">

        <DialogHeader className="sr-only">
          <DialogTitle>Detail Pelanggan: {customer.nama_pelanggan}</DialogTitle>
        </DialogHeader>

        <div className="bg-emerald-600 h-24 md:h-32 w-full relative shrink-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all z-50 active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 md:px-8 pb-6 -mt-12 md:-mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start text-center md:text-left">
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-[2rem] md:rounded-[2.5rem] bg-white p-2 shadow-xl shrink-0">
              <div className="h-full w-full rounded-[1.5rem] md:rounded-[2rem] bg-gray-100 overflow-hidden border-2 border-gray-50 flex items-center justify-center">
                {customer.foto ? (
                  <img src={customer.foto} alt="" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle className="w-12 h-12 text-gray-300" />
                )}
              </div>
            </div>

            <div className="pt-2 md:pt-20 space-y-2 w-full">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight leading-tight">
                {customer.nama_pelanggan}
              </h2>
              <div className="flex flex-col md:flex-row flex-wrap justify-center md:justify-start gap-2">
                <span className="inline-flex items-center justify-center md:justify-start gap-1.5 text-[9px] font-black text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  <Mail className="w-3 h-3 text-emerald-500" /> {customer.email || "No Email"}
                </span>
                <span className="inline-flex items-center justify-center md:justify-start gap-1.5 text-[9px] font-black text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                  <Phone className="w-3 h-3 text-emerald-500" /> {customer.no_telp || "No Phone"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[1, 2, 3].map((num) => {
              const alamat = customer[`alamat${num}`];
              const kota = customer[`kota${num}`];
              const prov = customer[`propinsi${num}`];

              return (
                <div
                  key={num}
                  className={`p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all ${alamat ? 'border-emerald-50 bg-emerald-50/30' : 'border-dashed border-gray-100 opacity-40'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Lokasi {num}</span>
                    <MapPin className={`w-3.5 h-3.5 ${alamat ? 'text-emerald-500' : 'text-gray-300'}`} />
                  </div>
                  {alamat ? (
                    <div className="space-y-1">
                      <p className="text-[10px] md:text-[11px] font-bold text-gray-700 leading-snug line-clamp-2">{alamat}</p>
                      <p className="text-[8px] text-gray-400 uppercase font-black">{kota}, {prov}</p>
                    </div>
                  ) : (
                    <p className="text-[8px] text-gray-300 italic font-bold uppercase tracking-widest">Belum Diatur</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Kartu Identitas (KTP)
            </h3>
            {customer.url_ktp ? (
              <div className="relative group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border-2 border-emerald-100 h-44 md:h-52 bg-gray-50 flex items-center justify-center shadow-sm">
                <img src={customer.url_ktp} alt="KTP" className="h-full w-full object-contain p-2" />
                <div className="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-4">
                  <div className="bg-white text-emerald-600 px-4 py-2 rounded-xl font-black text-[9px] uppercase shadow-xl flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Identitas Terverifikasi
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 border-2 border-dashed border-gray-100 rounded-[1.5rem] md:rounded-[2rem] text-center bg-gray-50/30">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Dokumen KTP Tidak Tersedia</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 md:px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-end gap-3 rounded-b-[2rem] md:rounded-b-[2.5rem]">
          <Button
            onClick={onClose}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest px-10 h-12 rounded-xl md:rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            Tutup Dashboard Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}