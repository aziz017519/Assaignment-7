"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IoArrowUndo, IoCreateOutline } from "react-icons/io5";
import { authClient } from "@/lib/auth-client";

const fieldLabel = "mb-1 block text-sm font-medium text-gray-900 sm:text-base";
const fieldBox =
  "w-full cursor-default rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none sm:text-base";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  const handleSignOut = async () => {
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

  if (isPending || !session?.user) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-[920px] space-y-4 sm:space-y-6">
          <div className="h-24 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  const { user } = session;
  const letter = (user.name?.trim()?.[0] || "U").toUpperCase();
  const joinedParts = user.createdAt
    ? new Intl.DateTimeFormat("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).formatToParts(new Date(user.createdAt))
    : null;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-[920px]">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          আমার প্রোফাইল
        </h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>

        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-[#FBFCFA] p-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || "User"}
                referrerPolicy="no-referrer"
                className="h-20 w-20 shrink-0 rounded-2xl bg-gray-100 object-cover"
              />
            ) : (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#05893E] text-3xl font-semibold text-white">
                {letter}
              </span>
            )}

            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-gray-900 sm:text-xl">
                {user.name}
              </p>
              <p className="truncate text-sm text-gray-600 sm:text-base">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/profile/updateProfile"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#05893E] px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-green-800 sm:w-auto"
            >
              <IoCreateOutline />
              তথ্য হালনাগাদ করুন
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-500 bg-[#FBFCFA] px-5 py-2.5 font-medium text-red-600 transition hover:bg-red-50 sm:w-auto"
            >
              <IoArrowUndo />
              সাইন আউট
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-200 bg-[#FBFCFA] p-4 sm:mt-6 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">তথ্য</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="info-name" className={fieldLabel}>
                নাম
              </label>
              <input
                id="info-name"
                type="text"
                value={user.name ?? ""}
                readOnly
                className={fieldBox}
              />
            </div>

            <div>
              <label htmlFor="info-email" className={fieldLabel}>
                ইমেইল
              </label>
              <input
                id="info-email"
                type="text"
                value={user.email ?? ""}
                readOnly
                className={fieldBox}
              />
            </div>

            <div>
              <label htmlFor="info-joined" className={fieldLabel}>
                অ্যাকাউন্ট তৈরির তারিখ
              </label>
              <div id="info-joined" className={fieldBox}>
                {joinedParts
                  ? joinedParts.map((part, i) =>
                      part.type === "day" || part.type === "year" ? (
                        <span key={i} className="font-notosans">
                          {part.value}
                        </span>
                      ) : (
                        <span key={i}>{part.value}</span>
                      )
                    )
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;