"use client";
import { ShieldCheck, Truck, HeartPulse } from "lucide-react";

export default function ServiceFeatures() {
  const features = [
    {
      title: "100% Produk Asli",
      desc: "Jaminan uang kembali jika barang palsu.",
      icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    {
      title: "Kirim Express",
      desc: "Sampai dalam 1 jam untuk area kota.",
      icon: <Truck className="w-10 h-10 text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    {
      title: "Konsultasi Gratis",
      desc: "Tanya apoteker kami kapan saja.",
      icon: <HeartPulse className="w-10 h-10 text-orange-600" />,
      bg: "bg-orange-50",
      border: "border-orange-100"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((f, i) => (
        <div key={i} className={`flex items-center gap-4 p-6 ${f.bg} rounded-2xl border ${f.border} hover:shadow-md transition-shadow`}>
          {f.icon}
          <div>
            <h3 className="font-bold text-gray-800">{f.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}