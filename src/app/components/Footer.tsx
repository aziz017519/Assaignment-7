const Footer = () => {
  return (
 <>
    <footer className="mt-10 border-t border-gray-200 bg-[#FAFCFA] sm:mt-14">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4 py-6 text-center sm:py-8 md:flex-row md:justify-between md:gap-6 md:text-left">
        <p className="flex items-center gap-2 text-sm font-medium text-gray-800 sm:text-base">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50 text-sm"
          >
            🧺
          </span>
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="max-w-md text-balance text-xs leading-relaxed text-gray-500 sm:text-sm md:max-w-sm md:text-right lg:max-w-none">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
 </>
  );
};

export default Footer