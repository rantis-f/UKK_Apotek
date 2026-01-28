import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { jwtVerify } from "jose";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const userId = Number(payload.id);
    const userRole = payload.role as string;

    let userData = null;

    if (userRole === "pelanggan") {
      userData = await prisma.pelanggan.findUnique({
        where: { id: userId },
        select: {
          id: true,
          nama_pelanggan: true,
          email: true,
          no_telp: true,
          foto: true,
          url_ktp: true,
          alamat1: true,
          kota1: true,
          propinsi1: true,
          kodepos1: true,
          alamat2: true,
          kota2: true,
          propinsi2: true,
          kodepos2: true,
          alamat3: true,
          kota3: true,
          propinsi3: true,
          kodepos3: true,
        },
      });
    } else {
      userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          jabatan: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: userData,
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Token Expired" }, { status: 401 });
  }
}