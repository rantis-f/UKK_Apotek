import { NextResponse } from "next/server";
import prisma from "@/lib/db";

const serializeData = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

export async function GET() {
  try {
    const dataRestock = await prisma.pembelian.findMany({
      include: {
        distributor: true,
        details: {
          include: { obat: true },
        },
      },
      orderBy: {
        tgl_pembelian: "desc",
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: serializeData(dataRestock) 
    });
  } catch (error) {
    console.error("GET Restock Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil riwayat stok" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { nonota, tgl_pembelian, id_distributor, items, total_bayar } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Daftar obat tidak boleh kosong!" },
        { status: 400 }
      );
    }

    const hasil = await prisma.$transaction(async (tx) => {
      const pembelianBaru = await tx.pembelian.create({
        data: {
          nonota: nonota,
          tgl_pembelian: new Date(tgl_pembelian),
          total_bayar: Number(total_bayar),
          id_distributor: BigInt(id_distributor),
          details: {
            create: items.map((item: any) => ({
              id_obat: BigInt(item.id_obat),
              jumlah_beli: Number(item.jumlah_beli),
              harga_beli: Number(item.harga_beli),
              subtotal: Number(item.subtotal),
            })),
          },
        },
        include: { details: true },
      });

      for (const item of items) {
        await tx.obat.update({
          where: { id: BigInt(item.id_obat) },
          data: {
            stok: {
              increment: Number(item.jumlah_beli),
            },
          },
        });
      }

      return pembelianBaru;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Transaksi berhasil! Stok obat telah bertambah.",
        data: serializeData(hasil),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Restock POST Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memproses transaksi: " + error.message },
      { status: 500 }
    );
  }
}