import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const serialize = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const sort = searchParams.get("sort");
    const search = searchParams.get("q") || "";

    const queryOptions: any = {
      where: {
        nama_obat: { contains: search },
      },
      include: {
        jenis_obat: true
      },
    };

    if (sort === "latest") {
      queryOptions.orderBy = { id: 'desc' };
    } else if (sort === "popular") {
      queryOptions.orderBy = { stok: 'asc' };
    } else {
      queryOptions.orderBy = { id: 'desc' };
    }

    if (limit && !isNaN(parseInt(limit))) {
      queryOptions.take = parseInt(limit);
    }

    const obat = await prisma.obat.findMany(queryOptions);

    return NextResponse.json(serialize({
      success: true,
      data: obat
    }));
  } catch (error: any) {
    console.error("CRITICAL GET ERROR:", error.message);
    return NextResponse.json({
      success: false,
      message: "Gagal memuat katalog: " + error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const headerList = await headers();
    const role = headerList.get("x-user-role");
    const authorizedRoles = ["admin", "pemilik", "apoteker"];

    if (!role || !authorizedRoles.includes(role.toLowerCase())) {
      return NextResponse.json({ success: false, message: "Forbidden: Akses ditolak!" }, { status: 403 });
    }

    const formData = await request.formData();
    const nama_obat = formData.get("nama_obat") as string;
    const idjenis = formData.get("idjenis") as string;
    const harga_jual = formData.get("harga_jual") as string;
    const stok = formData.get("stok") as string;
    const deskripsi_obat = formData.get("deskripsi_obat") as string;
    const imageFile = formData.get("foto1") as File;

    if (!nama_obat || !idjenis || !harga_jual) {
      return NextResponse.json({ success: false, message: "Data utama wajib diisi" }, { status: 400 });
    }

    let imageUrl = "default.jpg";

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            upload_preset: process.env.CLOUDINARY_PRESET
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newObat = await prisma.obat.create({
      data: {
        nama_obat,
        idjenis: BigInt(idjenis),
        harga_jual: Number(harga_jual),
        stok: Number(stok) || 0,
        foto1: imageUrl,
        deskripsi_obat: deskripsi_obat || "",
      },
    });

    return NextResponse.json(serialize({
      success: true,
      message: "Data & Gambar berhasil disimpan",
      data: newObat,
    }), { status: 201 });

  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan sistem" }, { status: 500 });
  }
}