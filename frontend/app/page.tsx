"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import ProductCard from "@/components/products/ProductCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const dummyProducts = [
  { id: 1, name: "Paracetamol 500mg", price: 12500, category: "Obat Bebas", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500" },
  { id: 2, name: "Vitamin C 1000mg", price: 45000, category: "Vitamin", image: "https://images.unsplash.com/photo-1616671285442-16788223659a?w=500" },
  { id: 3, name: "Sanmol Syrup Anak", price: 32000, category: "Obat Bebas", image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500" },
  { id: 4, name: "Termometer Digital", price: 65000, category: "Alat Kesehatan", image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=500" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        {/* 1. Hero Banner */}
        <Hero />

        {/* 2. Tiga Kotak Fitur Layanan */}
        <ServiceFeatures />

        {/* 3. Katalog Produk */}
        <section className="container mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Produk Terlaris</h2>
              <p className="text-gray-500 text-sm">Pilihan terbaik untuk kesehatan Anda</p>
            </div>
            <Link href="/catalogue" className="text-emerald-600 font-bold flex items-center gap-1 hover:underline text-sm md:text-base">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {dummyProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}