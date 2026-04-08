import { motion } from "framer-motion";

import { MonthTheme } from "@/theme";

export default function HeroImage({
  title,
  theme,
}: {
  title: string;
  theme: MonthTheme;
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-[0_20px_80px_rgba(0,0,0,0.45)] h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-full min-h-[160px] md:min-h-[250px] lg:min-h-[300px] w-full overflow-hidden">
        {/* Actual Image background */}
        <img
          src={`https://picsum.photos/seed/${encodeURIComponent(title)}/1600/600`}
          alt={`${title} background`}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-500"
        />
        
        {/* Gradient dark overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-black/10" />

        <div className="absolute left-6 top-6">
          <div className={`inline-flex rounded-full border border-white/10 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} px-4 py-1.5 text-sm font-semibold text-white shadow-sm backdrop-blur-md`}>
            {title}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="mb-2 text-2xl font-bold tracking-tight text-white drop-shadow-sm">
            {title.split(' ')[0]}
          </div>
          <p className="text-sm font-medium text-white/80 line-clamp-2">
            Organize your schedule, drag across the grid to select dates, and stay productive.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
