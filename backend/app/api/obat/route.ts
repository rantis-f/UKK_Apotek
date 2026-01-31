import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { headers } from "next/headers";

const serialize = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

// GET: Publik
export async function GET() {
  try {
    const obat = await prisma.obat.findMany({
      include: { jenis_obat: true },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json(serialize({ success: true, data: obat }));
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal memuat katalog" }, { status: 500 });
  }
}

// POST: Privat & Terproteksi
export async function POST(request: NextRequest) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role"); // Pastikan ini di-inject oleh Middleware yang valid

    const authorizedRoles = ["admin", "pemilik", "apoteker"];
    
    if (!role || !authorizedRoles.includes(role.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Area khusus staff!" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { nama_obat, idjenis, harga_jual, stok, foto1, deskripsi_obat } = body;

    // Tambahkan validasi dasar di sini (Cybersecurity 101: Never trust user input)
    if (!nama_obat || !idjenis || !harga_jual) {
      return NextResponse.json({ success: false, message: "Data tidak lengkap" }, { status: 400 });
    }

    const newObat = await prisma.obat.create({
      data: {
        nama_obat,
        idjenis: BigInt(idjenis),
        harga_jual: Number(harga_jual),
        stok: Number(stok) || 0,
        foto1: foto1 || "default.jpg",
        deskripsi_obat: deskripsi_obat || "",
      },
    });

    return NextResponse.json(serialize({
      success: true,
      message: "Data obat berhasil disimpan",
      data: newObat,
    }), { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}