"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellRing,
  CheckCircle2,
  Clock,
  Droplets,
  ReceiptText,
  X,
} from "lucide-react";
import { createServiceRequest } from "@/lib/realtime-store";
import { ServiceRequestType } from "@/lib/types";
import { useCooldown } from "@/hooks/useCooldown";

interface WaiterCallSheetProps {
  venueId: string;
  tableNumber: number;
  open: boolean;
  onClose: () => void;
}

const SERVICE_OPTIONS: {
  type: ServiceRequestType;
  title: string;
  subtitle: string;
  icon: typeof BellRing;
  colorClass: string;
}[] = [
  {
    type: "waiter",
    title: "Garson Çağır",
    subtitle: "Sipariş veya destek için masaya çağır",
    icon: BellRing,
    colorClass: "bg-[#d9a05b]/20 text-[#f3c78a]",
  },
  {
    type: "bill",
    title: "Hesap İste",
    subtitle: "Adisyon veya POS cihazı talep et",
    icon: ReceiptText,
    colorClass: "bg-emerald-500/15 text-emerald-300",
  },
  {
    type: "water",
    title: "Su / Peçete İste",
    subtitle: "Hızlı masa servisi talebi gönder",
    icon: Droplets,
    colorClass: "bg-sky-500/15 text-sky-300",
  },
];

export default function WaiterCallSheet({
  venueId,
  tableNumber,
  open,
  onClose,
}: WaiterCallSheetProps) {
  const { remaining, isCoolingDown, startCooldown } = useCooldown(
    `lumina_cooldown_${venueId}_table_${tableNumber}`,
    60
  );
  const [lastSentLabel, setLastSentLabel] = useState<string | null>(null);

  const handleSelect = (type: ServiceRequestType, label: string) => {
    if (isCoolingDown) return;
    createServiceRequest(venueId, tableNumber, type);
    setLastSentLabel(label);
    startCooldown();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-[32px] border-t border-white/10 bg-[#151311] px-5 pb-8 pt-4 shadow-2xl"
          >
            {/* Drag Handle */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15" />

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Tek Tıkla Masa Servisi
                </h3>
                <p className="text-xs text-zinc-400">
                  Masa {tableNumber} · Talebiniz anında ekibe iletilir
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 active:scale-95"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isCoolingDown ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="mt-4 text-base font-semibold text-white">
                  Talebiniz iletildi, hemen geliyoruz
                </h4>
                <p className="mt-1 text-xs text-zinc-300">
                  {lastSentLabel
                    ? `"${lastSentLabel}" bildirimi personel ekranına düştü.`
                    : "Masa servisi talebiniz personel ekranına iletildi."}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-medium text-[#f3c78a]">
                  <Clock className="h-3.5 w-3.5" />
                  Yeni talep için {remaining} saniye
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {SERVICE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.type}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(opt.type, opt.title)}
                      className="flex w-full items-center gap-4 rounded-2xl border border-white/8 bg-[#1c1916] p-4 text-left transition-colors hover:border-[#d9a05b]/40"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${opt.colorClass}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          {opt.title}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-400">
                          {opt.subtitle}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
