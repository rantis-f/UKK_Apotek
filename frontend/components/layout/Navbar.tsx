"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Pill, ShoppingCart, User, LogOut, Heart } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        
        {/* SISI KIRI: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-emerald-200 shadow-lg group-hover:scale-110 transition-transform">
            <Pill className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-emerald-900">Ran_Store</span>
        </Link>

        {/* SISI TENGAH: Menu Navigasi (Opsional, pengganti Search) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Beranda</Link>
          <Link href="/catalogue" className="hover:text-emerald-600 transition-colors">Produk</Link>
          <Link href="/promo" className="hover:text-emerald-600 transition-colors">Promo</Link>
          <Link href="/about" className="hover:text-emerald-600 transition-colors">Tentang Kami</Link>
        </div>

        {/* SISI KANAN: Action Buttons */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Wishlist/Heart (Tambahan biar gak sepi) */}
          <Button variant="ghost" size="icon" className="hidden sm:flex text-gray-500 hover:text-red-500">
            <Heart className="w-5 h-5" />
          </Button>

          {/* Keranjang */}
          <Button variant="ghost" size="icon" className="relative text-gray-600 hover:bg-emerald-50 hover:text-emerald-600">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
              0
            </span>
          </Button>

          {/* User Auth Section */}
          <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <p className="text-sm font-bold text-gray-800 leading-none mb-1">{user.name}</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Member</p>
              </div>
              <Button onClick={logout} variant="outline" size="sm" className="border-red-100 text-red-500 hover:bg-red-50 rounded-full px-4">
                <LogOut className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Keluar</span>
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 shadow-md rounded-full px-6 transition-all hover:-translate-y-0.5">
                <User className="w-4 h-4 mr-2" /> Masuk
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}