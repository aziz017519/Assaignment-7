"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import { IoArrowUndo } from "react-icons/io5";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "./UserMenu";

const MobileMenu = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSignOut = async () => {
    close();
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সাইন আউট হয়েছে।");
          router.push("/");
          router.refresh();
        },
        onError: () => {
          toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
        },
      },
    });
  };

  const user = session?.user;

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="মেনু খুলুন"
        aria-expanded={open}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:border-green-600 hover:text-green-700"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="মেনু"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col bg-[#FAFCFA] shadow-xl transition-all duration-300 ${
          open ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <span className="text-lg font-bold text-gray-900">বাজার দর</span>
          <button
            type="button"
            onClick={close}
            aria-label="মেনু বন্ধ করুন"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          {isPending ? (
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-36 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3">
              <UserAvatar name={user.name} image={user.image} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">{user.name}</p>
                <p className="truncate text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              দাম বিস্তারিত দেখতে অ্যাকাউন্টে সাইন ইন করুন।
            </p>
          )}

          <nav className="mt-5 flex flex-col gap-1">
            <Link
              href="/"
              onClick={close}
              className="rounded-lg px-3 py-2.5 font-medium text-gray-800 transition hover:bg-green-50 hover:text-green-700"
            >
              হোম
            </Link>
            <Link
              href="/#all-products"
              onClick={close}
              className="rounded-lg px-3 py-2.5 font-medium text-gray-800 transition hover:bg-green-50 hover:text-green-700"
            >
              সব পণ্য
            </Link>
            {user && (
              <Link
                href="/profile"
                onClick={close}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-gray-800 transition hover:bg-green-50 hover:text-green-700"
              >
                <FaUser className="text-[#5b2d8e]" />
                আমার প্রোফাইল
              </Link>
            )}
          </nav>
        </div>

        <div className="border-t border-gray-200 px-4 py-4">
          {isPending ? null : user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 font-semibold text-red-600 transition hover:bg-red-50"
            >
              <IoArrowUndo />
              সাইন আউট
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="/signin"
                onClick={close}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-center font-semibold text-gray-800 transition hover:border-green-600 hover:text-green-700"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                onClick={close}
                className="rounded-xl bg-[#05893E] px-4 py-2.5 text-center font-semibold text-white shadow-sm transition hover:bg-green-800"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default MobileMenu;