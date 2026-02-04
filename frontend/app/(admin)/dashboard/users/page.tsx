"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { userService } from "@/services/user.service";
import {
  UserCog, Plus, Search, Loader2, Trash2, Edit3,
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

const roles = [
  { label: "Semua Jabatan", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Apoteker", value: "apoteker" },
  { label: "Kasir", value: "kasir" },
  { label: "Karyawan", value: "karyawan" },
  { label: "Pemilik", value: "pemilik" },
];

export default function ManajemenUserPage() {
  const { token } = useAuth();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isMounted, setIsMounted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getRoleStyle = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-red-50 text-red-600 border-red-100';
      case 'pemilik': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'apoteker': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'kasir': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  useEffect(() => { setIsMounted(true); }, []);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await userService.getAll(token);
      setUsers(res.data || []);
    } catch (error: any) {
      toast.error("Gagal sinkronisasi data staff");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isMounted) fetchUsers();
  }, [isMounted, fetchUsers]);

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
      toast.error("Gagal menyimpan data");
    }
  };

  const confirmDelete = async () => {
    if (!idToDelete || !token) return;
    setDeleteLoading(true);
    try {
      await userService.delete(token, idToDelete);
      toast.success("Akses staff dihapus");
      fetchUsers();
    } catch (error: any) {
      toast.error("Gagal menghapus akun");
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setIdToDelete(null);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-700 pb-24 px-1 md:px-0">

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto">
          <div className="bg-emerald-600 p-2.5 md:p-4 rounded-xl md:rounded-2xl text-white shadow-xl shadow-emerald-100 shrink-0">
            <UserCog className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm md:text-2xl font-black text-gray-800 uppercase tracking-tight leading-none truncate">Manajemen Staff</h1>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total {users.length} Personel</p>
          </div>
        </div>
        <Button
          onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 rounded-xl md:rounded-2xl font-black h-11 md:h-14 px-8 shadow-xl shadow-emerald-100 transition-all active:scale-95 text-[10px] uppercase tracking-widest text-white"
        >
          <Plus className="w-4 h-4 mr-1 md:mr-2" /> TAMBAH STAFF
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
        <div className="relative group flex-1">
          <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 md:pl-14 pr-4 py-3 md:py-4 bg-white border-none rounded-xl md:rounded-[1.5rem] focus:ring-2 focus:ring-emerald-500/10 outline-none shadow-sm font-bold text-sm transition-all text-gray-700"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-11 md:h-15 md:w-64 rounded-xl md:rounded-[1.5rem] border-none bg-white shadow-sm px-4 md:px-6 hover:bg-emerald-50 transition-all flex justify-between items-center group"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 truncate">
                  {roles.find(r => r.value === roleFilter)?.label}
                </span>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-gray-300" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) md:w-64 p-0 rounded-xl md:rounded-[1.5rem] border-none shadow-2xl overflow-hidden" align="end">
            <Command>
              <CommandList>
                <CommandGroup>
                  <p className="px-4 py-3 text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">Filter Jabatan</p>
                  {roles.map((role) => (
                    <CommandItem
                      key={role.value}
                      onSelect={() => setRoleFilter(role.value)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 cursor-pointer text-[10px] uppercase font-black",
                        roleFilter === role.value ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-emerald-50"
                      )}
                    >
                      {role.label}
                      {roleFilter === role.value && <Check className="w-3.5 h-3.5" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin text-emerald-600 h-8 w-8 mb-4" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">Syncing Database...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <>
            <div className="md:hidden divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between active:bg-emerald-50/50 transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black uppercase shadow-sm border border-emerald-100">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-gray-800 text-[13px] uppercase tracking-tight truncate leading-tight">{user.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter border",
                          getRoleStyle(user.jabatan)
                        )}>
                          {user.jabatan}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button onClick={() => { setSelectedUser(user); setIsModalOpen(true); }} size="icon" variant="ghost" className="h-9 w-9 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                      <Edit3 size={14} />
                    </Button>
                    <Button onClick={() => { setIdToDelete(user.id); setIsDeleteDialogOpen(true); }} size="icon" variant="ghost" className="h-9 w-9 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <UserTable
                data={filteredUsers}
                onEdit={(u: any) => { setSelectedUser(u); setIsModalOpen(true); }}
                onDelete={(id: string) => { setIdToDelete(id); setIsDeleteDialogOpen(true); }}
              />
            </div>
          </>
        ) : (
          <div className="py-24 text-center flex flex-col items-center">
            <UserX className="w-12 h-12 text-gray-100 mb-3" />
            <h3 className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Staff Tidak Ditemukan</h3>
          </div>
        )}
      </div>

      <UserForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSave} initialData={selectedUser} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[92vw] max-w-sm rounded-[2rem] border-none p-6 md:p-10 bg-white shadow-2xl">
          <AlertDialogHeader>
            <div className="mx-auto bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50/50">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <AlertDialogTitle className="font-black text-xl text-center uppercase tracking-tighter text-gray-800 leading-tight">Cabut Akses Staff?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[11px] text-gray-500 font-medium leading-relaxed mt-2">
              Akun ini akan dihapus secara permanen. Personel tidak akan bisa lagi mengakses sistem apotek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 mt-8">
            <AlertDialogCancel className="flex-1 rounded-xl border-none bg-gray-100 font-black text-[10px] h-11 uppercase tracking-widest text-gray-400">BATAL</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl font-black h-11 shadow-lg shadow-red-100 transition-all text-white text-[10px] uppercase tracking-widest">
              {deleteLoading ? "..." : "YA, HAPUS"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}