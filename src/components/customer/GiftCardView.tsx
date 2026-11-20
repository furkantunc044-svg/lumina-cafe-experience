"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Copy,
  Gift,
  QrCode,
  Share2,
  Sparkles,
} from "lucide-react";
import { createGiftCard } from "@/lib/realtime-store";
import { GiftCard, Venue } from "@/lib/types";
import MockPaymentModal from "./MockPaymentModal";

interface GiftCardViewProps {
  venue: Venue;
  tableNumber: number;
  tableSlug: string;
}

const GIFT_PACKAGES = [
  { id: "pkg-250", label: "250 ₺", subtitle: "Kahve Keyfi", amount: 250 },
  { id: "pkg-500", label: "500 ₺", subtitle: "Kahve & Tatlı", amount: 500 },
  {
    id: "pkg-duo",
    label: "690 ₺",
    subtitle: "2 Kişilik Kahve & Tatlı",
    amount: 690,
  },
  { id: "pkg-1000", label: "1.000 ₺", subtitle: "Bistro Deneyimi", amount: 1000 },
];

export default function GiftCardView({
  venue,
  tableNumber,
  tableSlug,
}: GiftCardViewProps) {
  const [selectedPkg, setSelectedPkg] = useState(GIFT_PACKAGES[1]);
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [createdCard, setCreatedCard] = useState<GiftCard | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSuccess = () => {
    const card = createGiftCard(
      venue.id,
      selectedPkg.amount,
      selectedPkg.subtitle,
      senderName,
      message
    );
    setPaymentOpen(false);
    setCreatedCard(card);
  };

  const handleCopy = () => {
    if (!createdCard) return;
    navigator.clipboard?.writeText(createdCard.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = createdCard
    ? `https://wa.me/?text=${encodeURIComponent(
        `☕ Sana ${venue.name}'dan ${createdCard.amount} ₺ değerinde Dijital Hediye Çeki gönderdim!\n\nHediye Kodu: ${createdCard.code}\nNot: "${createdCard.message}"\nGönderen: ${createdCard.sender_name}`
      )}`
    : "#";

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-[#0c0b0a] px-4 pb-12 pt-5">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/${venue.slug}/${tableSlug}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#171412] text-zinc-200 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="text-center">
          <h1 className="text-base font-semibold text-white">
            Dijital Hediye Çeki
          </h1>
          <p className="text-[11px] text-[#d9a05b]">{venue.name}</p>
        </div>
        <div className="w-9" />
      </div>

      {createdCard ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Luxury Digital Gift Card */}
          <div className="relative overflow-hidden rounded-[28px] border border-[#d9a05b]/50 bg-gradient-to-br from-[#2a1f14] via-[#171310] to-[#0f0d0c] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f3c78a]">
                <Gift className="h-4 w-4" />
                {venue.name}
              </span>
              <span className="rounded-full bg-[#d9a05b]/20 px-2.5 py-1 text-[10px] font-semibold text-[#f3c78a]">
                {createdCard.package_name}
              </span>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-[11px] text-zinc-400">Hediye Tutarı</p>
                <p className="text-3xl font-bold text-white">
                  {createdCard.amount.toLocaleString("tr-TR")} ₺
                </p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 text-[#0c0b0a]">
                <QrCode className="h-12 w-12" />
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-3.5 text-center">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                6 Haneli Hediye Kodu
              </p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-[0.25em] text-[#f3c78a]">
                {createdCard.code}
              </p>
            </div>

            <p className="mt-4 text-xs italic text-zinc-300">
              &ldquo;{createdCard.message}&rdquo;
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              Gönderen: {createdCard.sender_name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#161412] py-3.5 text-xs font-semibold text-white active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Kodu Kopyala
                </>
              )}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-xs font-semibold text-[#0c0b0a] active:scale-95"
            >
              <Share2 className="h-4 w-4" />
              WhatsApp Paylaş
            </a>
          </div>

          <p className="text-center text-[11px] text-zinc-500">
            Bu kod Personel Panelindeki &quot;Hediye Çeki Doğrulama&quot; alanından
            anında sorgulanabilir.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-5">
          {/* Package Grid */}
          <div>
            <p className="mb-2.5 text-xs font-medium text-zinc-400">
              Hediye Paketi Seçin
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {GIFT_PACKAGES.map((pkg) => {
                const active = selectedPkg.id === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPkg(pkg)}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? "border-[#d9a05b] bg-[#211a13]"
                        : "border-white/8 bg-[#161412]"
                    }`}
                  >
                    <p className="text-lg font-bold text-[#f3c78a]">
                      {pkg.label}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-300">
                      {pkg.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sender & Message */}
          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-400">
                Adınız
              </p>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Örn: Ahmet"
                className="w-full rounded-2xl border border-white/10 bg-[#161412] px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-[#d9a05b] focus:outline-none"
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-400">
                Hediye Notunuz
              </p>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Örn: Kahven benden, afiyet olsun!"
                className="w-full rounded-2xl border border-white/10 bg-[#161412] px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-[#d9a05b] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPaymentOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d9a05b] to-[#f3c78a] py-4 text-sm font-semibold text-[#0c0b0a] shadow-xl active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            Hediye Çeki Oluştur · {selectedPkg.amount.toLocaleString("tr-TR")} ₺
          </button>
        </div>
      )}

      <MockPaymentModal
        open={paymentOpen}
        amount={selectedPkg.amount}
        title="Dijital Hediye Çeki"
        subtitle={`${selectedPkg.subtitle} · Masa ${tableNumber}`}
        onClose={() => setPaymentOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
