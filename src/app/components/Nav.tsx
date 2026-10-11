import { Suspense } from "react";
import { cacheLife } from "next/cache";
import NavLinks from "./NavLink";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");

  const res = await fetch("https://api.abcz.workers.dev/api/bazardor/categories", {
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);

  return res.json();
}

const Nav = async () => {
  let categories: Category[];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Nav:", error);
    return null;
  }

  return (
    <nav className="border-b border-gray-200 bg-[#FAFCFA]">
      <div className="container mx-auto flex items-center gap-1.5 overflow-x-auto overscroll-x-contain whitespace-nowrap px-4 py-2 [scrollbar-width:none] sm:gap-2 sm:py-2.5 [&::-webkit-scrollbar]:hidden">
        <Suspense fallback={null}>
          <NavLinks categories={categories} />
        </Suspense>
      </div>
    </nav>
  );
};

export default Nav;