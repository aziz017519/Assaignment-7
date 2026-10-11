import { cacheLife } from "next/cache";
import AllProducts, { type Product } from "./AllProductsCard";

async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");

  const res = await fetch("https://api.abcz.workers.dev/api/bazardor/products", {
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);

  return res.json();
}

const AllProductsDataFetch = async () => {
  let products: Product[];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("AllProducts:", error);
    return (
      <section
        id="all-products"
        className="container mx-auto scroll-mt-6 px-4 py-6 sm:py-8"
      >
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

  return <AllProducts products={products} />;
};

export default AllProductsDataFetch;