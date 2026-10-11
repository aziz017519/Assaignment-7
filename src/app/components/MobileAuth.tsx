"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "./UserMenu";

const MobileAuth = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-200 md:hidden" />;
  }

  if (session?.user) {
    return (
      <Link href="/profile" aria-label="আমার প্রোফাইল" className="shrink-0 md:hidden">
        <UserAvatar name={session.user.name} image={session.user.image} />
      </Link>
    );
  }

  return (
    <Link
      href="/signin"
      className="shrink-0 whitespace-nowrap rounded-lg bg-[#05893E] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-green-800 md:hidden"
    >
      সাইন ইন
    </Link>
  );
};

export default MobileAuth;