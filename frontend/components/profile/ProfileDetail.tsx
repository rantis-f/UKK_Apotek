"use client";

import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Map,
  Home,
  Briefcase,
  Navigation
} from "lucide-react";

export default function ProfileDetail() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm animate-pulse flex flex-col items-center">
        <div className="h-24 w-24 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-gray-100 rounded mb-2"></div>
        <div className="h-3 w-32 bg-gray-50 rounded"></div>
      </div>
    );
  }

  const displayName = user.nama_pelanggan || user.name || "User";
  const displayRole = user.jabatan || "MEMBER";

  const formatFullAddress = (addr?: string, city?: string, prov?: string, zip?: string) => {
    if (!addr && !city && !prov) return null;

    const parts = [
      addr,
      city,
      prov ? `Prov. ${prov}` : null,
      zip ? `[${zip}]` : null
    ].filter(Boolean);

    return (
      <div className="space-y-1">
        <p className="text-sm text-gray-700 font-semibold leading-relaxed">
          {addr || "Alamat jalan belum diisi"}
        </p>
        <p className="text-[11px] text-gray-500 font-medium">
          {parts.slice(1).join(" • ")}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm space-y-10">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
        <Avatar className="h-28 w-28 border-[6px] border-emerald-50 shadow-md">
          <AvatarImage src={user.foto || ""} />
          <AvatarFallback className="bg-emerald-600 text-white font-bold text-3xl">
            {displayName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center md:text-left space-y-3 flex-1">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{displayName}</h2>
            <div className="mt-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase tracking-widest border border-emerald-200">
                {displayRole}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 pt-2 text-sm text-gray-500 font-medium">
            <div className="flex items-center justify-center md:justify-start gap-2 group">
              <Mail className="w-4 h-4 text-emerald-500" />
              <span className="group-hover:text-emerald-600 transition-colors">{user.email}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 group">
              <Phone className="w-4 h-4 text-emerald-500" />
              <span className="group-hover:text-emerald-600 transition-colors">{user.no_telp || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {!user.jabatan && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              Buku Alamat Pengiriman
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="relative p-6 bg-emerald-50/40 rounded-[2rem] border-2 border-emerald-200 transition-all hover:bg-emerald-50">
              <div className="absolute -top-3 left-6 bg-emerald-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-sm uppercase">
                Utama
              </div>
              <Home className="w-5 h-5 text-emerald-600 mb-4" />
              {formatFullAddress(user.alamat1, user.kota1, user.propinsi1, user.kodepos1) || (
                <p className="text-xs text-gray-400 italic">Alamat utama belum diatur</p>
              )}
            </div>

            <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:border-emerald-200 hover:bg-white transition-all">
              <Briefcase className="w-5 h-5 text-gray-400 mb-4" />
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Alamat 2</p>
              {formatFullAddress(user.alamat2, user.kota2, user.propinsi2, user.kodepos2) || (
                <p className="text-xs text-gray-400 italic">Belum ditambahkan</p>
              )}
            </div>

            <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:border-emerald-200 hover:bg-white transition-all">
              <Navigation className="w-5 h-5 text-gray-400 mb-4" />
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Alamat 3</p>
              {formatFullAddress(user.alamat3, user.kota3, user.propinsi3, user.kodepos3) || (
                <p className="text-xs text-gray-400 italic">Belum ditambahkan</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!user.jabatan && (
        <div className="bg-emerald-900 rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-xl shadow-emerald-100/50 relative overflow-hidden group">
          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md group-hover:bg-white/20 transition-colors">
              <FileText className="w-7 h-7 text-emerald-300" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.2em] mb-1">Status Dokumen</p>
              <h4 className="font-bold text-lg text-white">Identitas KTP</h4>
              <p className="text-[11px] opacity-70 mt-1">
                {user.url_ktp ? "Dokumen tersedia dan sudah diverifikasi." : "Mohon unggah KTP untuk syarat pembelian obat tertentu."}
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-0 relative z-10">
            {user.url_ktp ? (
              <a
                href={user.url_ktp}
                target="_blank"
                className="bg-white text-emerald-900 px-6 py-3 rounded-xl text-[10px] font-black hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg"
              >
                LIHAT DOKUMEN <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <div className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-[10px] font-black">
                DOKUMEN KOSONG
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        </div>
      )}

    </div>
  );
}