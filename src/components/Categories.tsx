import { ChevronLeft, ChevronRight, Code2, Database, Globe, Layout, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const categories = [
// ... (rest of the code)

  { name: 'React', icon: <Layout size={24} />, color: 'bg-blue-50 text-blue-600' },
  { name: 'JavaScript', icon: <Code2 size={24} />, color: 'bg-orange-50 text-orange-600' },
  { name: 'APIs', icon: <Database size={24} />, color: 'bg-indigo-50 text-indigo-600' },
  { name: 'CSS', icon: <Globe size={24} />, color: 'bg-purple-50 text-purple-600' },
  { name: 'Career Tips', icon: <Briefcase size={24} />, color: 'bg-rose-50 text-rose-600' },
];

export default function Categories() {
  return (
    <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Categories</h2>
            <p className="text-slate-500 dark:text-slate-400">Find your next technical deep dive.</p>
          </div>
          <div className="flex gap-2">
            <button className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-900 dark:hover:border-white transition-all">
              <ChevronLeft size={20} />
            </button>
            <button className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-900 dark:hover:border-white transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-950 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 card-shadow cursor-pointer group"
            >
              <Link to="/blog">
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{cat.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
