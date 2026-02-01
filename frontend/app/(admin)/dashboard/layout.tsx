"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ShieldCheck,
  Users,
  History,
  LogOut,
  Menu,
  Pill,
  Bell,
  User,
  ShoppingBag,
  FolderTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.nama_pelanggan || "User";

  const menus = useMemo(() => {
    const role = user?.role || ""; 
    const baseMenu = [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }];

    if (role === "pelanggan") {
      return [
        ...baseMenu,
        { name: "Belanja", href: "/dashboard/shop", icon: ShoppingBag },
        { name: "Pesanan Saya", href: "/dashboard/pesanan", icon: History },
      ];
    }

    const items = [...baseMenu];

    if (["kasir", "admin", "pemilik"].includes(role)) {
      items.push({ name: "Kasir", href: "/dashboard/kasir", icon: ShoppingCart });
    }

    if (["apoteker", "admin", "pemilik"].includes(role)) {
      items.push(
        { name: "Data Obat", href: "/dashboard/obat", icon: Pill },
        { name: "Jenis Obat", href: "/dashboard/jenis-obat", icon: FolderTree },
        { name: "Stok Masuk", href: "/dashboard/restock", icon: Package }
      );
    }

    if (["admin", "pemilik"].includes(role)) {
      items.push(
        { name: "Data Pelanggan", href: "/dashboard/pelanggan", icon: Users },
        { name: "Manajemen User", href: "/dashboard/users", icon: ShieldCheck }
      );
    }

    items.push({ name: "Riwayat Transaksi", href: "/dashboard/transaksi", icon: History });
    
    return items;
  }, [user?.role]);

  const getPageTitle = () => {
    const segment = pathname.split("/").pop();
    if (segment === "dashboard") return "Overview Statistik";
    if (segment === "jenis-obat") return "Manajemen Jenis Obat";
    if (segment === "obat") return "Katalog Obat";
    if (segment === "kasir") return "Point of Sales";
    return segment?.replace(/-/g, " ") || "Dashboard";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-950 text-white border-r border-zinc-800">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800/50">
        <Pill className="w-6 h-6 text-emerald-500 mr-2" />
        <span className="font-bold text-lg tracking-tight bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          {user?.role === "pelanggan" ? "Ran_Apotek" : "Ran_Admin"}
        </span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {menus.map((menu) => {
          const isActive = pathname === menu.href || (menu.href !== "/dashboard" && pathname.startsWith(menu.href));
          
          return (
            <Link key={menu.href} href={menu.href} onClick={() => setIsMobileOpen(false)}>
              <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 ring-1 ring-emerald-400/20"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}>
                <menu.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-zinc-500 group-hover:text-emerald-400"}`} />
                {menu.name}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <aside className="hidden md:block w-72 fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 bg-zinc-950 border-zinc-800 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <main className="flex-1 md:ml-72 min-h-screen flex flex-col transition-all duration-300">
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileOpen(true)}>
              <Menu className="w-5 h-5 text-gray-600" />
            </Button>
            <h1 className="text-sm font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-emerald-600 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-gray-100 hover:ring-emerald-100 transition-all p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${displayName}&background=10b981&color=fff`} />
                    <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer flex items-center w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil Saya</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar Akun</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}