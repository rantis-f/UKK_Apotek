import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPublicId = (url: string | null) => {
  if (!url || url.includes("default.jpg") || !url.startsWith("http")) return null;

  const parts = url.split("/");
  const fileWithExtension = parts[parts.length - 1];
  const publicId = fileWithExtension.split(".")[0];

  return `apotek/obat/${publicId}`;
};

const serialize = (data: any) => {
  return JSON.parse(JSON.stringify(data, (k, v) => typeof v === "bigint" ? v.toString() : v));
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const obat = await prisma.obat.findUnique({
      where: { id: BigInt(id) },
      include: { jenis_obat: true },
    });
    if (!obat) return NextResponse.json({ success: false, message: "Obat tidak ditemukan" }, { status: 404 });
    return NextResponse.json(serialize({ success: true, data: obat }));
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error server" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const imageFile = formData.get("foto1") as File | null;

    const existing = await prisma.obat.findUnique({ where: { id: BigInt(id) } });
    if (!existing) return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });

    let imageUrl = existing.foto1;

    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const oldPublicId = getPublicId(existing.foto1);
      if (oldPublicId) {
        await cloudinary.uploader.destroy(oldPublicId);
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const upload: any = await new Promise((res, rej) => {
        cloudinary.uploader.upload_stream(
          { upload_preset: process.env.CLOUDINARY_PRESET },
          (err, result) => err ? rej(err) : res(result)
        ).end(buffer);
      });
      imageUrl = upload.secure_url;
    }

    const updated = await prisma.obat.update({
      where: { id: BigInt(id) },
      data: {
        nama_obat: (formData.get("nama_obat") as string) || undefined,
        harga_jual: formData.get("harga_jual") ? Number(formData.get("harga_jual")) : undefined,
        stok: formData.get("stok") ? Number(formData.get("stok")) : undefined,
        idjenis: formData.get("idjenis") ? BigInt(formData.get("idjenis") as string) : undefined,
        deskripsi_obat: (formData.get("deskripsi_obat") as string) || undefined,
        foto1: imageUrl,
      },
    });

    return NextResponse.json(serialize({ success: true, message: "Berhasil diupdate", data: updated }));
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal update" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const existing = await prisma.obat.findUnique({ where: { id: BigInt(id) } });

    if (existing) {
      const publicId = getPublicId(existing.foto1);
      if (publicId) await cloudinary.uploader.destroy(publicId);

      await prisma.obat.delete({ where: { id: BigInt(id) } });
    }

    return NextResponse.json({ success: true, message: "Data & Foto terhapus" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Gagal hapus data" }, { status: 500 });
  }
}