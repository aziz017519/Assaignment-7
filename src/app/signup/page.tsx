"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 sm:text-sm";

const labelClass = "mb-1 block text-sm font-medium text-gray-900";

const socialBtn =
  "btn h-10 min-h-10 w-full flex-nowrap gap-1.5 whitespace-nowrap border-[#e5e5e5] bg-white px-2 text-xs font-medium text-black";

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const showError = (message: string) => {
    setFormError(message);
    toast.error(message);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    const formData = new FormData(e.currentTarget);
    const { name, email, password, confirmPassword } = Object.fromEntries(
      formData.entries()
    ) as {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    };

    if (password.length < 8) {
      showError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }
    if (password !== confirmPassword) {
      showError("পাসওয়ার্ড দুটি মিলছে না।");
      return;
    }

    setLoading(true);
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: "/signin",
    });
    setLoading(false);

    if (data) {
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
      router.push("/signin");
    }
    if (error) {
      console.log("SIGNUP ERROR:", error);
      showError(
        error.code?.startsWith("USER_ALREADY_EXISTS")
          ? "এই ইমেইল দিয়ে আগে থেকেই একটি অ্যাকাউন্ট আছে। সাইন ইন করে নিন।"
          : "সাইন আপ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"
      );
    }
  };

  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleGithubSignUp = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 sm:text-base">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="mx-auto mt-6 w-full max-w-[416px] rounded-2xl border border-gray-200 bg-base-100 p-4 sm:mt-8 sm:p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          {formError && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-xl bg-[#d13438] px-4 py-3 text-white shadow-lg sm:px-5 sm:py-4"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                className="shrink-0"
                fill="#fbbf24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2 1 21h22L12 2Zm1 15h-2v-2h2v2Zm0-4h-2V9h2v4Z" />
              </svg>
              <span className="text-sm leading-relaxed">{formError}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className={labelClass}>
              নাম
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="যেমন: রহিম উদ্দিন"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              ইমেইল
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClass}>
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="আবার লিখুন"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-[#05893E] py-2.5 text-base font-semibold text-white shadow-md transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-sm text-gray-600 sm:my-5 sm:gap-4">
          <span className="h-px flex-1 bg-gray-300" />
          অথবা
          <span className="h-px flex-1 bg-gray-300" />
        </div>

        <div className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2">
          <button type="button" className={socialBtn} onClick={handleGoogleSignUp}>
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              className="shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Google দিয়ে চালিয়ে যান
          </button>

          <button type="button" className={socialBtn} onClick={handleGithubSignUp}>
            <svg
              aria-label="GitHub logo"
              width="16"
              height="16"
              className="shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="black"
                d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
              ></path>
            </svg>
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-700 sm:mt-5 sm:text-base">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-medium text-green-700 underline underline-offset-2 hover:text-green-800"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-sm sm:mt-8 sm:text-base">
        <Link
          href="/"
          className="text-gray-600 underline underline-offset-2 hover:text-green-700"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;