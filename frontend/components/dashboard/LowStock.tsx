import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Obat {
  id: number;
  nama_obat: string;
  stok: number;
}

export default function LowStock({ items }: { items: Obat[] }) {
  return (
    <Card className="shadow-sm border-none bg-white h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-gray-800">
          <div className="p-1.5 bg-orange-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          Stok Menipis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items?.length > 0 ? (
            items.map((obat) => (
              <div 
                key={obat.id} 
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all group"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-800">{obat.nama_obat}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    Sisa: <span className="text-red-600 font-extrabold">{obat.stok}</span>
                  </p>
                </div>
                <Link href={`/dashboard/obat/${obat.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="py-10 text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <p className="text-sm text-gray-400 italic">Semua stok obat aman.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}