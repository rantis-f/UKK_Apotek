import { NextResponse } from "next/server";
import prisma from "@/lib/db";

function serializeBigInt(data: any) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET() {
  try {
    const dataPenjualan = await prisma.penjualan.findMany({
      include: {
        pelanggan: true,
        metode_bayar: true,
        jenis_pengiriman: true,
        details: {
          include: {
            obat: true
          }
        }
      },
      orderBy: {
        tgl_penjualan: "desc"
      }
    });

    return NextResponse.json({
      success: true,
      data: serializeBigInt(dataPenjualan)
    });
  } catch (error) {
    console.error("GET Penjualan Error:", error);
    return NextResponse.json({ success: false, message: "Gagal mengambil riwayat" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      id_pelanggan, 
      id_metode_bayar, 
      id_jenis_kirim, 
      items, 
      ongkos_kirim 
    } = body;

    const result = await prisma.$transaction(async (tx) => {
      let totalBelanja = 0;
      const detailData = [];

      for (const item of items) {
        const obat = await tx.obat.findUnique({
          where: { id: BigInt(item.id_obat) }
        });

        if (!obat) throw new Error(`Obat ID ${item.id_obat} tidak ditemukan`);
        if (Number(obat.stok) < item.jumlah) {
          throw new Error(`Stok obat '${obat.nama_obat}' tidak mencukupi! (Sisa: ${obat.stok})`);
        }

        const subtotal = Number(obat.harga_jual) * item.jumlah;
        totalBelanja += subtotal;

        detailData.push({
          id_obat: obat.id,
          jumlah_beli: item.jumlah,
          harga_beli: Number(obat.harga_jual),
          subtotal: subtotal
        });

        // 2. Potong Stok Obat
        await tx.obat.update({
          where: { id: obat.id },
          data: { stok: { decrement: item.jumlah } }
        });
      }

      const biayaApp = 1000; // Biar kayak aplikasi pro
      const ongkir = Number(ongkos_kirim) || 0;
      const grandTotal = totalBelanja + ongkir + biayaApp;

      // 3. Simpan data ke tabel Penjualan
      const penjualanBaru = await tx.penjualan.create({
        data: {
          tgl_penjualan: new Date(),
          id_pelanggan: BigInt(id_pelanggan),
          id_metode_bayar: BigInt(id_metode_bayar),
          id_jenis_kirim: BigInt(id_jenis_kirim),
          ongkos_kirim: ongkir,
          biaya_app: biayaApp,
          total_bayar: grandTotal,
          status_order: "Selesai", // Langsung SELESAI karena transaksi Kasir
          details: {
            create: detailData
          }
        },
        include: { details: true }
      });

      return penjualanBaru;
    });

    return NextResponse.json({
      success: true,
      message: "Transaksi Berhasil Disimpan!",
      data: serializeBigInt(result)
    }, { status: 201 });

  } catch (error: any) {
    console.error("POST Penjualan Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Gagal memproses transaksi" 
    }, { status: 400 });
  }
}