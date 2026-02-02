import { obatService } from "@/services/obat.service";
import { categoryService } from "@/services/category.service";
import ProductCard from "@/components/shop/ProductCard";
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, PackageSearch, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function KatalogObatPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string; sort?: string }>
}) {
  const params = await searchParams;
  const q = params.q || "";
  const categoryId = params.category || "";
  const currentPage = parseInt(params.page || "1");
  const currentSort = params.sort || "desc";
  const limit = 12;

  const [resObat, resCategories] = await Promise.all([
    obatService.getAll(undefined, { q, idjenis: categoryId, page: currentPage, limit, sort: currentSort }),
    categoryService.getAll()
  ]);

  const products = resObat?.data || [];
  const categories = resCategories?.data || [];
  const totalPages = resObat?.pagination?.totalPages || 1;
  const totalItems = resObat?.pagination?.total || 0;

  const isFiltered = q !== "" || categoryId !== "" || currentSort !== "desc" || currentPage > 1;

  return (
    <div className="min-h-screen bg-white pb-10">
      <section className="pt-8 pb-10 bg-linear-to-b from-emerald-50/50 to-white px-4 border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Telusuri <span className="text-emerald-600">Katalog Obat</span>
            </h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              {totalItems} Produk Tersedia
            </p>
          </div>

          <form action="/obat" className="bg-white p-4 md:p-5 rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Cari Nama</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input name="q" defaultValue={q} placeholder="Cari obat..." className="w-full h-11 pl-11 pr-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Kategori</label>
                <select name="category" defaultValue={categoryId} className="w-full h-11 px-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-gray-600 appearance-none cursor-pointer">
                  <option value="">Semua Jenis</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id.toString()} value={cat.id.toString()}>{cat.jenis}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Urutan</label>
                <select name="sort" defaultValue={currentSort} className="w-full h-11 px-4 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-gray-600 appearance-none cursor-pointer">
                  <option value="desc">Terbaru</option>
                  <option value="asc">Terlama</option>
                  <option value="price_asc">Termurah</option>
                  <option value="price_desc">Termahal</option>
                </select>
              </div>

              <div className="md:col-span-3 flex gap-2">
                <Button type="submit" className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold shadow-lg shadow-emerald-100 gap-2">
                  <Filter className="w-4 h-4" /> Filter
                </Button>
                {isFiltered && (
                  <Link href="/obat">
                    <Button type="button" variant="outline" className="h-11 w-11 p-0 rounded-xl border-gray-100 text-gray-400 hover:text-red-500 transition-all">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {products.map((item: any) => (
                <ProductCard key={item.id.toString()} item={item} />
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 border-t border-gray-100 pt-8">
              <Link href={`/obat?page=${Math.max(1, currentPage - 1)}&q=${q}&category=${categoryId}&sort=${currentSort}`}>
                <Button variant="outline" disabled={currentPage <= 1} className="h-10 px-6 rounded-xl font-bold gap-2 border-gray-100">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Button>
              </Link>

              <div className="bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Hal <span className="text-emerald-600">{currentPage}</span> / {totalPages}
                </span>
              </div>

              <Link href={`/obat?page=${Math.min(totalPages, currentPage + 1)}&q=${q}&category=${categoryId}&sort=${currentSort}`}>
                <Button variant="outline" disabled={currentPage >= totalPages} className="h-10 px-6 rounded-xl font-bold gap-2 border-gray-100">
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="py-20 text-center space-y-4 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <PackageSearch className="w-12 h-12 text-gray-200 mx-auto" />
            <h3 className="text-lg font-black text-gray-800 uppercase">Obat Kosong</h3>
            <Link href="/obat">
              <Button className="bg-emerald-600 rounded-xl px-8 h-10">Reset Filter</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}