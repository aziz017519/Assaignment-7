import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import PageLoader from "@/app/components/PageLoader";

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface ProductDetails {
  id: number;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday?: number;
  change: { dir: string; pct: number };
  markets: Market[];
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

const CHANGE_STYLES = {
up:   { arrow: "▲", colors: "bg-green-50 text-green-700" },
down: { arrow: "▼", colors: "bg-red-50 text-red-700" },
  flat: { arrow: "—", colors: "text-gray-600" },
};

const toBanglaNumber = (value: number) => Number(value).toLocaleString("bn-BD");

const toBanglaPrice = (value: number) =>
  Number(value).toLocaleString("bn-BD", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });

const toBanglaPercent = (value: number) =>
  Number(value).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const getAveragePrice = (lowest: number, highest: number) => (lowest + highest) / 2;

const getProduct = async (id: string): Promise<ProductDetails | null> => {
  "use cache";
  cacheLife("hours");

  const response = await fetch(
    `https://api.abcz.workers.dev/api/bazardor/products/${encodeURIComponent(id)}`,
    { signal: AbortSignal.timeout(8000) }
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Product fetch failed: ${response.status}`);

  return response.json();
};

const ChangeSentence = ({ direction, amount }: { direction: string; amount: number }) => {
  if (direction === "up") {
    return (
      <>
        গতকালের তুলনায় আজ দাম <strong className="text-gray-900">বেড়েছে</strong> ·{" "}
        <span className="font-notosans">{toBanglaNumber(amount)}</span> টাকা
      </>
    );
  }

  if (direction === "down") {
    return (
      <>
        গতকালের তুলনায় আজ দাম <strong className="text-gray-900">কমেছে</strong> ·{" "}
        <span className="font-notosans">{toBanglaNumber(amount)}</span> টাকা
      </>
    );
  }

  return <>গতকালের তুলনায় আজ দাম অপরিবর্তিত</>;
};

const SummaryCard = ({
  label,
  price,
  note,
  priceColor,
}: {
  label: string;
  price: number;
  note: string;
  priceColor: string;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-[#FAFCFA] px-4 py-3 sm:px-6 sm:py-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`mt-1 font-notosans ${priceColor}`}>
      <span className="text-2xl font-bold sm:text-3xl">{toBanglaPrice(price)}</span> টাকা
    </p>
    <p className="mt-1 text-sm text-gray-500">{note}</p>
  </div>
);

const ProductDetailsContent = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  let product: ProductDetails | null;

  try {
    product = await getProduct(id);
  } catch (error) {
    console.error("ProductDetails:", error);
    return (
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-gray-200 bg-[#FAFCFA] px-4 py-8 text-center sm:px-6 sm:py-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl sm:h-14 sm:w-14 sm:text-2xl">
            ⚠️
          </div>
          <h1 className="mt-4 text-base font-bold text-gray-900 sm:text-lg">
            তথ্য লোড করা যায়নি
          </h1>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            সার্ভার থেকে পণ্যের তথ্য আনতে সমস্যা হচ্ছে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।
          </p>
          <Link
            href="/"
            className="mt-5 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  if (!product) notFound();

  const direction = product.change?.dir ?? "flat";
  const percent = Math.abs(product.change?.pct ?? 0);
  const amount =
    typeof product.yesterday === "number"
      ? Math.abs(product.today - product.yesterday)
      : 0;
  const changeStyle =
    direction === "up"
      ? CHANGE_STYLES.up
      : direction === "down"
        ? CHANGE_STYLES.down
        : CHANGE_STYLES.flat;

  const unitLabel = UNIT_LABELS[product.unit] ?? product.unit;
  const markets = product.markets ?? [];
  const hasMarkets = markets.length > 0;

  const lowestPrice = hasMarkets ? Math.min(...markets.map((market) => market.min)) : 0;
  const highestPrice = hasMarkets ? Math.max(...markets.map((market) => market.max)) : 0;
  const averagePrice = getAveragePrice(lowestPrice, highestPrice);

  const marketRows = markets
    .map((market) => ({
      ...market,
      average: getAveragePrice(market.min, market.max),
    }))
    .sort((a, b) => a.average - b.average);

  return (
    <div className="container mx-auto px-4 py-5 sm:py-6">
      <nav className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-600 sm:mb-6 sm:text-base">
        <Link href="/" className="hover:text-green-700">
          হোম
        </Link>
        <span className="text-gray-400">›</span>
        <Link href={`/category/${product.category}`} className="hover:text-green-700">
          {product.categoryNameBn}
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-900">{product.nameBn}</span>
      </nav>

      <section className="rounded-2xl border border-gray-200 bg-[#FAFCFA] p-4 sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-3xl sm:h-24 sm:w-24 sm:text-5xl">
              {product.image}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl">
                {product.nameBn}
              </h1>
              <div className="mt-1.5">
                <p className="text-sm text-gray-500 sm:text-base">
                  প্রতি {unitLabel} · {product.categoryNameBn}
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                <ChangeSentence direction={direction} amount={amount} />
              </p>
            </div>
          </div>

          <div className="w-full rounded-2xl bg-gray-100 px-6 py-4 text-center md:w-auto md:shrink-0 md:px-8">
            <p className="text-gray-600">আজকের দাম</p>
            <p className="font-notosans text-4xl font-bold text-gray-900 sm:text-5xl">
              {toBanglaNumber(product.today)}
            </p>
            <p className="text-gray-600">টাকা / {unitLabel}</p>
            <p
              className={`mt-1 inline-flex items-center gap-1.5 text-base font-semibold font-[family-name:var(--font-noto-bengali)] sm:text-[17px] ${changeStyle.colors}`}
            >
              <span className="text-[10px]">{changeStyle.arrow}</span>
              {toBanglaPercent(percent)}%
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-gray-200 bg-[#FAFCFA] p-4 sm:mt-6 sm:p-6">
        {hasMarkets ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">দামের সারসংক্ষেপ</h2>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 md:grid-cols-3">
              <SummaryCard
                label="সর্বনিম্ন দাম"
                price={lowestPrice}
                note="সবচেয়ে কম দামের বাজার"
                priceColor="text-green-700"
              />
              <SummaryCard
                label="সর্বাধিক দাম"
                price={highestPrice}
                note="সবচেয়ে বেশি দামের বাজার"
                priceColor="text-red-600"
              />
              <SummaryCard
                label="গড় দাম"
                price={averagePrice}
                note={`প্রতি ${unitLabel}-এর হিসাবে`}
                priceColor="text-green-700"
              />
            </div>

            <h2 className="mb-3 mt-6 text-xl font-bold text-gray-900 sm:mb-4 sm:mt-8 sm:text-2xl">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <div className="hidden overflow-x-auto rounded-xl border border-gray-200 md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="px-5 py-3 font-medium">বাজার</th>
                    <th className="px-5 py-3 font-medium">বিভাগ</th>
                    <th className="px-5 py-3 text-right font-medium">সর্বনিম্ন</th>
                    <th className="px-5 py-3 text-right font-medium">সর্বাধিক</th>
                    <th className="px-5 py-3 text-right font-medium">গড়</th>
                  </tr>
                </thead>
                <tbody>
                  {marketRows.map((row, index) => {
                    const cell = index === marketRows.length - 1 ? "" : "border border-black ";
                    return (
                    <tr key={row.market} className="even:bg-[#F3F7F3]">
                      <td className={`${cell}px-5 py-3 text-gray-900`}>{row.market}</td>
                      <td className={`${cell}px-5 py-3 text-gray-500`}>{row.division}</td>
                      <td className={`${cell}px-5 py-3 text-right font-notosans text-gray-700`}>
                        {toBanglaPrice(row.min)} টাকা
                      </td>
                      <td className={`${cell}px-5 py-3 text-right font-notosans text-gray-700`}>
                        {toBanglaPrice(row.max)} টাকা
                      </td>
                      <td className={`${cell}px-5 py-3 text-right font-notosans font-bold text-gray-900`}>
                        {toBanglaPrice(row.average)} টাকা
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="flex flex-col gap-3 md:hidden">
              {marketRows.map((row) => (
                <li
                  key={row.market}
                  className="rounded-xl border border-gray-200 bg-white p-3.5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="min-w-0 truncate font-semibold text-gray-900">
                      {row.market}
                    </p>
                    <p className="shrink-0 text-xs text-gray-500">{row.division}</p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-gray-50 px-1 py-2">
                      <p className="text-xs text-gray-500">সর্বনিম্ন</p>
                      <p className="mt-0.5 font-notosans text-sm text-gray-700">
                        {toBanglaPrice(row.min)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 px-1 py-2">
                      <p className="text-xs text-gray-500">সর্বাধিক</p>
                      <p className="mt-0.5 font-notosans text-sm text-gray-700">
                        {toBanglaPrice(row.max)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 px-1 py-2">
                      <p className="text-xs text-gray-500">গড়</p>
                      <p className="mt-0.5 font-notosans text-sm font-bold text-gray-900">
                        {toBanglaPrice(row.average)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="py-6 text-center text-gray-500">
            এই পণ্যের বাজারভিত্তিক দাম এখনো পাওয়া যায়নি।
          </p>
        )}
      </section>

      <Link
        href={`/category/${product.category}`}
        className="mt-5 inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-green-700 sm:mt-6"
      >
        <span>{product.categoryIcon}</span>
        সব {product.categoryNameBn}
      </Link>
    </div>
  );
};

const ProductDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
};

export default ProductDetailsPage;