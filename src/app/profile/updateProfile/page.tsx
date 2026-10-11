"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const UpdateProfilePage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newName = (name ?? session?.user?.name ?? "").trim();

    if (!newName) {
      toast.error("নাম খালি রাখা যাবে না।");
      return;
    }
    if (newName === session?.user?.name) {
      toast("নামে কোনো পরিবর্তন নেই।");
      return;
    }

    setSaving(true);
    const { error } = await authClient.updateUser({ name: newName });
    setSaving(false);

    if (error) {
      console.log("UPDATE NAME ERROR:", error);
      toast.error("নাম পরিবর্তন করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }

    toast.success("নাম সফলভাবে পরিবর্তন হয়েছে।");
    router.push("/profile");
    router.refresh();
  };

  if (isPending || !session?.user) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-[920px] space-y-4 sm:space-y-6">
          <div className="h-24 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-56 animate-pulse rounded-2xl bg-gray-200 sm:h-64" />
        </div>
      </div>
    );
  }

  const inputValue = name ?? session.user.name ?? "";

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-[920px]">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          তথ্য হালনাগাদ করুন
        </h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          আপনার প্রোফাইলের নাম এখান থেকে পরিবর্তন করুন।
        </p>

        <div className="mt-5 rounded-2xl border border-gray-200 bg-base-100 p-4 sm:mt-8 sm:p-6">
          <form onSubmit={handleUpdate}>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-900 sm:text-base"
            >
              নাম
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={inputValue}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="আপনার নাম লিখুন"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="w-full cursor-pointer rounded-lg bg-[#05893E] px-5 py-2.5 text-base font-semibold text-white shadow-md transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {saving ? "অপেক্ষা করুন..." : "নাম হালনাগাদ করুন"}
              </button>

              <Link
                href="/profile"
                className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-base font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
              >
                বাতিল করুন
              </Link>
            </div>
          </form>
        </div>

        <p className="mt-6 text-sm sm:text-base">
          <Link
            href="/profile"
            className="text-gray-600 underline underline-offset-2 hover:text-green-700"
          >
            ← প্রোফাইলে ফিরে যান
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UpdateProfilePage;