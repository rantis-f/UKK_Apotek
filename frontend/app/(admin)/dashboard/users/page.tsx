"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth"; 
import { toast } from "sonner";
import { userService } from "@/services/user.service";
import { 
  UserCog, Plus, Search, Loader2, Trash2, 
  UserX, ShieldCheck, Check, ChevronsUpDown, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import UserTable from "@/components/admin/UserTable";
import UserForm from "@/components/admin/UserForm";

// Opsi Jabatan untuk Filter - SEKARANG ADA KARYAWAN
const roles = [
  { label: "Semua Jabatan", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Apoteker", value: "apoteker" },
  { label: "Kasir", value: "kasir" },
  { label: "Karyawan", value: "karyawan" }, // Tambahan Baru
  { label: "Pemilik", value: "pemilik" },
];

export default function ManajemenUserPage() {
  const { token } = useAuth();
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await userService.getAll(token); 
      setUsers(res.data || []); 
    } catch (error: any) {
      toast.error(error.message || "Gagal sinkron data staff");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const list = Array.isArray(users) ? users : [];
    return list.filter((u: any) => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = roleFilter === "all" || u.jabatan?.toLowerCase() === roleFilter.toLowerCase();
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const handleSave = async (data: any) => {
    if (!token) return;
    try {
      if (selectedUser) {
        await userService.update(token, selectedUser.id, data);
        toast.success("Akun staff diperbarui");
      } else {
        await userService.create(token, data);
        toast.success("Staff baru ditambahkan");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteClick = (id: string) => {
    setIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete || !token) return;
    setDeleteLoading(true);
    const toastId = toast.loading("Menghapus akun staff...");
    
    try {
      await userService.delete(token, idToDelete);
      toast.success("Akun berhasil dihapus", { id: toastId });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus akun", { id: toastId });
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setIdToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 px-4 md:px-0">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-50">
        <div className="flex items-center gap-5">
          <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-xl shadow-emerald-100 ring-1 ring-white/20">
            <UserCog className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600">Access Control</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">Manajemen Staff</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total {users.length} Personel Terdaftar</p>
          </div>
        </div>
        <Button 
          onClick={() => { setSelectedUser(null); setIsModalOpen(true); }} 
          className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-black px-8 h-12 md:h-14 shadow-lg shadow-emerald-100 transition-all active:scale-95 text-xs tracking-widest text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> TAMBAH STAFF
        </Button>
      </div>

      {/* --- SEARCH & FILTER BAR --- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative group flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari nama atau email staff..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-8 py-4 bg-white border-2 border-transparent rounded-[1.5rem] focus:border-emerald-500 outline-none shadow-sm font-bold text-sm transition-all text-gray-700"
          />
        </div>

        {/* COMBOBOX NO SEARCH */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="h-[60px] md:w-64 rounded-[1.5rem] border-2 border-transparent bg-white shadow-sm px-6 hover:border-emerald-500 transition-all flex justify-between items-center group"
            >
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-600">
                  {roles.find(r => r.value === roleFilter)?.label}
                </span>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-gray-300" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0 rounded-[1.5rem] border-none shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" align="end">
            <Command>
              <CommandList>
                <CommandGroup>
                  <p className="px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">Filter Jabatan</p>
                  {roles.map((role) => (
                    <CommandItem
                      key={role.value}
                      onSelect={() => setRoleFilter(role.value)}
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors
                        ${roleFilter === role.value ? "bg-emerald-600 text-white font-bold" : "text-gray-600 hover:bg-emerald-50"}
                      `}
                    >
                      <span className="text-[10px] uppercase tracking-widest">{role.label}</span>
                      {roleFilter === role.value && <Check className="w-3.5 h-3.5 text-white" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="animate-spin text-emerald-600 h-10 w-10 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Sinkronisasi Staff...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <UserTable 
              data={filteredUsers} 
              onEdit={(u: any) => { setSelectedUser(u); setIsModalOpen(true); }} 
              onDelete={handleDeleteClick} 
            />
          ) : (
            <div className="py-32 text-center flex flex-col items-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <UserX className="w-12 h-12 text-gray-200" />
              </div>
              <h3 className="text-gray-400 font-black uppercase tracking-widest text-xs">Staff Tidak Ditemukan</h3>
            </div>
          )}
        </div>
      </div>

      <UserForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSave} initialData={selectedUser} />

      {/* --- ALERT DELETE --- */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none p-8 md:p-12 bg-white shadow-2xl animate-in zoom-in-95 duration-300">
          <AlertDialogHeader>
            <div className="mx-auto bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <AlertDialogTitle className="font-black text-2xl text-center uppercase tracking-tight text-gray-800">Hapus Akses Staff?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-500 font-medium">
              Akses akun ini akan dicabut secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 mt-10">
            <AlertDialogCancel className="flex-1 rounded-2xl border-none bg-gray-100 font-black text-xs h-14 uppercase tracking-widest text-gray-500">BATAL</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 rounded-2xl font-black h-14 shadow-lg shadow-red-100 transition-all text-white text-xs uppercase tracking-widest">
              {deleteLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "YA, HAPUS"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}