"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface Product {
  id: number;
  nameBn: string;
  unit: string;
  image: string;
  today: number;
  change: { dir: string; pct: number };
}

const UNIT_LABELS: Record<string, string> = {
  kg: "কেজি",
  dozen: "ডজন",
  litre: "লিটার",
  liter: "লিটার",
  piece: "পিস",
  pcs: "পিস",
  gram: "গ্রাম",
};

const SORT_OPTIONS = [
  { value: "default", label: "ডিফল্ট" },
  { value: "price-asc", label: "দাম: কম থেকে বেশি" },
  { value: "price-desc", label: "দাম: বেশি থেকে কম" },
  { value: "rise", label: "দাম: বেশি বেড়েছে" },
  { value: "fall", label: "দাম: বেশি কমেছে" },
];

const CHANGE_STYLES = {
  up:   { arrow: "▲", colors: "bg-green-50 text-green-700" },
down: { arrow: "▼", colors: "bg-red-50 text-red-700" },
  flat: { arrow: "—", colors: "bg-gray-100 text-gray-600" },
};

const toBanglaNumber = (value: number) => Number(value).toLocaleString("bn-BD");

const toBanglaPercent = (value: number) =>
  Number(value).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const getSignedChange = (product: Product) => {
  const percent = Math.abs(product.change?.pct ?? 0);
  if (product.change?.dir === "up") return percent;
  if (product.change?.dir === "down") return -percent;
  return 0;
};

const PriceChange = ({ product }: { product: Product }) => {
  const direction = product.change?.dir;
  const percent = Math.abs(product.change?.pct ?? 0);

  const style =
    direction === "up"
      ? CHANGE_STYLES.up
      : direction === "down"
        ? CHANGE_STYLES.down
        : CHANGE_STYLES.flat;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-medium font-notosans sm:px-3 sm:text-[15px] ${style.colors}`}
    >
      <span className="text-[10px]">{style.arrow}</span>
      {toBanglaPercent(percent)}%
    </span>
  );
};

const AllProducts = ({
  products,
  showTitle = true,
}: {
  products: Product[];
  showTitle?: boolean;
}) => {
  const [sortBy, setSortBy] = useState("default");

  const sortedProducts = useMemo(() => {
    const productList = [...products];

    switch (sortBy) {
      case "price-asc":
        return productList.sort((a, b) => a.today - b.today);
      case "price-desc":
        return productList.sort((a, b) => b.today - a.today);
      case "rise":
        return productList.sort((a, b) => getSignedChange(b) - getSignedChange(a));
      case "fall":
        return productList.sort((a, b) => getSignedChange(a) - getSignedChange(b));
      default:
        return productList;
    }
  }, [products, sortBy]);

  return (
    <section
      id="all-products"
      className="container mx-auto scroll-mt-6 px-4 py-6 sm:py-8"
    >
      {showTitle && (
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">সব পণ্য</h2>
      )}

      <div className="mb-3 mt-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600 sm:text-base">
          মোট {toBanglaNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        <label className="flex items-center justify-between gap-2 text-sm text-gray-600 sm:justify-start sm:text-base">
          সাজান
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-green-600 sm:flex-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {sortedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product-details/${product.id}`}
            className="block rounded-2xl border border-gray-200 bg-[#FAFCFA] p-3.5 transition hover:border-green-600 hover:shadow-md sm:p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl sm:h-12 sm:w-12 sm:text-2xl">
                {product.image}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold leading-tight text-gray-900 sm:text-lg">
                  {product.nameBn}
                </h3>
                <p className="text-xs text-gray-500">
                  প্রতি {UNIT_LABELS[product.unit] ?? product.unit}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">আজকের দাম</p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-gray-900">
                <span className="text-lg font-bold sm:text-xl">
                  {toBanglaNumber(product.today)}
                </span>{" "}
                টাকা
              </p>
              <PriceChange product={product} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AllProducts;