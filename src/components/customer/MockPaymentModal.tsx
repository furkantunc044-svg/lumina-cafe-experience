"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  Smartphone,
  X,
} from "lucide-react";

interface MockPaymentModalProps {
  open: boolean;
  amount: number;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MockPaymentModal({
  open,
  amount,
  title,
  subtitle,
  onClose,
  onSuccess,
}: MockPaymentModalProps) {
  const [method, setMethod] = useState<"apple" | "card">("apple");
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");

  const handlePay = () => {
    if (status !== "idle") return;
    setStatus("processing");
    window.setTimeout(() => {
      setStatus("done");
      window.setTimeout(() => {
        onSuccess();
        setStatus("idle");
      }, 900);
    }, 1100);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => status === "idle" && onClose()}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-[32px] border-t border-white/10 bg-[#151311] px-5 pb-8 pt-4 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15" />

            {status === "done" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  Ödeme Onaylandı
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {amount.toLocaleString("tr-TR")} ₺ başarıyla tahsil edildi (Demo)
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#d9a05b]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#f3c78a]">
                      Demo POS Simülasyonu
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {title}
                    </h3>
                    {subtitle && (
                      <p className="text-xs text-zinc-400">{subtitle}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={status === "processing"}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300"
                    aria-label="Kapat"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Amount Summary */}
                <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/8 bg-[#1c1916] px-4 py-3.5">
                  <span className="text-xs text-zinc-400">Ödenecek Tutar</span>
                  <span className="text-xl font-bold text-[#f3c78a]">
                    {amount.toLocaleString("tr-TR")} ₺
                  </span>
                </div>

                {/* Payment Method Switcher */}
                <div className="mb-4 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMethod("apple")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border py-3 text-xs font-semibold transition-all ${
                      method === "apple"
                        ? "border-[#d9a05b] bg-[#d9a05b]/15 text-white"
                        : "border-white/8 bg-[#1a1714] text-zinc-400"
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    Apple / Google Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("card")}
                    className={`flex items-center justify-center gap-2 rounded-2xl border py-3 text-xs font-semibold transition-all ${
                      method === "card"
                        ? "border-[#d9a05b] bg-[#d9a05b]/15 text-white"
                        : "border-white/8 bg-[#1a1714] text-zinc-400"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    Kredi Kartı
                  </button>
                </div>

                {method === "card" && (
                  <div className="mb-5 space-y-2.5 rounded-2xl border border-white/8 bg-[#1a1714] p-3.5 text-xs">
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>Demo Kart</span>
                      <span className="font-mono text-[#f3c78a]">
                        •••• •••• •••• 4242
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>SKT: 12/29 · CVC: •••</span>
                      <span>Iyzico / Stripe Ready</span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={status === "processing"}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d9a05b] to-[#f3c78a] py-3.5 text-sm font-semibold text-[#0c0b0a] shadow-lg active:scale-[0.98] disabled:opacity-70"
                >
                  {status === "processing" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Ödeme İşleniyor...
                    </>
                  ) : method === "apple" ? (
                    <>Tek Tıkla Öde · {amount.toLocaleString("tr-TR")} ₺</>
                  ) : (
                    <>Kart ile Öde · {amount.toLocaleString("tr-TR")} ₺</>
                  )}
                </button>

                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                  <Lock className="h-3 w-3" />
                  Gerçek çekim yapılmaz · Güvenli demo simülasyonu
                </p>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
