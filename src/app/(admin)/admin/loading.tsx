export default function AdminLoading() {
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-[70vh] items-center justify-center p-6 text-center animate-in fade-in duration-200">
      {/* Top glowing progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[99999] pointer-events-none overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 animate-pulse shadow-[0_0_12px_rgba(249,115,22,0.9)]" />
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xl max-w-sm w-full flex flex-col items-center gap-4">
        {/* Animated Double Ring Spinner */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 dark:border-orange-400/20 animate-ping opacity-30" />
          <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-white/10 border-t-orange-600 dark:border-t-orange-400 border-r-orange-500 animate-spin" />
          <div className="absolute w-3 h-3 rounded-full bg-orange-600 dark:bg-orange-500 shadow-sm shadow-orange-600/50" />
        </div>

        <div className="space-y-1">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Memuat Halaman Back Office...</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Menghubungkan data dan mengoptimalkan aset tampilan
          </p>
        </div>

        {/* Shimmer skeleton bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-indeterminate" />
        </div>
      </div>
    </div>
  );
}
