import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import TodayDate from "./TodayDate";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import MobileAuth from "./MobileAuth";

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-[#FAFCFA]">
      <div className="container mx-auto flex items-center justify-between gap-2 px-4 py-2.5 sm:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <MobileMenu />

          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Image
              src="/icon-512.png"
              alt="logo"
              width={40}
              height={40}
              priority
              className="h-9 w-9 shrink-0 sm:h-10 sm:w-10"
            />
            <div className="min-w-0 leading-tight">
              <span className="block truncate text-base font-bold sm:text-lg">
                বাজার দর
              </span>
              <div className="truncate whitespace-nowrap text-[10px] text-gray-500 min-[400px]:text-[11px] sm:text-xs">
                <Suspense
                  fallback={
                    <span className="block h-4 w-24 animate-pulse rounded bg-gray-200 sm:w-32" />
                  }
                >
                  <TodayDate />
                </Suspense>
              </div>
            </div>
          </Link>
        </div>

        <MobileAuth />

        <div className="hidden shrink-0 md:block">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;