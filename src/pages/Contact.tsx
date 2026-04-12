import { motion } from 'motion/react';
import { Send, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <section className="pt-24 pb-20 lg:pt-32 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 text-primary text-[10px] font-bold uppercase tracking-wider mb-8"
          >
            Get in Touch
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 leading-[1.1]"
          >
            Let's curate the <span className="text-primary">future of code</span> together.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            Whether you have a technical inquiry, a partnership proposal, or just want to discuss the latest in high-end editorial design, our digital gallery is open.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7 bg-slate-50/50 dark:bg-slate-900/50 rounded-[2.5rem] p-10 lg:p-16"
          >
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="Alex Rivera" 
                    className="w-full px-6 py-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/50 border-none text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="alex@techverse.io" 
                    className="w-full px-6 py-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/50 border-none text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Message</label>
                <textarea 
                  rows={6}
                  placeholder="Tell us about your project or idea..." 
                  className="w-full px-6 py-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/50 border-none text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/25"
              >
                Send Message
                <Send size={18} />
              </motion.button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-12">
            {/* HQ Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative aspect-[16/9] rounded-[2rem] overflow-hidden group"
            >
              <img 
                src="https://picsum.photos/seed/abstract-waves/800/450" 
                alt="TechVerse HQ" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-1">TechVerse HQ</h3>
                <p className="text-slate-200 text-sm">Remote-first. Globally focused.</p>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300"
            >
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8">Connect with the Curator</h4>
              <div className="space-y-4">
                {[
                  { name: 'Github', icon: <Github size={20} />, color: 'bg-indigo-50 dark:bg-indigo-950/30 text-primary' },
                  { name: 'Twitter', icon: <Twitter size={20} />, color: 'bg-indigo-50 dark:bg-indigo-950/30 text-primary' },
                  { name: 'LinkedIn', icon: <Linkedin size={20} />, color: 'bg-indigo-50 dark:bg-indigo-950/30 text-primary' },
                ].map((social) => (
                  <button 
                    key={social.name}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${social.color} flex items-center justify-center`}>
                        {social.icon}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{social.name}</span>
                    </div>
                    <ArrowRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">Direct Support</h4>
                <a href="mailto:hello@techverse.io" className="text-lg font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">
                  hello@techverse.io
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
