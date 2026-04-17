import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Hero() {
  // ... (rest of the code)

  return (
    <section className="relative overflow-hidden pt-10 pb-24 lg:pt-10 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
              Curated Daily
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6">
              Daily Tech <br />
              <span className="text-primary">Insights</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mb-10 leading-relaxed">
              Learn, Build, and Grow in Tech Every Day. High-end editorial
              guides for the modern developer.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/blog">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2"
                >
                  Start Reading
                  <ArrowRight size={20} />
                </motion.button>
              </Link>

              <Link to="/roadmap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  View Roadmap
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden  rotate-2 hover:rotate-0 transition-transform duration-700">
              <video
                src="https://ik.imagekit.io/pyq3owdqo/animate%20(1).mp4"
                className="w-full h-auto object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48  rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
