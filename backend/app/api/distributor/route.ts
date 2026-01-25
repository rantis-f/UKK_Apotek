import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const data = await prisma.distributor.findMany();
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await prisma.distributor.create({
      data: {
        nama_distributor: body.nama_distributor,
        alamat: body.alamat,
        telepon: body.telp
      }
    });
    return NextResponse.json({ success: true, message: "Berhasil tambah distributor", data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal tambah data" }, { status: 500 });
  }
}