import Link from "next/link";
import { cacheLife } from "next/cache";

interface Product {
  id: number;
  nameBn: string;
  unit: string;
  image: string;
  today: number;
  change: { dir: "up" | "down"; pct: number };
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

const toBanglaNumber = (value: number) => Number(value).toLocaleString("bn-BD");

const toBanglaPercent = (value: number) =>
  Number(value).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");

  const response = await fetch(
    "https://api.abcz.workers.dev/api/bazardor/products",
    { signal: AbortSignal.timeout(8000) }
  );

  if (!response.ok) throw new Error(`Products fetch failed: ${response.status}`);

  return response.json();
}

const PriceUp = async () => {
  let products: Product[];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("PriceUp:", error);
    return (
      <section className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-[#FAFCFA] px-4 py-8 text-center sm:px-6 sm:py-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl sm:h-14 sm:w-14 sm:text-2xl">
            ⚠️
          </div>
          <h2 className="mt-4 text-base font-bold text-gray-900 sm:text-lg">
            তথ্য লোড করা যায়নি
          </h2>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            সার্ভার থেকে বাজারদর আনতে সমস্যা হচ্ছে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।
          </p>
        </div>
      </section>
    );
  }

  const risenProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, 6);

  return (
    <section className="container mx-auto px-4 py-6 sm:py-8">
      <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-gray-900 sm:mb-4 sm:text-2xl">
        <span className="text-base text-green-600 sm:text-lg">▲</span>
        আজ দাম বেড়েছে
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {risenProducts.map((product) => (
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
              <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-green-50 px-2.5 py-1 text-sm font-medium text-green-700 font-notosans sm:px-3 sm:text-[15px]">
                <span className="text-[10px]">▲</span>
                {toBanglaPercent(Math.abs(product.change.pct))}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PriceUp;