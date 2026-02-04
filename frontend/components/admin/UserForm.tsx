"use client";

import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  Save, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  Check, 
  ChevronsUpDown,
  Users
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// LIST ROLE TERBARU
const roles = [
  { label: "Administrator", value: "admin" },
  { label: "Apoteker", value: "apoteker" },
  { label: "Kasir", value: "kasir" },
  { label: "Karyawan", value: "karyawan" }, // SUDAH DITAMBAHKAN
  { label: "Pemilik", value: "pemilik" },
];

export default function UserForm({ isOpen, onClose, onSubmit, initialData }: any) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    jabatan: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        jabatan: initialData.jabatan || "",
      });
    } else {
      setFormData({ name: "", email: "", password: "", jabatan: "" });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw] rounded-[2.5rem] p-8 md:p-10 border-none shadow-2xl bg-white animate-in zoom-in-95 duration-300">
        
        <DialogHeader className="mb-8 border-b border-gray-50 pb-4">
          <DialogTitle className="text-xl font-black text-gray-800 flex items-center gap-3 uppercase tracking-tight">
            <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-100">
              <UserPlus className="w-5 h-5" />
            </div>
            {initialData ? "Update Data Staff" : "Staff Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
              <User className="w-3 h-3" /> Nama Lengkap
            </label>
            <Input
              required
              placeholder="Nama staff..."
              className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white font-bold text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email
            </label>
            <Input
              required
              type="email"
              placeholder="email@sispare.com"
              className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white font-bold text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
              <Lock className="w-3 h-3" /> {initialData ? "Password Baru" : "Password"}
            </label>
            <Input
              required={!initialData}
              type="password"
              placeholder="••••••••"
              className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white font-bold text-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* --- COMBOBOX JABATAN (DROPUP) --- */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Hak Akses (Role)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full h-12 justify-between rounded-xl bg-gray-50/50 border-gray-100 font-bold text-gray-700 hover:bg-emerald-50 shadow-sm"
                >
                  {formData.jabatan 
                    ? roles.find((r) => r.value === formData.jabatan)?.label 
                    : "Pilih Jabatan..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                side="top" 
                sideOffset={10} 
                className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-none shadow-2xl overflow-hidden bg-white animate-in slide-in-from-bottom-2 duration-300"
              >
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <p className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] bg-gray-50/50">Level Otoritas</p>
                      {roles.map((role) => (
                        <CommandItem
                          key={role.value}
                          onSelect={() => setFormData({ ...formData, jabatan: role.value })}
                          className={cn(
                            "flex items-center justify-between px-4 py-3.5 cursor-pointer",
                            formData.jabatan === role.value 
                              ? "bg-emerald-600 text-white font-bold" 
                              : "text-gray-600 hover:bg-emerald-50"
                          )}
                        >
                          <span className="text-[10px] uppercase tracking-widest font-black">{role.label}</span>
                          {formData.jabatan === role.value && <Check className="w-4 h-4 text-white" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="pt-6">
            <Button 
              type="submit" 
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 transition-all active:scale-95"
            >
              <Save className="w-4 h-4 mr-3" /> {initialData ? "SIMPAN PERUBAHAN" : "DAFTARKAN STAFF"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}