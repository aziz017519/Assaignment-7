"use client";

import Link from "next/link";

const NotFound = () => {
    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-[#f0f7f1] via-white to-[#dcfce7] px-4 py-8">
            <div className="w-full max-w-lg rounded-3xl border border-green-100 bg-white p-6 text-center shadow-xl sm:p-10">
                <h1 className="bg-gradient-to-b from-[#22c55e] to-[#166534] bg-clip-text text-7xl font-black tracking-widest text-transparent sm:text-9xl">
                    ৪০৪
                </h1>

                <div className="mx-auto my-5 h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-green-600 to-transparent sm:my-6 sm:w-20" />

                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">পেজটি খুঁজে পাওয়া যায়নি</h2>
                <p className="mt-3 text-sm text-gray-500">
                    আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরিয়ে ফেলা হয়েছে অথবা লিংকটি ভুল।
                </p>

                <div className="mt-6 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row">
                    <button
                        onClick={() => window.history.back()}
                        className="cursor-pointer rounded-full border border-green-600 px-6 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                    >
                        পেছনে যান
                    </button>
                    <Link
                        href="/"
                        className="rounded-full bg-green-600 px-6 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-green-700"
                    >
                        হোম পেজে ফিরে যান
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;