import Link from "next/link";
import { ArrowUpRight, Coffee, MonitorSmartphone, Sparkles } from "lucide-react";

export default function DemoLandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-12">
      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#d9a05b]/15 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="space-y-3 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d9a05b]/30 bg-[#d9a05b]/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#f3c78a]">
            <Sparkles className="h-3.5 w-3.5" />
            CANLI SATIŞ DEMOSU · TAM SÜRÜM
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Lumina Coffee &amp; Bistro
          </h1>
          <p className="text-sm leading-relaxed text-zinc-400">
            NFC / QR ile sıfır üyelikli müşteri deneyimi. Aşağıdan masa ekranına
            doğrudan giriş yapabilirsiniz.
          </p>
        </div>

        <div className="grid gap-4">
          <Link
            href="/lumina/masa-12"
            className="group relative overflow-hidden rounded-3xl border border-[#d9a05b]/30 bg-gradient-to-br from-[#1d1813] to-[#12100e] p-6 transition-all hover:border-[#d9a05b]/60 active:scale-[0.98]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9a05b]/15 text-[#f3c78a]">
                <Coffee className="h-6 w-6" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                Aktif
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">
              Müşteri Ekranı (Masa 12)
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              Bento Grid ana ekran, hareketli görsel menü ve akıllı yan ürün
              eşleştirme motoru.
            </p>
            <div className="mt-4 text-xs font-mono text-[#d9a05b]">
              /lumina/masa-12
            </div>
          </Link>

          <Link
            href="/lumina/panel"
            className="group relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#131b16] to-[#111312] p-6 transition-all hover:border-emerald-500/60 active:scale-[0.98]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                <MonitorSmartphone className="h-6 w-6" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                Canlı Aktif
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">
              Personel / İşletme Canlı Paneli
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              Anlık garson çağrısı, hesap talebi ve su/peçete bildirimlerini
              sesli olarak takip edin.
            </p>
            <div className="mt-4 text-xs font-mono text-emerald-400">
              /lumina/panel
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
