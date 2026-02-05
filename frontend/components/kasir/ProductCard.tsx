import { Plus, Package } from "lucide-react";

export const ProductCard = ({ obat, onAdd }: any) => {
  const isOutOfStock = obat.stok <= 0;

  return (
    <div 
      onClick={() => !isOutOfStock && onAdd(obat)}
      className={`bg-white p-4 rounded-[2rem] shadow-sm border-2 transition-all group ${
        isOutOfStock 
          ? "opacity-50 cursor-not-allowed border-transparent" 
          : "hover:shadow-md cursor-pointer border-transparent hover:border-blue-500"
      }`}
    >
      {/* --- BAGIAN YANG HARUS DIPERBAIKI --- */}
      <div className="h-32 bg-gray-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
        {obat.foto1 ? (
          <img 
            src={obat.foto1} 
            alt={obat.nama_obat} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-300">
            <Package size={40} />
            <span className="text-[8px] font-black mt-1">NO IMAGE</span>
          </div>
        )}
      </div>
      {/* ------------------------------------ */}
      
      <div className="space-y-1">
        <h3 className="font-black text-[12px] text-gray-800 uppercase truncate">
          {obat.nama_obat}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-400">
            Stok: {obat.stok}
          </span>
          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase">
            {obat.jenis_obat?.jenis || "Umum"}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-blue-600 font-black text-sm">
          Rp {Number(obat.harga_jual).toLocaleString()}
        </span>
        <div className={`p-2 rounded-xl transition-colors ${
          isOutOfStock ? "bg-gray-100 text-gray-400" : "bg-blue-600 text-white shadow-lg shadow-blue-100"
        }`}>
          <Plus size={16} />
        </div>
      </div>
    </div>
  );
};