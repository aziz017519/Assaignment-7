import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import TodayDate from "./TodayDate";

const HeroBanner = () => {
    return (
        <section className="container mx-auto my-6 px-4 sm:my-8 md:my-10">
            <div className="flex flex-col-reverse items-center justify-between gap-6 rounded-3xl border border-gray-200 bg-[#fbfdfb] px-5 py-8 sm:gap-8 sm:rounded-[2rem] sm:px-6 sm:py-10 md:flex-row md:px-7 md:py-12">
                <div className="w-full max-w-2xl">
                    <Suspense
                        fallback={
                            <span className="inline-block h-7 w-44 rounded-full bg-green-100 sm:h-8 sm:w-56" />
                        }
                    >
                        <TodayDate className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 sm:px-4 sm:py-1.5 sm:text-sm" />
                    </Suspense>

                    <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                        আজকের বাজারের দাম এক নজরে
                    </h1>

                    <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">
                        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
                        বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
                    </p>

                    <a
                        href="#all-products"
                        className="mt-5 block rounded-lg bg-green-700 px-5 py-2.5 text-center font-semibold text-white shadow-md transition hover:bg-green-800 sm:mt-6 sm:inline-block"
                    >
                        সব পণ্য দেখুন
                    </a>
                </div>

                <div className="flex w-full justify-center md:w-auto md:shrink-0 md:pr-4 lg:pr-16">
                    <Image
                        src="/bazar-hero.png"
                        alt="বাজারের ঝুড়ি"
                        width={380}
                        height={320}
                        priority
                        className="h-auto w-44 sm:w-56 md:w-64 lg:w-[380px]"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;