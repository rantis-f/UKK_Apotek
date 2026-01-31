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

async function getParams(context: any) { 
  return await context.params; 
}

export async function PUT(request: NextRequest, context: any) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");

    if (role !== 'admin' && role !== 'pemilik') {
      return NextResponse.json({ success: false, message: "Akses Ditolak!" }, { status: 403 });
    }

    const { id } = await getParams(context);
    const body = await request.json();
    
    const data = await prisma.jenisObat.update({
      where: { id: BigInt(id) },
      data: {
        jenis: body.nama_jenis,
        deskripsi_jenis: body.deskripsi_jenis
      }
    });
    
    return NextResponse.json(serialize({ success: true, message: "Berhasil update", data }));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");

    if (role !== 'admin' && role !== 'pemilik') {
      return NextResponse.json({ success: false, message: "Akses Ditolak!" }, { status: 403 });
    }

    const { id } = await getParams(context);

    await prisma.jenisObat.delete({ 
      where: { id: BigInt(id) } 
    });

    return NextResponse.json({ success: true, message: "Berhasil hapus" });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2003') {
      return NextResponse.json({ 
        success: false, 
        message: "Kategori gagal dihapus karena masih digunakan oleh beberapa data obat!" 
      }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Gagal hapus data" }, { status: 500 });
  }
}