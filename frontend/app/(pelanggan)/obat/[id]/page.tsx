import { obatService } from "@/services/obat.service";
import ProductGallery from "@/components/shop/ProductGallery";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import BuyButton from "@/components/shop/BuyButton";

export default async function DetailObatPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  const response = await obatService.getById(id); 
  
  const product = response?.data;

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="font-bold text-gray-400 uppercase tracking-widest">Obat Tidak Ditemukan</p>
        <Link href="/obat">
          <Button variant="outline" className="rounded-xl">Kembali ke Katalog</Button>
        </Link>
      </div>
    );
  }

  const images = [product.foto1, product.foto2, product.foto3].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <Link href="/obat" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        <ProductGallery images={images} />

        <div className="space-y-8">
          <div className="space-y-3">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              {product.jenis_obat?.jenis || "Umum"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              {product.nama_obat}
            </h1>
            <p className="text-3xl font-black text-emerald-600">
              {formatRupiah(product.harga_jual)}
            </p>
          </div>

          <div className="bg-gray-50/50 p-6 md:p-8 rounded-[2.5rem] border border-gray-100 space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deskripsi</p>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {product.deskripsi_obat || "Belum ada deskripsi untuk produk ini."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Jaminan Original
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <Truck className="w-5 h-5 text-emerald-500" /> Stok: {product.stok}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <BuyButton productId={product.id.toString()} />
            
            <Button variant="outline" className="h-16 px-10 rounded-2xl border-2 border-gray-100 font-bold text-gray-400 hover:text-emerald-600 hover:border-emerald-100 transition-all active:scale-95">
              Konsultasi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}