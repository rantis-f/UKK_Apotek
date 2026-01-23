import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const obat = await prisma.obat.findMany({
      include: {
        jenis_obat: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: obat,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data obat" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_obat, idjenis, harga_jual, stok, foto1 } = body;

    if (!nama_obat || !idjenis || !harga_jual) {
      return NextResponse.json(
        { success: false, message: "Nama, Jenis, dan Harga wajib diisi!" },
        { status: 400 }
      );
    }

    const newObat = await prisma.obat.create({
      data: {
        nama_obat,
        idjenis: BigInt(idjenis),
        harga_jual: Number(harga_jual),
        stok: Number(stok) || 0,
        foto1: foto1 || "default.jpg",
        deskripsi_obat: body.deskripsi_obat || "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Obat berhasil ditambahkan!",
      data: newObat,
    }, { status: 201 });

  } catch (error) {
    console.error("Error create obat:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menambah obat" },
      { status: 500 }
    );
  }
}