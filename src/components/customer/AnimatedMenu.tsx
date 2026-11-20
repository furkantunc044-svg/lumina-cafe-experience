"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  BellRing,
  Check,
  Clock,
  Flame,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import {
  ALLERGEN_LABELS,
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  getProductById,
} from "@/lib/demo-data";
import { Product, Venue } from "@/lib/types";
import WaiterCallSheet from "./WaiterCallSheet";

interface AnimatedMenuProps {
  venue: Venue;
  tableNumber: number;
  tableSlug: string;
}

export default function AnimatedMenu({
  venue,
  tableNumber,
  tableSlug,
}: AnimatedMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    DEMO_CATEGORIES[0].id
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectionList, setSelectionList] = useState<
    { product: Product; qty: number }[]
  >([]);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [waiterSheetOpen, setWaiterSheetOpen] = useState(false);

  const filteredProducts = useMemo(
    () => DEMO_PRODUCTS.filter((p) => p.category_id === activeCategory),
    [activeCategory]
  );

  const pairedProduct = useMemo(
    () => getProductById(selectedProduct?.paired_product_id),
    [selectedProduct]
  );

  const totalSelectedCount = useMemo(
    () => selectionList.reduce((acc, item) => acc + item.qty, 0),
    [selectionList]
  );

  const totalSelectedPrice = useMemo(
    () =>
      selectionList.reduce(
        (acc, item) => acc + item.product.price * item.qty,
        0
      ),
    [selectionList]
  );

  const addToSelection = (product: Product) => {
    setSelectionList((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setAddedToast(`${product.name} listenize eklendi`);
    window.setTimeout(() => {
      setAddedToast((prev) =>
        prev === `${product.name} listenize eklendi` ? null : prev
      );
    }, 2000);
  };

  const getMotionClass = (style: Product["motion_style"]) => {
    if (style === "zoom") return "animate-motion-zoom";
    if (style === "pan") return "animate-motion-pan";
    return "animate-motion-float";
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md bg-[#0c0b0a] pb-24">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-30 border-b border-white/8 bg-[#0c0b0a]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3.5">
          <Link
            href={`/${venue.slug}/${tableSlug}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#171412] text-zinc-200 active:scale-95"
            aria-label="Ana ekrana dön"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="text-center">
            <p className="text-sm font-semibold tracking-tight text-white">
              {venue.name}
            </p>
            <p className="text-[11px] text-[#d9a05b]">
              Masa {tableNumber} · Hareketli Menü
            </p>
          </div>

          <div className="flex h-9 items-center gap-1.5 rounded-full border border-[#d9a05b]/30 bg-[#1b1612] px-3 text-xs font-medium text-[#f3c78a]">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>{totalSelectedCount}</span>
          </div>
        </div>

        {/* Sticky Horizontal Category Tabs */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 pt-1">
          {DEMO_CATEGORIES.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-[#0c0b0a]"
                    : "border border-white/8 bg-[#161412] text-zinc-300"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeCategoryPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#d9a05b] to-[#f3c78a]"
                  />
                )}
                <span className="relative z-10">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Header */}
      <div className="px-4 pb-2 pt-5">
        {DEMO_CATEGORIES.filter((c) => c.id === activeCategory).map((cat) => (
          <div key={cat.id} className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                {cat.name}
              </h2>
              <p className="text-xs text-zinc-400">{cat.subtitle}</p>
            </div>
            <span className="text-[11px] text-zinc-500">
              {filteredProducts.length} ürün
            </span>
          </div>
        ))}
      </div>

      {/* Animated Product Cards */}
      <div className="space-y-4 px-4 pt-3">
        {filteredProducts.map((product, index) => (
          <motion.article
            key={product.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            onClick={() => setSelectedProduct(product)}
            className="group cursor-pointer overflow-hidden rounded-[26px] border border-white/8 bg-[#151311] shadow-xl transition-colors hover:border-[#d9a05b]/35 active:scale-[0.985]"
          >
            {/* Animated Loop Visual Container */}
            <div className="relative h-48 w-full overflow-hidden bg-[#1b1815]">
              <img
                src={product.media_url}
                alt={product.name}
                loading="lazy"
                className={`${getMotionClass(
                  product.motion_style
                )} h-full w-full object-cover`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151311] via-transparent to-black/30" />

              {/* Top Badges */}
              <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
                {product.badge ? (
                  <span className="rounded-full border border-[#d9a05b]/40 bg-black/55 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#f3c78a] backdrop-blur-md">
                    {product.badge}
                  </span>
                ) : (
                  <span />
                )}

                <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium text-zinc-200 backdrop-blur-md">
                  <Clock className="h-3 w-3 text-[#d9a05b]" />
                  {product.prep_time}
                </span>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-3 right-3 rounded-2xl border border-white/10 bg-[#0c0b0a]/85 px-3 py-1.5 text-sm font-semibold text-[#f3c78a] backdrop-blur-md">
                {product.price} ₺
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-white">
                  {product.name}
                </h3>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                {product.description}
              </p>

              {/* Allergens & Smart Pairing Hint */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {product.allergens.length > 0 ? (
                    product.allergens.map((a) => (
                      <span
                        key={a}
                        className="rounded-md border border-white/8 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400"
                      >
                        {ALLERGEN_LABELS[a].short}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                      Alerjen İçermez
                    </span>
                  )}
                </div>

                {product.paired_product_id && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#d9a05b]">
                    <Sparkles className="h-3 w-3" />
                    Eşleşme Önerili
                  </span>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Floating Selection Summary Bar */}
      <AnimatePresence>
        {totalSelectedCount > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-4 left-1/2 z-30 w-[92%] max-w-md -translate-x-1/2"
          >
            <div className="flex items-center justify-between rounded-2xl border border-[#d9a05b]/40 bg-[#1a1612]/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
              <div>
                <p className="text-xs font-semibold text-white">
                  Seçilenler ({totalSelectedCount} ürün)
                </p>
                <p className="text-[11px] text-zinc-400">
                  Toplam: <span className="text-[#f3c78a]">{totalSelectedPrice} ₺</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectionList([])}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 active:scale-95"
              >
                Temizle
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Bottom Sheet + Smart Cross-Sell Engine */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-1/2 z-50 max-h-[90vh] w-full max-w-md -translate-x-1/2 overflow-y-auto rounded-t-[32px] border-t border-white/10 bg-[#141210] pb-6 shadow-2xl"
            >
              {/* Hero Image */}
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={selectedProduct.media_url}
                  alt={selectedProduct.name}
                  className={`${getMotionClass(
                    selectedProduct.motion_style
                  )} h-full w-full object-cover`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-black/40" />

                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md active:scale-95"
                  aria-label="Kapat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-5 pt-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedProduct.name}
                  </h3>
                  <span className="shrink-0 text-xl font-bold text-[#f3c78a]">
                    {selectedProduct.price} ₺
                  </span>
                </div>

                {/* Meta chips */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
                    <Clock className="h-3.5 w-3.5 text-[#d9a05b]" />
                    {selectedProduct.prep_time}
                  </span>
                  {selectedProduct.calories && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
                      <Flame className="h-3.5 w-3.5 text-amber-400" />
                      {selectedProduct.calories}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  {selectedProduct.description}
                </p>

                {/* Allergens */}
                {selectedProduct.allergens.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 inline-flex items-center gap-1 text-[11px] text-zinc-500">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Alerjenler:
                    </span>
                    {selectedProduct.allergens.map((a) => (
                      <span
                        key={a}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-zinc-300"
                      >
                        {ALLERGEN_LABELS[a].label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Primary Add Button */}
                <button
                  type="button"
                  onClick={() => addToSelection(selectedProduct)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d9a05b] to-[#f3c78a] py-3.5 text-sm font-semibold text-[#0c0b0a] shadow-lg active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" />
                  Listeme Ekle · {selectedProduct.price} ₺
                </button>

                {/* Modül 2: Akıllı Yan Ürün Öneri Motoru */}
                {pairedProduct && (
                  <div className="mt-5 rounded-3xl border border-[#d9a05b]/30 bg-gradient-to-br from-[#201912] to-[#161310] p-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#f3c78a]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Akıllı Eşleştirme
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                      {selectedProduct.pairing_note}
                    </p>

                    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/8 bg-black/30 p-2.5">
                      <img
                        src={pairedProduct.media_url}
                        alt={pairedProduct.name}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-white">
                          {pairedProduct.name}
                        </p>
                        <p className="mt-0.5 text-xs font-semibold text-[#f3c78a]">
                          {pairedProduct.price} ₺
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(pairedProduct)}
                          className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-[11px] font-medium text-zinc-200 active:scale-95"
                        >
                          İncele
                        </button>
                        <button
                          type="button"
                          onClick={() => addToSelection(pairedProduct)}
                          className="flex items-center gap-1 rounded-xl bg-[#d9a05b] px-2.5 py-2 text-[11px] font-semibold text-[#0c0b0a] active:scale-95"
                        >
                          <Plus className="h-3 w-3" />
                          Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Quick Waiter Call Button */}
      <button
        type="button"
        onClick={() => setWaiterSheetOpen(true)}
        className={`fixed right-4 z-30 flex items-center gap-2 rounded-full border border-[#d9a05b]/50 bg-[#1a1612]/95 px-4 py-3 text-xs font-semibold text-[#f3c78a] shadow-2xl backdrop-blur-md transition-all active:scale-95 ${
          totalSelectedCount > 0 ? "bottom-20" : "bottom-5"
        }`}
      >
        <BellRing className="h-4 w-4" />
        Garson Çağır
      </button>

      <WaiterCallSheet
        venueId={venue.id}
        tableNumber={tableNumber}
        open={waiterSheetOpen}
        onClose={() => setWaiterSheetOpen(false)}
      />

      {/* Added Toast */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-500/30 bg-[#121a15]/95 px-4 py-2 text-xs font-medium text-emerald-300 shadow-xl backdrop-blur-md"
          >
            <Check className="h-3.5 w-3.5" />
            {addedToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
