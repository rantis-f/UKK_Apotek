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
import { Label } from "@/components/ui/label";
import {
  UserPlus, Save, Mail, Lock, User,
  ShieldCheck, Check, ChevronsUpDown, X
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

const roles = [
  { label: "Administrator", value: "admin" },
  { label: "Apoteker", value: "apoteker" },
  { label: "Kasir", value: "kasir" },
  { label: "Karyawan", value: "karyawan" },
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
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        password: "",
        jabatan: initialData.jabatan || "",
      });
    } else if (isOpen) {
      setFormData({ name: "", email: "", password: "", jabatan: "" });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[96vw] max-h-[92vh] overflow-y-auto rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 border-none shadow-2xl bg-white scrollbar-hide">
        <DialogHeader className="mb-4 md:mb-8 border-b border-gray-50 pb-4">
          <DialogTitle className="text-lg md:text-xl font-black text-gray-800 flex items-center gap-3 uppercase tracking-tighter">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            {initialData ? "Update Akses" : "Staff Baru"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 flex items-center gap-2">
              <User className="w-3 h-3" /> Nama Lengkap
            </Label>
            <Input
              required
              placeholder="Input nama staff..."
              className="h-11 md:h-12 rounded-xl border-none bg-gray-50/50 focus:bg-white font-bold text-sm transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Alamat Email
            </Label>
            <Input
              required
              type="email"
              placeholder="staff@apotek.com"
              className="h-11 md:h-12 rounded-xl border-none bg-gray-50/50 focus:bg-white font-bold text-sm transition-all"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 flex items-center gap-2">
              <Lock className="w-3 h-3" /> {initialData ? "Ganti Password" : "Password Utama"}
            </Label>
            <Input
              required={!initialData}
              type="password"
              placeholder="••••••••"
              className="h-11 md:h-12 rounded-xl border-none bg-gray-50/50 focus:bg-white font-bold text-sm transition-all"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {initialData && <p className="text-[8px] text-gray-400 font-bold ml-1 uppercase italic">*Kosongkan jika tidak ingin ganti</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Level Otoritas
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 md:h-12 justify-between rounded-xl bg-gray-50/50 border-none font-bold text-gray-700 hover:bg-emerald-50 shadow-sm text-xs"
                >
                  {formData.jabatan
                    ? roles.find((r) => r.value === formData.jabatan)?.label
                    : "Pilih Jabatan..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-30" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                sideOffset={10}
                className="w-(--radix-popover-trigger-width) p-0 rounded-2xl border-none shadow-2xl overflow-hidden bg-white"
              >
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <p className="px-4 py-3 text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">Level Akses</p>
                      {roles.map((role) => (
                        <CommandItem
                          key={role.value}
                          onSelect={() => setFormData({ ...formData, jabatan: role.value })}
                          className={cn(
                            "flex items-center justify-between px-4 py-3.5 cursor-pointer text-[10px] font-black uppercase tracking-tight",
                            formData.jabatan === role.value ? "bg-emerald-600 text-white" : "text-gray-600"
                          )}
                        >
                          {role.label}
                          {formData.jabatan === role.value && <Check className="w-4 h-4" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="pt-4 flex flex-col-reverse md:flex-row gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full md:w-auto rounded-xl font-bold text-gray-400 text-[10px] uppercase tracking-widest"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 md:h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 transition-all active:scale-95"
            >
              <Save className="w-4 h-4 mr-3" /> {initialData ? "Simpan Perubahan" : "Daftarkan Staff"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}