"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ExternalLink,
  Instagram,
  MapPin,
  Share2,
  Video,
  X,
} from "lucide-react";
import { Venue } from "@/lib/types";

interface SocialSheetProps {
  venue: Venue;
  open: boolean;
  onClose: () => void;
}

export default function SocialSheet({ venue, open, onClose }: SocialSheetProps) {
  const [copiedStory, setCopiedStory] = useState(false);

  const handleShareStory = async () => {
    const text = `☕ ${venue.name} keyfi! @${venue.slug}coffee`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: venue.name,
          text,
          url: window.location.href,
        });
        return;
      } catch {
        // fallback to copy
      }
    }
    navigator.clipboard?.writeText(text);
    setCopiedStory(true);
    window.setTimeout(() => setCopiedStory(false), 2200);
  };

  const whatsappLocationUrl = `https://wa.me/?text=${encodeURIComponent(
    `📍 Şu an ${venue.name}'dayım! Adres: ${venue.address}`
  )}`;

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
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15" />

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Sosyal Medya &amp; Mekan Vitrini
                </h3>
                <p className="text-xs text-zinc-400">{venue.address}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <a
                href={venue.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#1c1916] p-4 transition-colors hover:border-pink-500/40"
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20 text-pink-300">
                    <Instagram className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Instagram&apos;da Takip Et
                    </p>
                    <p className="text-xs text-zinc-400">@{venue.slug}coffee</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-zinc-500" />
              </a>

              <a
                href={venue.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-white/8 bg-[#1c1916] p-4 transition-colors hover:border-cyan-400/40"
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                    <Video className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      TikTok&apos;ta Keşfet
                    </p>
                    <p className="text-xs text-zinc-400">@{venue.slug}bistro</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-zinc-500" />
              </a>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleShareStory}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[#d9a05b]/35 bg-[#d9a05b]/15 py-3.5 text-xs font-semibold text-[#f3c78a] active:scale-95"
                >
                  {copiedStory ? (
                    <>
                      <Check className="h-4 w-4" />
                      Etiket Kopyalandı
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Hikayende Paylaş
                    </>
                  )}
                </button>

                <a
                  href={whatsappLocationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-xs font-semibold text-[#0c0b0a] active:scale-95"
                >
                  <MapPin className="h-4 w-4" />
                  Konumu Gönder
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
