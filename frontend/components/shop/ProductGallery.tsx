"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images }: { images: string[] }) {
  const validImages = images.filter(img => img && !img.includes("default.jpg"));
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
        <AnimatePresence mode="wait">
          <motion.img
            key={validImages[index]}
            src={validImages[index]}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      <div className="flex gap-3 justify-center">
        {validImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
              index === i ? "border-emerald-500 scale-105 shadow-lg" : "border-transparent opacity-60"
            }`}
          >
            <img src={img} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}