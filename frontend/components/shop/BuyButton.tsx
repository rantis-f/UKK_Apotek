"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function BuyButton({ productId }: { productId: string }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleBuy = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push(`/cart/add/${productId}`);
    }
  };

  return (
    <Button 
      onClick={handleBuy}
      className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-16 rounded-2xl text-lg font-black shadow-2xl shadow-emerald-100 gap-3 transition-all active:scale-95"
    >
      <ShoppingBag className="w-6 h-6" />
      Beli Sekarang
    </Button>
  );
}