"use client";

import { useAuth } from "@/hooks/useAuth";
import {
    LogOut,
    ShoppingCart,
    Heart,
    User as UserIcon,
    Bell
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

export default function Navbar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const displayName = user.nama_pelanggan || user.name || "User";
    const displayRole = user.jabatan || "MEMBER";

    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                {/* POJOK KIRI: LOGO */}
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-emerald-600 p-2 rounded-xl text-white">
                            <span className="font-bold text-xl italic">💊</span>
                        </div>
                        <span className="font-bold text-xl text-emerald-900 tracking-tight">Ran_Store</span>
                    </Link>

                    {/* MENU TENGAH */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Beranda</Link>
                        <Link href="/produk" className="hover:text-emerald-600 transition-colors">Produk</Link>
                        <Link href="/promo" className="hover:text-emerald-600 transition-colors">Promo</Link>
                        <Link href="/tentang" className="hover:text-emerald-600 transition-colors">Tentang Kami</Link>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-4 text-gray-400 mr-2">
                        <Bell className="w-5 h-5 hover:text-emerald-600 cursor-pointer" />
                        <Heart className="w-5 h-5 hover:text-red-500 cursor-pointer" />
                        <div className="relative">
                            <ShoppingCart className="w-5 h-5 hover:text-emerald-600 cursor-pointer" />
                            <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">0</span>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />

                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                            <div className="flex items-center group">
                                <Avatar className="h-10 w-10 border-2 border-emerald-50">
                                    <AvatarFallback className="bg-emerald-500 text-white font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-xl border-gray-100">
                            <DropdownMenuLabel className="font-normal p-4">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-bold leading-none text-gray-900">{displayName}</p>
                                    <p className="text-xs leading-none text-gray-500">{user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild className="cursor-pointer p-3 focus:bg-emerald-50 focus:text-emerald-600">
                                <Link href="/profile" className="flex items-center w-full">
                                    <UserIcon className="mr-3 h-4 w-4" />
                                    <span>Profile Saya</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={logout}
                                className="cursor-pointer p-3 text-red-600 focus:bg-red-50 focus:text-red-600"
                            >
                                <LogOut className="mr-3 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </nav>
    );
}