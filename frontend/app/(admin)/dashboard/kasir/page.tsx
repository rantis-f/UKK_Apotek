"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, ShoppingBag, CreditCard, Loader2 } from "lucide-react";
import { kasirService } from "@/services/kasir.service";
import { ProductCard } from "@/components/kasir/ProductCard";
import { CartItem } from "@/components/kasir/CartItem";
import { getCookie } from "cookies-next";

export default function KasirPage() {
  const [obats, setObats] = useState([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
  const token = getCookie("token") as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await kasirService.getAllProducts(token);
        if (res.success) {
          setObats(res.data);
        }
      } catch (error: any) {
        toast.error("Gagal memuat data obat: " + error.message);
      }
    };
    if (token) loadData();
  }, [token]);

  const addToCart = (obat: any) => {
    const existing = cart.find((i) => i.id === obat.id);
    if (existing) {
      if (existing.qty >= obat.stok) return toast.error("Stok habis!");
      updateQty(obat.id, 1);
    } else {
      setCart([...cart, { ...obat, qty: 1 }]);
      toast.success(`${obat.nama_obat} ditambah`);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Keranjang masih kosong");
    
    setLoading(true);
    const payload = {
      id_pelanggan: "1",
      id_metode_bayar: "1",
      id_jenis_kirim: "1",
      items: cart.map((i) => ({ id_obat: i.id, jumlah: i.qty })),
      ongkos_kirim: 0,
    };

    try {
      const res = await kasirService.checkout(token, payload);
      if (res.success) {
        toast.success("Transaksi Berhasil Disimpan!");
        setCart([]);
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat checkout");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((acc, i) => acc + i.harga_jual * i.qty, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 h-[calc(100vh-100px)] bg-gray-50/50">
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="relative group">
          <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Cari nama obat yang tersedia..."
            className="w-full pl-12 pr-4 py-3.5 rounded-[1.5rem] border-none shadow-sm focus:ring-2 focus:ring-blue-500 font-bold text-xs"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-10 scrollbar-hide">
          {obats
            .filter((o: any) => o.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((o: any) => (
              <ProductCard key={o.id} obat={o} onAdd={addToCart} />
            ))}
        </div>
      </div>

      <div className="w-full lg:w-96 bg-white rounded-[2.5rem] shadow-xl p-6 flex flex-col border border-gray-100">
        <div className="flex items-center gap-3 mb-6 font-black text-gray-800 uppercase tracking-tighter">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-100">
            <ShoppingBag size={18} />
          </div>
          RINGKASAN PESANAN
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 scrollbar-hide">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-20 py-20">
              <ShoppingBag size={48} className="mb-2" />
              <p className="font-black text-[10px] uppercase tracking-widest">Keranjang Kosong</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQty={updateQty}
                onRemove={removeFromCart}
              />
            ))
          )}
        </div>

        <div className="pt-6 border-t-2 border-dashed border-gray-100 space-y-4">
          <div className="flex justify-between items-center px-2">
            <div className="flex flex-col">
              <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Total Bayar</span>
              <span className="text-[9px] text-gray-300 font-bold italic">*Sudah termasuk pajak & biaya app</span>
            </div>
            <span className="font-black text-2xl text-blue-600 tracking-tighter">
              Rp {total.toLocaleString()}
            </span>
          </div>

          <button
            disabled={loading || cart.length === 0}
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-blue-100 flex items-center justify-center gap-3 uppercase text-[11px] tracking-widest transition-all active:scale-95 disabled:shadow-none"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CreditCard size={18} />
            )}
            {loading ? "MEMPROSES..." : "SELESAIKAN PEMBAYARAN"}
          </button>
        </div>
      </div>
    </div>
  );
}