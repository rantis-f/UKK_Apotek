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

export async function GET(request: NextRequest) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");

    const isOwner = role === 'pemilik';
    const isAdmin = role === 'admin';
    const isApoteker = role === 'apoteker';
    const isKasir = role === 'kasir';

    const canSeeFinance = isOwner || isAdmin;
    const canSeeOps = isOwner || isAdmin || isKasir || isApoteker;

    const [
      totalPendapatan,
      jumlahTransaksi,
      jumlahPelanggan,
      jumlahStaff,
      jumlahObat,
      stokMenipis,
      transaksiTerbaru
    ] = await Promise.all([
      canSeeFinance 
        ? prisma.penjualan.aggregate({ 
            _sum: { total_bayar: true }, 
            where: { status_order: 'Selesai' } 
          })
        : { _sum: { total_bayar: 0 } },

      canSeeOps ? prisma.penjualan.count() : 0,

      canSeeFinance ? prisma.pelanggan.count() : 0,

      canSeeFinance ? prisma.user.count() : 0,

      prisma.obat.count(),

      (isOwner || isAdmin || isApoteker)
        ? prisma.obat.findMany({ 
            where: { stok: { lte: 10 } }, 
            take: 5, 
            orderBy: { stok: 'asc' } 
          })
        : [],

      canSeeOps
        ? prisma.penjualan.findMany({ 
            take: 5, 
            orderBy: { id: 'desc' },
            include: { pelanggan: true } 
          })
        : []
    ]);

    const result = {
      success: true,
      data: {
        cards: {
          revenue: canSeeFinance ? (totalPendapatan._sum.total_bayar || 0) : 0,
          total_sales: canSeeOps ? jumlahTransaksi : 0,
          total_customers: canSeeFinance ? jumlahPelanggan : 0,
          total_staff: canSeeFinance ? jumlahStaff : 0,
          total_products: jumlahObat,
        },
        alerts: {
          low_stock: stokMenipis,
        },
        recent_orders: transaksiTerbaru,
        role_access: {
          current_role: role,
          is_finance_authorized: canSeeFinance
        }
      }
    };

    return NextResponse.json(serialize(result));

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server" }, 
      { status: 500 }
    );
  }
}