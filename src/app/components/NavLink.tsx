"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const NavLinks = ({ categories }: { categories: Category[] }) => {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [pathname]);

  return (
    <>
      {categories.map((c) => {
        const href = `/category/${c.slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={c.id}
            ref={isActive ? activeRef : undefined}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-semibold shadow-sm transition sm:gap-2 sm:px-3 ${
              isActive
                ? "bg-green-700 text-white shadow-md"
                : "text-gray-800 shadow-none hover:bg-gray-100 hover:text-green-700"
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.nameBn}</span>
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;