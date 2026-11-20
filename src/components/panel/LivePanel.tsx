"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellRing,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Droplets,
  ExternalLink,
  Gift,
  HeartHandshake,
  MessageSquareWarning,
  Radio,
  ReceiptText,
  Search,
  Star,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  clearCompletedRequests,
  completeServiceRequest,
  findGiftCardByCode,
  getFeedbacks,
  getServiceRequests,
  getTips,
  redeemGiftCard,
  subscribeRealtime,
} from "@/lib/realtime-store";
import {
  Feedback,
  GiftCard,
  ServiceRequest,
  ServiceRequestType,
  TipRecord,
  Venue,
} from "@/lib/types";

interface LivePanelProps {
  venue: Venue;
}

const REQUEST_META: Record<
  ServiceRequestType,
  {
    label: string;
    badgeClass: string;
    borderClass: string;
    icon: typeof BellRing;
  }
> = {
  waiter: {
    label: "Garson Çağırıyor",
    badgeClass: "bg-[#d9a05b]/20 text-[#f3c78a]",
    borderClass: "border-[#d9a05b]/45",
    icon: BellRing,
  },
  bill: {
    label: "Hesap İstiyor",
    badgeClass: "bg-emerald-500/20 text-emerald-300",
    borderClass: "border-emerald-500/45",
    icon: ReceiptText,
  },
  water: {
    label: "Su / Peçete İstiyor",
    badgeClass: "bg-sky-500/20 text-sky-300",
    borderClass: "border-sky-500/45",
    icon: Droplets,
  },
};

const DEPT_LABELS: Record<TipRecord["department"], string> = {
  barista: "Barista",
  kitchen: "Mutfak",
  service: "Servis",
};

function playNotificationChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const notes = [880, 1174.66];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.001, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.16, now + idx * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.36);
    });
  } catch {
    // ignore autoplay block
  }
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function LivePanel({ venue }: LivePanelProps) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [tips, setTips] = useState<TipRecord[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [flashAlert, setFlashAlert] = useState<{
    text: string;
    urgent?: boolean;
  } | null>(null);

  // Gift card verifier state
  const [giftCodeInput, setGiftCodeInput] = useState("");
  const [foundCard, setFoundCard] = useState<GiftCard | null | "not_found">(
    null
  );

  const soundRef = useRef(soundEnabled);
  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  const refresh = useCallback(() => {
    setRequests(getServiceRequests(venue.id));
    setTips(getTips(venue.id));
    setFeedbacks(getFeedbacks(venue.id));
  }, [venue.id]);

  useEffect(() => {
    refresh();
    const unsubscribe = subscribeRealtime(refresh, (event) => {
      if (
        event.eventType === "NEW_SERVICE_REQUEST" &&
        event.payload.venue_id === venue.id
      ) {
        if (soundRef.current) playNotificationChime();
        const meta = REQUEST_META[event.payload.type];
        setFlashAlert({
          text: `Masa ${event.payload.table_number} — ${meta.label}`,
        });
        window.setTimeout(() => setFlashAlert(null), 4000);
      } else if (
        event.eventType === "NEW_TIP" &&
        event.payload.venue_id === venue.id
      ) {
        if (soundRef.current) playNotificationChime();
        setFlashAlert({
          text: `Masa ${event.payload.table_number} — ${event.payload.amount} ₺ Bahşiş (${DEPT_LABELS[event.payload.department]})`,
        });
        window.setTimeout(() => setFlashAlert(null), 4500);
      } else if (
        event.eventType === "NEW_FEEDBACK" &&
        event.payload.venue_id === venue.id &&
        event.payload.rating <= 3
      ) {
        if (soundRef.current) playNotificationChime();
        setFlashAlert({
          text: `ÖNCELİKLİ UYARI: Masa ${event.payload.table_number} (${event.payload.rating} Yıldız) — "${event.payload.comment}"`,
          urgent: true,
        });
        window.setTimeout(() => setFlashAlert(null), 6000);
      }
    });
    return unsubscribe;
  }, [refresh, venue.id]);

  const handleGiftSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCodeInput.trim()) return;
    const card = findGiftCardByCode(venue.id, giftCodeInput);
    setFoundCard(card ?? "not_found");
  };

  const handleGiftRedeem = () => {
    if (!foundCard || foundCard === "not_found") return;
    const updated = redeemGiftCard(venue.id, foundCard.code);
    if (updated) setFoundCard(updated);
  };

  const pending = requests.filter((r) => r.status === "pending");
  const completed = requests.filter((r) => r.status === "completed");
  const totalTipsAmount = tips.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#0c0b0a] px-4 py-6 text-[#f5f2ed] md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/8 bg-[#151311] p-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9a05b]/20 text-[#f3c78a]">
              <Coffee className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-white">
                  {venue.name} · Personel Paneli
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                  <Radio className="h-3 w-3 animate-pulse" />
                  Canlı
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Masa talepleri, bahşişler ve hediye çeki doğrulama tek ekranda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playNotificationChime();
              }}
              className={`inline-flex items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-medium transition-colors ${
                soundEnabled
                  ? "border-[#d9a05b]/40 bg-[#d9a05b]/15 text-[#f3c78a]"
                  : "border-white/10 bg-white/5 text-zinc-400"
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="h-4 w-4" />
                  Ses Açık
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4" />
                  Ses Kapalı
                </>
              )}
            </button>

            <Link
              href={`/${venue.slug}/masa-12`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-zinc-200 hover:border-white/20"
            >
              Masa 12&apos;yi Aç
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        {/* Live Flash Banner */}
        <AnimatePresence>
          {flashAlert && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12 }}
              className={`flex items-center justify-between rounded-2xl border px-5 py-3.5 shadow-xl ${
                flashAlert.urgent
                  ? "border-red-500/70 bg-gradient-to-r from-[#2e1212] to-[#1a1010]"
                  : "border-[#d9a05b]/60 bg-gradient-to-r from-[#2a1f13] to-[#1a1510]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    flashAlert.urgent
                      ? "bg-red-500 text-white"
                      : "bg-[#d9a05b] text-[#0c0b0a]"
                  }`}
                >
                  {flashAlert.urgent ? (
                    <MessageSquareWarning className="h-4 w-4 animate-bounce" />
                  ) : (
                    <BellRing className="h-4 w-4 animate-bounce" />
                  )}
                </span>
                <div>
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-wider ${
                      flashAlert.urgent ? "text-red-300" : "text-[#f3c78a]"
                    }`}
                  >
                    {flashAlert.urgent
                      ? "İtibar Kalkanı · Kırmızı Uyarı"
                      : "Yeni Canlı Bildirim"}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {flashAlert.text}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-[#151311] p-4">
            <p className="text-xs text-zinc-400">Bekleyen Talep</p>
            <p className="mt-1 text-2xl font-bold text-[#f3c78a]">
              {pending.length}
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-[#151311] p-4">
            <p className="text-xs text-zinc-400">Tamamlanan</p>
            <p className="mt-1 text-2xl font-bold text-emerald-300">
              {completed.length}
            </p>
          </div>
          <div className="col-span-2 rounded-2xl border border-white/8 bg-[#151311] p-4 sm:col-span-1">
            <p className="text-xs text-zinc-400">Toplam Dijital Bahşiş</p>
            <p className="mt-1 text-2xl font-bold text-rose-300">
              {totalTipsAmount.toLocaleString("tr-TR")} ₺
            </p>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left 2 cols: Pending Service Requests + Completed */}
          <div className="space-y-6 lg:col-span-2">
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Bekleyen Masa Talepleri ({pending.length})
              </h2>

              {pending.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-[#141210] p-8 text-center">
                  <CheckCircle2 className="mx-auto h-9 w-9 text-zinc-600" />
                  <p className="mt-3 text-sm font-medium text-zinc-300">
                    Şu an bekleyen masa talebi yok
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Masa 12 ekranından gelen çağrılar anında burada belirir.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {pending.map((req) => {
                      const meta = REQUEST_META[req.type];
                      const Icon = meta.icon;
                      return (
                        <motion.div
                          key={req.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 30 }}
                          className={`flex flex-wrap items-center justify-between gap-4 rounded-3xl border ${meta.borderClass} bg-[#181512] p-4 shadow-lg`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${meta.badgeClass}`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="rounded-lg bg-white/10 px-2.5 py-0.5 text-xs font-bold text-white">
                                  Masa {req.table_number}
                                </span>
                                <span className="text-sm font-semibold text-white">
                                  {meta.label}
                                </span>
                              </div>
                              <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                                <Clock className="h-3.5 w-3.5" />
                                {formatTime(req.created_at)}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              completeServiceRequest(req.id);
                              refresh();
                            }}
                            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-[#0c0b0a] shadow-md transition-transform active:scale-95"
                          >
                            <Check className="h-4 w-4" />
                            Tamamlandı
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </section>

            {/* Completed History */}
            {completed.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                    Tamamlananlar ({completed.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      clearCompletedRequests(venue.id);
                      refresh();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Temizle
                  </button>
                </div>
                <div className="space-y-2">
                  {completed.map((req) => {
                    const meta = REQUEST_META[req.type];
                    return (
                      <div
                        key={req.id}
                        className="flex items-center justify-between rounded-2xl border border-white/6 bg-[#13110f] px-4 py-3 opacity-70"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span className="text-xs font-semibold text-zinc-200">
                            Masa {req.table_number}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {meta.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-500">
                          {formatTime(req.created_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Right Col: Gift Card Verifier + Live Tips */}
          <div className="space-y-6">
            {/* Gift Card Verifier */}
            <section className="rounded-3xl border border-purple-500/25 bg-[#151311] p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                  <Gift className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Hediye Çeki Doğrulama
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    6 haneli kodu sorgulayın
                  </p>
                </div>
              </div>

              <form onSubmit={handleGiftSearch} className="mt-4 flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={giftCodeInput}
                  onChange={(e) =>
                    setGiftCodeInput(e.target.value.toUpperCase())
                  }
                  placeholder="Örn: 8K4M2P"
                  className="w-full rounded-xl border border-white/10 bg-[#0f0d0c] px-3 py-2.5 font-mono text-sm uppercase tracking-widest text-white placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-600 focus:border-purple-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex shrink-0 items-center justify-center rounded-xl bg-purple-500 px-3.5 text-white active:scale-95"
                  aria-label="Sorgula"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {foundCard === "not_found" && (
                <p className="mt-3 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  Bu koda ait hediye çeki bulunamadı.
                </p>
              )}

              {foundCard && foundCard !== "not_found" && (
                <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-black/35 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-[#f3c78a]">
                      {foundCard.code}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        foundCard.is_redeemed
                          ? "bg-zinc-700 text-zinc-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {foundCard.is_redeemed ? "Kullanıldı" : "Aktif"}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {foundCard.amount.toLocaleString("tr-TR")} ₺ ·{" "}
                    <span className="text-xs font-normal text-zinc-400">
                      {foundCard.package_name}
                    </span>
                  </p>
                  <p className="text-xs text-zinc-400">
                    Gönderen: {foundCard.sender_name}
                  </p>
                  {!foundCard.is_redeemed && (
                    <button
                      type="button"
                      onClick={handleGiftRedeem}
                      className="w-full rounded-xl bg-emerald-500 py-2 text-xs font-semibold text-[#0c0b0a] active:scale-95"
                    >
                      Kullanıldı Olarak İşaretle
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Reputation Shield: Low Rating Red Priority Alerts */}
            {feedbacks.filter((f) => f.rating <= 3).length > 0 && (
              <section className="rounded-3xl border border-red-500/40 bg-[#1a1111] p-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                    <MessageSquareWarning className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-red-200">
                      İtibar Kalkanı Uyarıları (
                      {feedbacks.filter((f) => f.rating <= 3).length})
                    </h2>
                    <p className="text-[11px] text-red-300/70">
                      1-3 yıldız · Google&apos;a yönlendirilmedi
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  {feedbacks
                    .filter((f) => f.rating <= 3)
                    .map((fb) => (
                      <div
                        key={fb.id}
                        className="rounded-2xl border border-red-500/25 bg-black/35 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            Masa {fb.table_number}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[11px] font-semibold text-red-300">
                            <Star className="h-3 w-3 fill-red-400 text-red-400" />
                            {fb.rating} / 5
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-zinc-200">
                          {fb.comment}
                        </p>
                        <p className="mt-1 text-[10px] text-zinc-500">
                          {formatTime(fb.created_at)}
                        </p>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {/* Live Tips Feed */}
            <section className="rounded-3xl border border-rose-500/20 bg-[#151311] p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Gelen Bahşişler ({tips.length})
                  </h2>
                  <p className="text-[11px] text-zinc-400">
                    Canlı ekip motivasyon akışı
                  </p>
                </div>
              </div>

              {tips.length === 0 ? (
                <p className="mt-4 text-xs text-zinc-500">
                  Henüz dijital bahşiş gelmedi.
                </p>
              ) : (
                <div className="mt-4 space-y-2.5">
                  {tips.map((tip) => (
                    <div
                      key={tip.id}
                      className="rounded-2xl border border-white/8 bg-[#1a1614] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">
                          Masa {tip.table_number} · {DEPT_LABELS[tip.department]}
                        </span>
                        <span className="text-sm font-bold text-rose-300">
                          +{tip.amount} ₺
                        </span>
                      </div>
                      {tip.note && (
                        <p className="mt-1 text-xs italic text-zinc-400">
                          &ldquo;{tip.note}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
