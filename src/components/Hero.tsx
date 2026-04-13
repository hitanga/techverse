import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Hero() {
// ... (rest of the code)

  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 hero-gradient">
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
              Learn, Build, and Grow in Tech Every Day. High-end editorial guides for the modern developer.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/blog">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-primary/25"
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
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none rotate-2 hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://ik.imagekit.io/pyq3owdqo/globe-removebg-preview.png" 
                alt="Tech Setup" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
