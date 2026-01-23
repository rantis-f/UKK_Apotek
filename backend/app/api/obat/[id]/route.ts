import { NextResponse } from "next/server";
import prisma from "@/lib/db";

async function getParams(context: any) {
    return await context.params;
}

export async function GET(request: Request, context: any) {
  try {
    const { id } = await getParams(context);

    const obat = await prisma.obat.findUnique({
      where: { id: BigInt(id) },
      include: { jenis_obat: true },
    });

    if (!obat) {
      return NextResponse.json({ success: false, message: "Obat tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: obat });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error server" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const { id } = await getParams(context);
    const body = await request.json();

    const checkObat = await prisma.obat.findUnique({ where: { id: BigInt(id) } });
    if (!checkObat) {
        return NextResponse.json({ success: false, message: "Obat tidak ditemukan" }, { status: 404 });
    }

    const updatedObat = await prisma.obat.update({
      where: { id: BigInt(id) },
      data: {
        nama_obat: body.nama_obat,
        harga_jual: body.harga_jual ? Number(body.harga_jual) : undefined,
        stok: body.stok ? Number(body.stok) : undefined,
        idjenis: body.idjenis ? BigInt(body.idjenis) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Obat berhasil diupdate!",
      data: updatedObat,
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal update obat" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = await getParams(context);

    const checkObat = await prisma.obat.findUnique({ where: { id: BigInt(id) } });
    if (!checkObat) {
        return NextResponse.json({ success: false, message: "Obat tidak ditemukan" }, { status: 404 });
    }
    await prisma.obat.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Obat berhasil dihapus!",
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal hapus obat (Mungkin sedang dipakai di transaksi)" }, { status: 500 });
  }
}