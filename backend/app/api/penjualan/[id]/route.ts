import { NextResponse } from "next/server";
import prisma from "@/lib/db";

function serializeBigInt(data: any) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

async function getParams(context: any) {
  return await context.params;
}

export async function GET(request: Request, context: any) {
  try {
    const { id } = await getParams(context);

    const penjualan = await prisma.penjualan.findUnique({
      where: { id: BigInt(id) },
      include: {
        pelanggan: true,
        metode_bayar: true,
        jenis_pengiriman: true,
        pengiriman: true,
        details: {
          include: {
            obat: true
          }
        }
      }
    });

    if (!penjualan) {
      return NextResponse.json(
        { success: false, message: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: serializeBigInt(penjualan)
    });

  } catch (error) {
    console.error("Fetch Detail Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}