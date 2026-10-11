import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import AllProducts, { type Product } from "@/app/components/products/AllProductsCard";
import PageLoader from "@/app/components/PageLoader";

type CategoryProduct = Product & {
  categoryNameBn: string;
  categoryIcon: string;
};

const getProducts = async (slug: string): Promise<CategoryProduct[]> => {
  "use cache";
  cacheLife("hours");

  const res = await fetch(
    `https://api.abcz.workers.dev/api/bazardor/products?category=${encodeURIComponent(slug)}`,
    { signal: AbortSignal.timeout(8000) }
  );
  if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);
  return res.json();
};

const CategoryContent = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  let products: CategoryProduct[];

  try {
    products = await getProducts(slug);
  } catch (error) {
    console.error("Category:", error);
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
            সার্ভার থেকে বাজারদর আনতে সমস্যা হচ্ছে। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।
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

  if (products.length === 0) notFound();

  const { categoryNameBn, categoryIcon } = products[0];
  const count = products.length.toLocaleString("bn-BD");

  return (
    <>
      <section className="container mx-auto px-4 pt-5 sm:pt-6">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#FAFCFA] p-4 sm:gap-4 sm:p-6">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center text-4xl sm:h-auto sm:w-auto sm:text-5xl">
            {categoryIcon}
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              {categoryNameBn}
            </h1>
            <p className="mt-0.5 text-sm text-gray-600 sm:text-base">
              {count}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>
      </section>

      <AllProducts products={products} showTitle={false} />
    </>
  );
};

const CategoryPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <CategoryContent params={params} />
    </Suspense>
  );
};

export default CategoryPage;