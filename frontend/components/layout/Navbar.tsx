"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
    LogOut,
    ShoppingCart,
    Heart,
    User as UserIcon,
    Bell,
    LogIn,
    ChevronDown
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const getInitials = () => {
        if (!user) return "";
        const displayName = user.nama_pelanggan || user.name || "User";
        return displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Obat", href: "/obat" },
        { name: "Promo", href: "/promo" },
        { name: "Tentang Kami", href: "/tentang" },
    ];

    const checkActive = (href: string) => {
        if (href === "/") return pathname === "/";
        if (href === "/obat") return pathname.startsWith("/obat");
        return pathname === href;
    };

    return (
        <nav className="border-b bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-emerald-600 p-2 rounded-xl text-white transition-transform group-hover:scale-110">
                            <span className="font-bold text-xl italic">💊</span>
                        </div>
                        <span className="font-bold text-xl text-emerald-900 tracking-tight">Ran_Store</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const active = checkActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${active ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-500'
                                        }`}
                                >
                                    {link.name}
                                    {active && (
                                        <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {user ? (
                        <>
                            <div className="flex items-center gap-4 text-gray-400 mr-2">
                                <Bell className="w-5 h-5 hover:text-emerald-600 cursor-pointer transition-colors" />
                                <div className="relative group">
                                    <ShoppingCart className="w-5 h-5 group-hover:text-emerald-600 cursor-pointer transition-colors" />
                                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">0</span>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />

                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none flex items-center gap-2 group">
                                    <Avatar className="h-10 w-10 border-2 border-emerald-50 transition-all group-hover:border-emerald-200">
                                        <AvatarFallback className="bg-emerald-500 text-white font-bold">
                                            {getInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 mt-2 p-2 rounded-2xl shadow-2xl border-gray-100 animate-in fade-in slide-in-from-top-2">
                                    <DropdownMenuLabel className="font-normal p-4">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-black text-gray-900 leading-none">
                                                {user.nama_pelanggan || user.name}
                                            </p>
                                            <p className="text-xs text-gray-400 font-medium truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-gray-50" />
                                    <DropdownMenuItem asChild className="p-3 rounded-xl cursor-pointer focus:bg-emerald-50 focus:text-emerald-600">
                                        <Link href="/profile" className="flex items-center w-full font-bold text-xs uppercase tracking-widest">
                                            <UserIcon className="mr-3 h-4 w-4" />
                                            <span>Profile Saya</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-gray-50" />
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="p-3 rounded-xl cursor-pointer focus:bg-red-50 text-red-600 font-bold text-xs uppercase tracking-widest"
                                    >
                                        <LogOut className="mr-3 h-4 w-4" />
                                        <span>Keluar Aplikasi</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" className="text-emerald-600 font-black text-xs uppercase tracking-widest hover:bg-emerald-50 rounded-xl">
                                    Masuk
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100 px-6">
                                    Daftar
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}