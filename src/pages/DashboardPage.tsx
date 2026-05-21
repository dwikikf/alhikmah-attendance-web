// DashboardPage - Placeholder dashboard (to be fully implemented in Task 8)

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Selamat datang di Sistem Absensi SD Al Hikmah
      </p>

      {/* Placeholder stats cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Siswa",
            value: "—",
            icon: "👨‍🎓",
            color: "from-emerald-500 to-teal-600",
          },
          {
            label: "Hadir Hari Ini",
            value: "—",
            icon: "✅",
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Tidak Hadir",
            value: "—",
            icon: "❌",
            color: "from-amber-500 to-orange-600",
          },
          {
            label: "Tingkat Kehadiran",
            value: "—",
            icon: "📊",
            color: "from-purple-500 to-pink-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-lg shadow-lg`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Dashboard akan segera hadir
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Fitur dashboard lengkap sedang dalam pengembangan. Termasuk grafik
          kehadiran, aktivitas terbaru, dan quick actions.
        </p>
      </div>
    </div>
  );
}
