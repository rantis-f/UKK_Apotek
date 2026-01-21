-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NOT NULL,
    `remember_token` VARCHAR(100) NULL,
    `jabatan` ENUM('admin', 'apoteker', 'karyawan', 'kasir', 'pemilik') NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pelanggan` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_pelanggan` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `katakunci` VARCHAR(15) NOT NULL,
    `no_telp` VARCHAR(15) NOT NULL,
    `alamat1` VARCHAR(255) NULL,
    `kota1` VARCHAR(255) NULL,
    `propinsi1` VARCHAR(255) NULL,
    `kodepos1` VARCHAR(255) NULL,
    `alamat2` VARCHAR(255) NULL,
    `kota2` VARCHAR(255) NULL,
    `propinsi2` VARCHAR(255) NULL,
    `kodepos2` VARCHAR(255) NULL,
    `alamat3` VARCHAR(255) NULL,
    `kota3` VARCHAR(255) NULL,
    `propinsi3` VARCHAR(255) NULL,
    `kodepos3` VARCHAR(255) NULL,
    `foto` VARCHAR(255) NULL,
    `url_ktp` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `pelanggan_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jenis_obat` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `jenis` VARCHAR(50) NOT NULL,
    `deskripsi_jenis` VARCHAR(255) NULL,
    `image_url` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `jenis_obat_jenis_key`(`jenis`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `obat` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `idjenis` BIGINT UNSIGNED NOT NULL,
    `nama_obat` VARCHAR(100) NOT NULL,
    `harga_jual` INTEGER NOT NULL,
    `deskripsi_obat` TEXT NULL,
    `foto1` VARCHAR(255) NULL,
    `foto2` VARCHAR(255) NULL,
    `foto3` VARCHAR(255) NULL,
    `stok` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `distributor` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_distributor` VARCHAR(50) NOT NULL,
    `telepon` VARCHAR(15) NOT NULL,
    `alamat` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembelian` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nonota` VARCHAR(100) NOT NULL,
    `tgl_pembelian` DATE NOT NULL,
    `total_bayar` DOUBLE NOT NULL,
    `id_distributor` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_pembelian` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_obat` BIGINT UNSIGNED NOT NULL,
    `jumlah_beli` INTEGER NOT NULL,
    `harga_beli` DOUBLE NOT NULL,
    `subtotal` DOUBLE NOT NULL,
    `id_pembelian` BIGINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metode_bayar` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `metode_pembayaran` VARCHAR(30) NOT NULL,
    `tempat_bayar` VARCHAR(50) NULL,
    `no_rekening` VARCHAR(25) NULL,
    `url_logo` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jenis_pengiriman` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `jenis_kirim` ENUM('ekonomi', 'kargo', 'regular', 'same day', 'standar') NOT NULL,
    `nama_ekspedisi` VARCHAR(255) NOT NULL,
    `logo_ekspedisi` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penjualan` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tgl_penjualan` DATE NOT NULL,
    `id_metode_bayar` BIGINT UNSIGNED NOT NULL,
    `id_jenis_kirim` BIGINT UNSIGNED NOT NULL,
    `id_pelanggan` BIGINT UNSIGNED NOT NULL,
    `url_resep` VARCHAR(255) NULL,
    `ongkos_kirim` DOUBLE NOT NULL,
    `biaya_app` DOUBLE NOT NULL,
    `total_bayar` DOUBLE NOT NULL,
    `status_order` ENUM('Menunggu Konfirmasi', 'Diproses', 'Menunggu Kurir', 'Dibatalkan Pembeli', 'Dibatalkan Penjual', 'Bermasalah', 'Selesai') NOT NULL DEFAULT 'Menunggu Konfirmasi',
    `keterangan_status` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_penjualan` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_penjualan` BIGINT UNSIGNED NOT NULL,
    `id_obat` BIGINT UNSIGNED NOT NULL,
    `jumlah_beli` INTEGER NOT NULL,
    `harga_beli` DOUBLE NOT NULL,
    `subtotal` DOUBLE NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengiriman` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_penjualan` BIGINT UNSIGNED NOT NULL,
    `no_invoice` VARCHAR(255) NULL,
    `tgl_kirim` DATETIME(0) NULL,
    `tgl_tiba` DATETIME(0) NULL,
    `status_kirim` ENUM('Sedang Dikirim', 'Tiba Di Tujuan') NOT NULL DEFAULT 'Sedang Dikirim',
    `nama_kurir` VARCHAR(30) NULL,
    `telpon_kurir` VARCHAR(15) NULL,
    `bukti_foto` VARCHAR(255) NULL,
    `keterangan` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `pengiriman_id_penjualan_key`(`id_penjualan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `keranjang` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `id_pelanggan` BIGINT UNSIGNED NOT NULL,
    `id_obat` BIGINT UNSIGNED NOT NULL,
    `jumlah_order` DOUBLE NOT NULL,
    `harga` DOUBLE NOT NULL,
    `subtotal` DOUBLE NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `obat` ADD CONSTRAINT `obat_idjenis_fkey` FOREIGN KEY (`idjenis`) REFERENCES `jenis_obat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembelian` ADD CONSTRAINT `pembelian_id_distributor_fkey` FOREIGN KEY (`id_distributor`) REFERENCES `distributor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pembelian` ADD CONSTRAINT `detail_pembelian_id_pembelian_fkey` FOREIGN KEY (`id_pembelian`) REFERENCES `pembelian`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_pembelian` ADD CONSTRAINT `detail_pembelian_id_obat_fkey` FOREIGN KEY (`id_obat`) REFERENCES `obat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penjualan` ADD CONSTRAINT `penjualan_id_metode_bayar_fkey` FOREIGN KEY (`id_metode_bayar`) REFERENCES `metode_bayar`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penjualan` ADD CONSTRAINT `penjualan_id_jenis_kirim_fkey` FOREIGN KEY (`id_jenis_kirim`) REFERENCES `jenis_pengiriman`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penjualan` ADD CONSTRAINT `penjualan_id_pelanggan_fkey` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_penjualan` ADD CONSTRAINT `detail_penjualan_id_penjualan_fkey` FOREIGN KEY (`id_penjualan`) REFERENCES `penjualan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_penjualan` ADD CONSTRAINT `detail_penjualan_id_obat_fkey` FOREIGN KEY (`id_obat`) REFERENCES `obat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengiriman` ADD CONSTRAINT `pengiriman_id_penjualan_fkey` FOREIGN KEY (`id_penjualan`) REFERENCES `penjualan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `keranjang` ADD CONSTRAINT `keranjang_id_pelanggan_fkey` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `keranjang` ADD CONSTRAINT `keranjang_id_obat_fkey` FOREIGN KEY (`id_obat`) REFERENCES `obat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
