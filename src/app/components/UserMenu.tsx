"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCaretDown, FaUser } from "react-icons/fa";
import { IoArrowUndo } from "react-icons/io5";
import { authClient } from "@/lib/auth-client";

type AvatarProps = {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "lg";
};

export const UserAvatar = ({ name, image, size = "sm" }: AvatarProps) => {
  const dimension = size === "lg" ? "h-16 w-16 text-2xl" : "h-9 w-9 text-sm";
  const letter = (name?.trim()?.[0] || "U").toUpperCase();

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name || "User"}
        referrerPolicy="no-referrer"
        className={`${dimension} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${dimension} flex shrink-0 items-center justify-center rounded-full bg-[#05893E] font-semibold text-white`}
    >
      {letter}
    </span>
  );
};

const UserMenu = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
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

  if (isPending) {
    return <div className="h-9 w-28 animate-pulse rounded-full bg-gray-200" />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-1.5 lg:gap-2">
        <Link
          href="/signin"
          className="whitespace-nowrap rounded-lg px-3 py-2 text-base font-medium text-black transition hover:bg-gray-200 lg:px-4"
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className="whitespace-nowrap rounded-lg bg-[#05893E] px-3 py-2 text-base font-medium text-white transition hover:bg-green-800 lg:px-4"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-gray-100"
      >
        <UserAvatar name={user.name} image={user.image} />
        <span className="max-w-[100px] truncate text-sm font-medium text-gray-900 lg:max-w-[140px]">
          {user.name}
        </span>
        <FaCaretDown
          className={`shrink-0 text-xs text-gray-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl"
        >
          <p className="truncate text-sm font-semibold text-gray-500">
            {user.name}
          </p>
          <p className="truncate text-xs text-gray-400">{user.email}</p>

          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mt-4 flex items-center gap-2 text-base text-gray-900 hover:text-green-700"
          >
            <FaUser className="shrink-0 text-[#5b2d8e]" />
            আমার প্রোফাইল
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            className="mt-3 flex cursor-pointer items-center gap-2 text-base text-red-600 hover:text-red-700"
          >
            <IoArrowUndo className="shrink-0" />
            সাইন আউট
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;