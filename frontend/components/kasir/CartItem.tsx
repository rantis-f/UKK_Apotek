import { Plus, Minus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: any;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({ item, onUpdateQty, onRemove }: CartItemProps) => (
  <div className="flex gap-3 items-center bg-gray-50/50 p-3 rounded-[1.5rem] border border-gray-100">
    <div className="flex-1 min-w-0">
      <h4 className="font-black text-[10px] uppercase text-gray-800 truncate">
        {item.nama_obat}
      </h4>
      <p className="text-[10px] font-bold text-blue-600">
        Rp {Number(item.harga_jual).toLocaleString()}
      </p>
    </div>

    <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
      <button 
        onClick={() => onUpdateQty(item.id, -1)}
        className="p-1 hover:text-blue-600 transition-colors"
      >
        <Minus size={12}/>
      </button>
      <span className="text-[11px] font-black min-w-5 text-center">
        {item.qty}
      </span>
      <button 
        onClick={() => onUpdateQty(item.id, 1)}
        className="p-1 hover:text-blue-600 transition-colors"
      >
        <Plus size={12}/>
      </button>
    </div>

    <button 
      onClick={() => onRemove(item.id)}
      className="text-gray-300 hover:text-red-500 p-1 transition-colors"
    >
      <Trash2 size={16}/>
    </button>
  </div>
);