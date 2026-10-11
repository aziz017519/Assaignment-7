const PageLoader = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-[#f0f7f1] via-white to-[#dcfce7] px-4 py-8"
    >
      <div className="flex w-full max-w-sm flex-col items-center rounded-3xl border border-green-100 bg-white/80 p-8 text-center shadow-xl backdrop-blur sm:p-10">
        <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
          <span className="absolute inset-0 animate-ping rounded-full bg-green-200/60 [animation-duration:2s]" />
          <span className="absolute inset-0 rounded-full border-4 border-green-100" />
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-r-green-300 border-t-green-600 [animation-duration:1s]" />
          <span className="relative flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 text-3xl shadow-inner sm:h-20 sm:w-20 sm:text-4xl">
            🧺
          </span>
        </div>

        <h2 className="mt-6 text-lg font-bold text-gray-900 sm:text-xl">
          লোড হচ্ছে...
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          একটু অপেক্ষা করুন, পেজটি প্রস্তুত হচ্ছে
        </p>

        <div className="mt-5 flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-600 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-500 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-400" />
        </div>

        <span className="sr-only">পেজ লোড হচ্ছে</span>
      </div>
    </div>
  );
};

export default PageLoader;