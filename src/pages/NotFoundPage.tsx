// NotFoundPage - 404 page

import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 dark:bg-gray-950">
      <div className="text-center animate-fade-in">
        {/* 404 illustration */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <span className="text-5xl font-black text-gray-300 dark:text-gray-600">
            ?
          </span>
        </div>

        <h1 className="text-7xl font-black text-gray-200 dark:text-gray-800">
          404
        </h1>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mt-3 max-w-md text-gray-500 dark:text-gray-400">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Silakan
          kembali ke halaman utama.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl active:scale-[0.98]"
            id="not-found-home-btn"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Kembali ke Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            id="not-found-back-btn"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Halaman Sebelumnya
          </button>
        </div>
      </div>
    </div>
  );
}
