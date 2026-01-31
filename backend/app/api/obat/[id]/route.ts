import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { headers } from "next/headers";

const serialize = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

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

    return NextResponse.json(serialize({ success: true, data: obat }));
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error server" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");
    const staffRoles = ["admin", "pemilik", "apoteker"];

    if (!role || !staffRoles.includes(role.toLowerCase())) {
      return NextResponse.json({ success: false, message: "Akses ditolak!" }, { status: 403 });
    }

    const { id } = await getParams(context);
    const body = await request.json();

    const updatedObat = await prisma.obat.update({
      where: { id: BigInt(id) },
      data: {
        nama_obat: body.nama_obat,
        harga_jual: body.harga_jual ? Number(body.harga_jual) : undefined,
        stok: body.stok ? Number(body.stok) : undefined,
        idjenis: body.idjenis ? BigInt(body.idjenis) : undefined,
        deskripsi_obat: body.deskripsi_obat,
        foto1: body.foto1,
      },
    });

    return NextResponse.json(serialize({
      success: true,
      message: "Obat berhasil diupdate!",
      data: updatedObat,
    }));
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal update data" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");

    if (role?.toLowerCase() !== "admin" && role?.toLowerCase() !== "pemilik") {
      return NextResponse.json({ success: false, message: "Hanya Admin/Pemilik yang bisa menghapus!" }, { status: 403 });
    }

    const { id } = await getParams(context);

    await prisma.obat.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Obat berhasil dihapus!",
    });
  } catch (error) {
    // Pesan error ini bagus untuk handle Foreign Key Constraint
    return NextResponse.json({
      success: false,
      message: "Gagal hapus: Obat mungkin sudah tercatat dalam transaksi"
    }, { status: 500 });
  }
}