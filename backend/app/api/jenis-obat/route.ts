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

export async function GET() {
  try {
    const data = await prisma.jenisObat.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(serialize({ success: true, data }));
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal ambil data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");

    if (role !== 'admin' && role !== 'pemilik') {
      return NextResponse.json(
        { success: false, message: "Akses Ditolak: Hanya Admin yang boleh tambah kategori!" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    if (!body.nama_jenis) {
      return NextResponse.json({ success: false, message: "Nama jenis wajib diisi" }, { status: 400 });
    }

    const data = await prisma.jenisObat.create({
      data: {
        jenis: body.nama_jenis,
        deskripsi_jenis: body.deskripsi_jenis || ""
      }
    });
    
    return NextResponse.json(serialize({ 
      success: true, 
      message: "Berhasil tambah jenis", 
      data 
    }), { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server" }, { status: 500 });
  }
}