"use client";

import { useEffect, useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Phone, MapPin, Building2, Save, X } from "lucide-react";

export default function DistributorForm({ isOpen, onClose, onSubmit, initialData }: any) {
  const [formData, setFormData] = useState({ 
    nama_distributor: "", 
    telepon: "", 
    alamat: "" 
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(initialData);
    } else if (isOpen) {
      setFormData({ nama_distributor: "", telepon: "", alamat: "" });
    }
  }, [initialData, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] sm:max-w-md max-h-[92vh] overflow-y-auto rounded-[1.5rem] md:rounded-[2.5rem] border-none shadow-2xl p-6 md:p-10 bg-white scrollbar-hide">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg md:text-xl font-black uppercase text-gray-800 flex items-center gap-3 tracking-tighter">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-100">
              <Truck className="w-5 h-5" />
            </div>
            {initialData ? "Update Data PBF" : "Registrasi Vendor"}
          </DialogTitle>
        </DialogHeader>
        
        <form 
          className="space-y-4 mt-4" 
          onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}
        >
          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">
              Nama Perusahaan / PBF
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <Input 
                className="h-11 md:h-12 pl-10 rounded-xl md:rounded-2xl border-none bg-gray-50/50 font-bold focus:bg-white transition-all text-sm shadow-sm" 
                placeholder="Contoh: PT. Kimia Farma Trading"
                value={formData.nama_distributor} 
                onChange={(e) => setFormData({...formData, nama_distributor: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">
              Kontak Sales / Kantor
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
              <Input 
                type="tel"
                className="h-11 md:h-12 pl-10 rounded-xl md:rounded-2xl border-none bg-gray-50/50 font-bold focus:bg-white transition-all text-sm shadow-sm" 
                placeholder="0812xxxx atau 021xxxx"
                value={formData.telepon} 
                onChange={(e) => setFormData({...formData, telepon: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">
              Alamat Lengkap Gudang
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
              <Textarea 
                className="rounded-xl md:rounded-2xl border-none bg-gray-50/50 pl-10 pt-2.5 min-h-25 md:min-h-30 font-medium text-sm focus:bg-white transition-all shadow-sm" 
                placeholder="Jl. Raya Utama No. 123, Kawasan Industri..."
                value={formData.alamat} 
                onChange={(e) => setFormData({...formData, alamat: e.target.value})} 
                required 
              />
            </div>
          </div>

          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              className="rounded-xl font-bold text-gray-400 h-11"
            >
              BATAL
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl md:rounded-2xl font-black h-11 md:h-12 px-8 shadow-xl shadow-emerald-100 transition-all active:scale-95 text-[10px] uppercase tracking-widest"
            >
              <Save className="w-4 h-4 mr-2" /> SIMPAN DATA
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}