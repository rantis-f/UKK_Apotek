"use client";

import Link from "next/link";
import { Pill, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-emerald-600 text-white p-1.5 rounded-lg shadow-emerald-200 shadow-md">
                <Pill className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-emerald-900">Ran_Store</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Solusi kesehatan digital terpercaya. Kami menyediakan obat-obatan asli, vitamin, dan alat kesehatan berkualitas dengan pelayanan cepat untuk Anda.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-emerald-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Kategori Belanja</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Obat Bebas</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Vitamin & Suplemen</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Alat Kesehatan</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Perawatan Tubuh</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Bantuan & Info</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-emerald-600 transition-colors">Cara Belanja</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Jl. Kesehatan No. 123, Jakarta Selatan, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>support@ranstore.me</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            &copy; 2026 Ran_Store Healthcare. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-6">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}