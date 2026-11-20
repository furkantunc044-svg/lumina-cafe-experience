"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BellRing,
  Coffee,
  Gift,
  HeartHandshake,
  Instagram,
  ReceiptText,
  Share2,
  Sparkles,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { getDemoOrder, subscribeRealtime } from "@/lib/realtime-store";
import { Venue } from "@/lib/types";
import RatingShieldModal from "./RatingShieldModal";
import SocialSheet from "./SocialSheet";
import WaiterCallSheet from "./WaiterCallSheet";

interface BentoHomeProps {
  venue: Venue;
  tableNumber: number;
  tableSlug: string;
}

export default function BentoHome({
  venue,
  tableNumber,
  tableSlug,
}: BentoHomeProps) {
  const [waiterSheetOpen, setWaiterSheetOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [socialSheetOpen, setSocialSheetOpen] = useState(false);
  const [remainingBill, setRemainingBill] = useState<number>(1095);

  const syncBill = useCallback(() => {
    const order = getDemoOrder(venue.id, tableNumber);
    const total = Math.max(
      0,
      order.items.filter((i) => !i.is_paid).reduce((s, i) => s + i.price, 0)
    );
    setRemainingBill(total);
  }, [venue.id, tableNumber]);

  useEffect(() => {
    syncBill();
    return subscribeRealtime(syncBill);
  }, [syncBill]);

  const basePath = `/${venue.slug}/${tableSlug}`;

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md bg-[#0c0b0a] px-4 pb-10 pt-5">
      {/* Subtle top ambient glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-20 blur-[90px]"
        style={{ backgroundColor: "var(--brand-primary)" }}
      />

      {/* Header: Venue Logo + Masa Badge */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mb-5 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(217,160,91,0.25), rgba(26,23,20,0.95))",
            }}
          >
            <Coffee className="h-5 w-5 text-[#f3c78a]" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-white">
              {venue.name}
            </h1>
            <p className="text-[11px] text-zinc-400">{venue.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#d9a05b]/30 bg-[#1a1612] px-3 py-1.5 shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-xs font-semibold tracking-wide text-[#f3c78a]">
            Masa {tableNumber}
          </span>
        </div>
      </motion.header>

      {/* Bento Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3">
        {/* Main Hero Card: Hareketli Menüyü Keşfet */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="col-span-2"
        >
          <Link
            href={`${basePath}/menu`}
            className="group relative block h-56 overflow-hidden rounded-[28px] border border-[#d9a05b]/30 bg-[#161310] shadow-2xl transition-transform active:scale-[0.98]"
          >
            {/* Looping animated background */}
            <img
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80"
              alt="Lumina Hareketli Menü"
              className="animate-motion-zoom absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-[#0c0b0a]/55 to-transparent" />

            <div className="relative flex h-full flex-col justify-between p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[11px] font-medium text-[#f3c78a] backdrop-blur-md">
                  <Sparkles className="h-3 w-3" />
                  Hareketli Görsel Menü
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-2 text-xs text-zinc-300">
                  <UtensilsCrossed className="h-3.5 w-3.5 text-[#d9a05b]" />
                  <span>10 İmza Lezzet · Barista Eşleştirmeleri</span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Menüyü Keşfet
                </h2>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Middle Card 1: Garson Çağır */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setWaiterSheetOpen(true)}
          className="flex flex-col justify-between rounded-[24px] border border-[#d9a05b]/25 bg-gradient-to-br from-[#211a13] to-[#151210] p-4 text-left shadow-lg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d9a05b]/20 text-[#f3c78a]">
            <BellRing className="h-5 w-5" />
          </div>
          <div className="mt-5">
            <p className="text-sm font-semibold text-white">Garson Çağır</p>
            <p className="mt-0.5 text-[11px] text-zinc-400">
              Su, peçete &amp; servis
            </p>
          </div>
        </motion.button>

        {/* Middle Card 2: Hesabı Böl & Öde */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <Link
            href={`${basePath}/adisyon`}
            className="flex h-full flex-col justify-between rounded-[24px] border border-white/8 bg-[#161412] p-4 text-left shadow-lg transition-transform active:scale-[0.96]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div className="mt-5">
              <p className="text-sm font-semibold text-white">
                Hesabı Böl &amp; Öde
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-400">
                Masa {tableNumber} ·{" "}
                {remainingBill > 0
                  ? `${remainingBill.toLocaleString("tr-TR")} ₺`
                  : "Ödendi"}
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Middle Card 3 (Wide): Bahşiş Bırak */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="col-span-2"
        >
          <Link
            href={`${basePath}/bahsis`}
            className="flex items-center justify-between rounded-[24px] border border-white/8 bg-[#161412] px-4 py-4 text-left shadow-lg transition-transform active:scale-[0.97]"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Ekibe Bahşiş Bırak
                </p>
                <p className="text-[11px] text-zinc-400">
                  Barista, mutfak veya servis ekibine teşekkür et
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-zinc-500" />
          </Link>
        </motion.div>

        {/* Bottom Card 1: Dijital Hediye Çeki */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
        >
          <Link
            href={`${basePath}/hediye-ceki`}
            className="flex h-full flex-col justify-between rounded-[24px] border border-white/8 bg-[#161412] p-4 text-left transition-transform active:scale-[0.96]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">
              <Gift className="h-5 w-5" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-white">Hediye Çeki</p>
              <p className="mt-0.5 text-[11px] text-zinc-400">
                Arkadaşına kahve ısmarla
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Bottom Card 2: Bizi Puanla (Google) */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.28 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setRatingModalOpen(true)}
          className="flex flex-col justify-between rounded-[24px] border border-white/8 bg-[#161412] p-4 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300">
            <Star className="h-5 w-5" />
          </div>
          <div className="mt-4">
            <p className="text-sm font-semibold text-white">Bizi Puanla</p>
            <p className="mt-0.5 text-[11px] text-zinc-400">
              Deneyimini paylaş
            </p>
          </div>
        </motion.button>

        {/* Bottom Card 3 (Wide): Sosyal Medya Vitrini */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSocialSheetOpen(true)}
          className="col-span-2 flex items-center justify-between rounded-[24px] border border-white/8 bg-gradient-to-r from-[#171513] to-[#1d1712] px-4 py-3.5 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0c0b0a] bg-pink-500/20 text-pink-300">
                <Instagram className="h-4 w-4" />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#0c0b0a] bg-[#d9a05b]/20 text-[#f3c78a]">
                <Share2 className="h-4 w-4" />
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Instagram · TikTok · Konum Paylaş
              </p>
              <p className="text-[11px] text-zinc-400">
                Bizi hikayende paylaş veya konumu arkadaşına gönder
              </p>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-zinc-500" />
        </motion.button>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-[11px] text-zinc-600">
        Üyelik gerektirmez · Anonim masa oturumu
      </p>

      {/* Modül 3: Tek Tıkla Masa Servisi Bottom Sheet */}
      <WaiterCallSheet
        venueId={venue.id}
        tableNumber={tableNumber}
        open={waiterSheetOpen}
        onClose={() => setWaiterSheetOpen(false)}
      />

      {/* Modül 6: İtibar Kalkanı Modalı */}
      <RatingShieldModal
        venue={venue}
        tableNumber={tableNumber}
        open={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
      />

      {/* Modül 8: Sosyal Medya Vitrini */}
      <SocialSheet
        venue={venue}
        open={socialSheetOpen}
        onClose={() => setSocialSheetOpen(false)}
      />
    </div>
  );
}
