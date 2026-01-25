import { NextResponse } from "next/server";
import prisma from "@/lib/db";

async function getParams(context: any) { return await context.params; }

export async function PUT(request: Request, context: any) {
  try {
    const { id } = await getParams(context);
    const body = await request.json();
    const data = await prisma.distributor.update({
      where: { id: BigInt(id) },
      data: {
        nama_distributor: body.nama_distributor,
        alamat: body.alamat,
        telepon: body.telp
      }
    });
    return NextResponse.json({ success: true, message: "Berhasil update", data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await getParams(context);
    await prisma.distributor.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true, message: "Berhasil hapus" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal hapus (Sedang dipakai di transaksi)" }, { status: 500 });
  }
}