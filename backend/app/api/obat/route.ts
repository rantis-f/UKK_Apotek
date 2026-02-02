import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

// 1. Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Helper: Serialize BigInt
const serialize = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

// ==========================================
// [GET] - AMBIL DATA (STABIL & DINAMIS)
// ==========================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const idjenis = searchParams.get("idjenis");
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const sortParam = searchParams.get("sort") || "desc";
    let orderBy: any = { id: 'desc' };
    if (sortParam === "price_asc") orderBy = { harga_jual: 'asc' };
    if (sortParam === "price_desc") orderBy = { harga_jual: 'desc' };
    if (sortParam === "asc") orderBy = { id: 'asc' };

    // --- PERBAIKAN LOGIKA DISINI ---
    const where: any = {};

    // Hanya tambahkan filter nama jika user beneran ngetik sesuatu
    if (q && q.trim() !== "") {
      where.nama_obat = { contains: q };
    }

    // Hanya tambahkan filter kategori jika user beneran milih
    if (idjenis && idjenis.trim() !== "" && idjenis !== "null" && idjenis !== "undefined") {
      where.idjenis = BigInt(idjenis);
    }

    // Ambil data dan hitung total secara paralel
    const [obat, total] = await Promise.all([
      prisma.obat.findMany({
        where, // Jika q dan idjenis kosong, where jadi {} (artinya ambil semua)
        include: { jenis_obat: true },
        orderBy,
        take: limit,
        skip: skip,
      }),
      prisma.obat.count({ where })
    ]);

    return NextResponse.json(serialize({ 
      success: true, 
      data: obat,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }));
  } catch (error: any) {
    console.error("GET ERROR:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ==========================================
// [POST] - TAMBAH OBAT BARU (ROLE PROTECTED)
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");
    
    if (role !== 'admin' && role !== 'pemilik' && role !== 'apoteker') {
      return NextResponse.json({ success: false, message: "Forbidden!" }, { status: 403 });
    }

    const formData = await request.formData();
    const photoFields = ["foto1", "foto2", "foto3"];
    let imageUrls: any = {};

    for (const field of photoFields) {
      const imageFile = formData.get(field) as File;
      if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResponse: any = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              upload_preset: process.env.CLOUDINARY_PRESET,
              folder: "ran_store_products" 
            },
            (error, result) => { if (error) reject(error); else resolve(result); }
          ).end(buffer);
        });
        imageUrls[field] = uploadResponse.secure_url;
      }
    }

    const newObat = await prisma.obat.create({
      data: {
        nama_obat: formData.get("nama_obat") as string,
        idjenis: BigInt(formData.get("idjenis") as string),
        harga_jual: Number(formData.get("harga_jual")),
        stok: Number(formData.get("stok")) || 0,
        deskripsi_obat: formData.get("deskripsi_obat") as string || "",
        ...imageUrls 
      },
    });

    return NextResponse.json(serialize({ success: true, data: newObat }), { status: 201 });

  } catch (error: any) {
    console.error("POST ERROR:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}