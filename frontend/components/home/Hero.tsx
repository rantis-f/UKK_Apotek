"use client";
import { Button } from "@/components/ui/button";
import { Pill, Plus, Activity, HeartPulse } from "lucide-react";

export default function Hero() {
    return (
        <section className="container mx-auto px-4 py-6">
            <div className="relative rounded-3xl overflow-hidden bg-emerald-900 h-80 md:h-112.5 flex items-center">

                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="relative z-10 px-8 md:px-20 space-y-4 md:space-y-6 max-w-2xl text-white">
                    <div className="inline-block bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-4 py-1.5 rounded-full text-xs md:text-sm font-medium">
                        🎉 Promo Spesial · Diskon hingga 50%
                    </div>

                    <h1 className="text-3xl md:text-6xl font-extrabold leading-tight">
                        Obat Asli <br /> Tanpa Ribet
                    </h1>

                    <p className="text-emerald-100 text-sm md:text-lg font-light max-w-md">
                        Pesan obat resmi, kami antar ke rumah.
                    </p>

                    <Button
                        size="lg"
                        className="bg-white text-emerald-900 hover:bg-emerald-100 font-bold px-8 rounded-xl h-12 md:h-14 transition-all hover:shadow-xl hover:shadow-emerald-500/20 active:scale-95"
                    >
                        Belanja Sekarang
                    </Button>
                </div>

                <div className="hidden lg:flex absolute right-20 inset-y-0 items-center justify-center w-100">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse"></div>

                        <div className="relative bg-emerald-800/40 p-12 rounded-full border border-emerald-500/30 backdrop-blur-sm shadow-2xl">
                            <Plus className="w-32 h-32 text-emerald-400 opacity-80" strokeWidth={1.5} />
                        </div>

                        <div className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                            <Pill className="w-10 h-10 text-emerald-600" />
                        </div>

                        <div className="absolute top-20 -left-16 bg-white p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '4s' }}>
                            <HeartPulse className="w-8 h-8 text-red-500" />
                        </div>

                        <div className="absolute -bottom-10 right-10 bg-white p-4 rounded-2xl shadow-xl animate-bounce" style={{ animationDuration: '2.5s' }}>
                            <Activity className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}