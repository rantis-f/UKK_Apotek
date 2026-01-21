import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai Seeding Database...');

  const passwordHash = await hash('password123', 10);

  console.log('👤 Membuat Data User Admin & Karyawan...');

  await prisma.user.upsert({
    where: { email: 'admin@apotek.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@apotek.com',
      password: passwordHash,
      jabatan: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'kasir@apotek.com' },
    update: {},
    create: {
      name: 'Kasir Utama',
      email: 'kasir@apotek.com',
      password: passwordHash,
      jabatan: 'kasir',
    },
  });

  await prisma.user.upsert({
    where: { email: 'owner@apotek.com' },
    update: {},
    create: {
      name: 'Bapak Pemilik',
      email: 'owner@apotek.com',
      password: passwordHash,
      jabatan: 'pemilik',
    },
  });

  console.log('👥 Memasukkan Data Pelanggan...');

  const pelanggan1 = await prisma.pelanggan.upsert({
    where: { email: 'budi@gmail.com' },
    update: {},
    create: {
      nama_pelanggan: 'Budi Santoso',
      email: 'budi@gmail.com',
      katakunci: '123456',
      no_telp: '08123456789',
      alamat1: 'Jl. Mawar No. 10, Surabaya',
      kota1: 'Surabaya',
      propinsi1: 'Jawa Timur',
    },
  });

  const pelanggan2 = await prisma.pelanggan.upsert({
    where: { email: 'siti@gmail.com' },
    update: {},
    create: {
      nama_pelanggan: 'Siti Aminah',
      email: 'siti@gmail.com',
      katakunci: '123456',
      no_telp: '08987654321',
      alamat1: 'Jl. Melati No. 5, Malang',
      kota1: 'Malang',
      propinsi1: 'Jawa Timur',
    },
  });

  console.log('🚚 Memasukkan Data Distributor & Ekspedisi...');

  const dist1 = await prisma.distributor.create({
    data: {
      nama_distributor: 'PT. Kimia Farma Trading',
      alamat: 'Jakarta Pusat',
      telepon: '021-123456',
    },
  });

  const dist2 = await prisma.distributor.create({
    data: {
      nama_distributor: 'PT. Merapi Farma',
      alamat: 'Yogyakarta',
      telepon: '0274-987654',
    },
  });

  const bayarTransfer = await prisma.metodeBayar.create({
    data: {
      metode_pembayaran: 'Transfer BCA',
      no_rekening: '888222333',
      tempat_bayar: 'Bank BCA',
      url_logo: 'bca.png',
    },
  });

  const bayarCOD = await prisma.metodeBayar.create({
    data: {
      metode_pembayaran: 'COD (Bayar Ditempat)',
      tempat_bayar: 'Rumah',
      url_logo: 'cod.png',
    },
  });

  const kirimJNE = await prisma.jenisPengiriman.create({
    data: {
      jenis_kirim: 'regular',
      nama_ekspedisi: 'JNE Regular',
      logo_ekspedisi: 'jne.png',
    },
  });

  const kirimInstant = await prisma.jenisPengiriman.create({
    data: {
      jenis_kirim: 'same_day',
      nama_ekspedisi: 'GoSend Instant',
      logo_ekspedisi: 'gosend.png',
    },
  });

  console.log('💊 Memasukkan Data Obat-obatan...');

  const tablet = await prisma.jenisObat.create({
    data: { jenis: 'Tablet', deskripsi_jenis: 'Obat padat telan' },
  });

  const sirup = await prisma.jenisObat.create({
    data: { jenis: 'Sirup', deskripsi_jenis: 'Obat cair manis' },
  });

  const kapsul = await prisma.jenisObat.create({
    data: { jenis: 'Kapsul', deskripsi_jenis: 'Obat cangkang lunak' },
  });

  const salep = await prisma.jenisObat.create({
    data: { jenis: 'Salep', deskripsi_jenis: 'Obat oles luar' },
  });

  const obatPara = await prisma.obat.create({
    data: {
      nama_obat: 'Paracetamol 500mg',
      idjenis: tablet.id,
      harga_jual: 5000,
      stok: 150,
      deskripsi_obat: 'Pereda demam dan nyeri ringan.',
      foto1: 'paracetamol.jpg',
    },
  });

  const obatAmox = await prisma.obat.create({
    data: {
      nama_obat: 'Amoxicillin 500mg',
      idjenis: kapsul.id,
      harga_jual: 12000,
      stok: 80,
      deskripsi_obat: 'Antibiotik untuk infeksi bakteri.',
      foto1: 'amoxicillin.jpg',
    },
  });

  const obatOBH = await prisma.obat.create({
    data: {
      nama_obat: 'OBH Combi Anak',
      idjenis: sirup.id,
      harga_jual: 18000,
      stok: 45,
      deskripsi_obat: 'Obat batuk hitam rasa strawberry.',
      foto1: 'obh_anak.jpg',
    },
  });

  const obatKalpanax = await prisma.obat.create({
    data: {
      nama_obat: 'Kalpanax Salep',
      idjenis: salep.id,
      harga_jual: 25000,
      stok: 20,
      deskripsi_obat: 'Obat gatal jamur kulit.',
      foto1: 'kalpanax.jpg',
    },
  });

  console.log('📥 Simulasi Restock Barang...');

  await prisma.pembelian.create({
    data: {
      nonota: 'INV-BUY-001',
      tgl_pembelian: new Date('2024-01-10'),
      total_bayar: 500000,
      id_distributor: dist1.id,
      details: {
        create: [
          { id_obat: obatPara.id, jumlah_beli: 100, harga_beli: 3000, subtotal: 300000 },
          { id_obat: obatAmox.id, jumlah_beli: 20, harga_beli: 10000, subtotal: 200000 },
        ],
      },
    },
  });

  console.log('📤 Simulasi Transaksi Penjualan...');

  const jual1 = await prisma.penjualan.create({
    data: {
      tgl_penjualan: new Date(),
      id_pelanggan: pelanggan1.id,
      id_metode_bayar: bayarTransfer.id,
      id_jenis_kirim: kirimJNE.id,
      ongkos_kirim: 10000,
      biaya_app: 1000,
      total_bayar: 34000,
      status_order: 'Selesai',
      keterangan_status: 'Barang sudah diterima',
      details: {
        create: [
          { id_obat: obatPara.id, jumlah_beli: 2, harga_beli: 5000, subtotal: 10000 },
          { id_obat: obatOBH.id, jumlah_beli: 1, harga_beli: 18000, subtotal: 18000 },
        ],
      },
    },
  });

  await prisma.pengiriman.create({
    data: {
      id_penjualan: jual1.id,
      status_kirim: 'Tiba_Di_Tujuan',
      nama_kurir: 'Joko (JNE)',
      no_invoice: 'INV-JNE-001',
      tgl_kirim: new Date(),
      tgl_tiba: new Date(),
      keterangan: 'Paket diterima oleh satpam',
    },
  });

  await prisma.penjualan.create({
    data: {
      tgl_penjualan: new Date(),
      id_pelanggan: pelanggan2.id,
      id_metode_bayar: bayarCOD.id,
      id_jenis_kirim: kirimInstant.id,
      ongkos_kirim: 15000,
      biaya_app: 1000,
      total_bayar: 41000,
      status_order: 'Diproses',
      details: {
        create: [
          { id_obat: obatKalpanax.id, jumlah_beli: 1, harga_beli: 25000, subtotal: 25000 },
        ],
      },
    },
  });

  console.log('🛒 Mengisi Keranjang Belanja...');

  await prisma.keranjang.createMany({
    data: [
      {
        id_pelanggan: pelanggan1.id,
        id_obat: obatAmox.id,
        jumlah_order: 5,
        harga: 12000,
        subtotal: 60000,
      },
    ],
  });

  console.log('✅ SEEDING BERHASIL! Database siap digunakan.');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi Error saat Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });