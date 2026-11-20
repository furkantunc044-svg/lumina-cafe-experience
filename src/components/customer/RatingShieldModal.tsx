"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ExternalLink,
  MessageSquareWarning,
  Send,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { createFeedback } from "@/lib/realtime-store";
import { Venue } from "@/lib/types";

interface RatingShieldModalProps {
  venue: Venue;
  tableNumber: number;
  open: boolean;
  onClose: () => void;
}

export default function RatingShieldModal({
  venue,
  tableNumber,
  open,
  onClose,
}: RatingShieldModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const resetAndClose = () => {
    setRating(0);
    setComment("");
    setSubmitted(false);
    onClose();
  };

  const handleLowRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 3) return;
    createFeedback(
      venue.id,
      tableNumber,
      rating,
      comment || "Müşteri detaylı not bırakmadı.",
      false
    );
    setSubmitted(true);
  };

  const handleGoogleRedirect = () => {
    createFeedback(venue.id, tableNumber, rating, "", true);
    window.open(venue.google_review_url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-t-[32px] border-t border-white/10 bg-[#151311] px-5 pb-8 pt-4 shadow-2xl"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15" />

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Deneyiminizi Puanlayın
                </h3>
                <p className="text-xs text-zinc-400">
                  {venue.name} · Masa {tableNumber}
                </p>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="mt-4 text-base font-semibold text-white">
                  Geri Bildiriminiz İçin Teşekkürler
                </h4>
                <p className="mt-1 text-xs text-zinc-300">
                  {rating >= 4
                    ? "Güzel değerlendirmeniz bizi çok mutlu etti!"
                    : "Mesajınız doğrudan işletme yetkilisine iletildi. En kısa sürede ilgileneceğiz."}
                </p>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="mt-5 w-full rounded-2xl bg-white/10 py-3 text-xs font-semibold text-white"
                >
                  Kapat
                </button>
              </motion.div>
            ) : (
              <div className="space-y-5">
                {/* Star Selector */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= rating;
                    return (
                      <motion.button
                        key={star}
                        type="button"
                        whileTap={{ scale: 0.85 }}
                        onClick={() => setRating(star)}
                        className="p-1.5"
                        aria-label={`${star} Yıldız`}
                      >
                        <Star
                          className={`h-9 w-9 transition-colors ${
                            active
                              ? "fill-amber-400 text-amber-400"
                              : "text-zinc-600"
                          }`}
                        />
                      </motion.button>
                    );
                  })}
                </div>

                {/* 4-5 Stars -> Google Review */}
                {rating >= 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-[#231d12] to-[#161310] p-5 text-center"
                  >
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h4 className="mt-3 text-base font-semibold text-white">
                      Harika! Bizi Google&apos;da da desteklemek ister misiniz?
                    </h4>
                    <p className="mt-1 text-xs text-zinc-400">
                      Tek tıkla Google Haritalar yorum ekranına geçebilirsiniz.
                    </p>
                    <button
                      type="button"
                      onClick={handleGoogleRedirect}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d9a05b] to-[#f3c78a] py-3.5 text-sm font-semibold text-[#0c0b0a] active:scale-[0.98]"
                    >
                      Google&apos;da Yorum Yap
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}

                {/* 1-3 Stars -> Private Shield Feedback to Panel */}
                {rating >= 1 && rating <= 3 && (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleLowRatingSubmit}
                    className="space-y-3 rounded-3xl border border-red-500/25 bg-[#1b1313] p-4"
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-red-300">
                      <MessageSquareWarning className="h-4 w-4" />
                      Üzgünüz, deneyiminizi nasıl düzeltebiliriz?
                    </div>
                    <textarea
                      rows={3}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Yaşadığınız aksaklığı anonim olarak bize iletin..."
                      className="w-full rounded-2xl border border-white/10 bg-[#120e0e] px-3.5 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-3 text-xs font-semibold text-white active:scale-[0.98]"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Yetkiliye Anonim İlet
                    </button>
                  </motion.form>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
