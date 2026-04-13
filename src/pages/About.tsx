import { motion } from 'motion/react';
import { ArrowRight, Code2, Cpu, Globe, Layout, Sparkles, Sliders, Palette, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="pt-24 pb-20 lg:pt-32 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 text-primary text-[10px] font-bold uppercase tracking-wider mb-8">
              The Architect
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 leading-[1.1]">
              Coding the <span className="text-primary">Future</span> through the lens of a <span className="text-primary">Curator</span>.
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-xl">
              I'm Gopal, Senior Frontend Developer with 15+ years of experience specializing in React.js, Next.js, and 
modern UI engineering. Proven track record of delivering high-performance, scalable, and 
SEO-friendly web applications, particularly in e-commerce domains. 
            </p>
            <div className="flex items-center gap-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-primary/25"
              >
                View Portfolio
              </motion.button>
              <Link to="/blog" className="text-primary font-bold hover:underline">
                Read Articles
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl dark:shadow-none">
              <img 
                src="https://ik.imagekit.io/pyq3owdqo/gemini-2.5-flash-image-preview%20(nano-banana)_can_you_please_chang%20(2).png" 
                alt="Gopal Frontend Developer" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-[240px]"
            >
              <p className="text-primary font-bold text-xl mb-1">15+ Years</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Building digital ecosystems for global brands.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Technical Prowess Section */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Technical Prowess</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
              I craft fast, scalable, and visually engaging web experiences using React.js and Next.js. With 15+ years in frontend engineering, I specialize in building component-driven architectures that are clean, efficient, and built for performance. From optimizing Core Web Vitals to delivering SEO-friendly, responsive UIs, I focus on creating products that not only look great but perform flawlessly. I bring strong expertise in modern JavaScript, API integrations, and performance tuning to turn ideas into high-impact digital experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 - Large */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-primary flex items-center justify-center mb-8">
                <Sliders size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">React & Ecosystem</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                Expertise in Next.js, Redux, and Framer Motion for building fluid, state-driven interfaces.
              </p>
              <div className="flex gap-3">
                <span className="px-3 py-1 rounded bg-indigo-50 dark:bg-indigo-950/30 text-primary text-[10px] font-bold uppercase tracking-wider">Next.js</span>
                <span className="px-3 py-1 rounded bg-indigo-50 dark:bg-indigo-950/30 text-primary text-[10px] font-bold uppercase tracking-wider">Typescript</span>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className="text-primary font-bold text-xl mb-8">JS</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Modern JS</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                ES6+, Asynchronous patterns, and functional programming paradigms.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-primary flex items-center justify-center mb-8">
                <Palette size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">UI/UX Craft</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Tailwind CSS, SCSS, and design system engineering from scratch.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Systems & APIs</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Designing robust GraphQL and REST architectures that serve millions of requests with zero friction.
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-primary shrink-0 ml-6">
                <Database size={28} />
              </div>
            </motion.div>

            {/* Card 5 - Quote */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-indigo-50/30 dark:bg-indigo-950/20 p-10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 flex flex-col justify-center text-center"
            >
              <p className="text-lg font-medium text-slate-800 dark:text-slate-200 italic mb-4">
                "Code is poetry for machines, but it must be readable by humans."
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Semantic HTML5 & A11y Standards
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Our Mission</h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                TechVerse was founded on the belief that the technical barrier to entry shouldn't be a wall of jargon, but a bridge of clarity.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  title: 'Clarity over Complexity',
                  desc: 'We strip away the noise to find the core logic. Every tutorial, article, and line of code we share is vetted for absolute comprehension.',
                  border: 'border-l-primary'
                },
                {
                  title: 'Editorial Integrity',
                  desc: 'We treat technical content as high-end editorial art. Quality isn\'t just in the syntax, but in the delivery and presentation.',
                  border: 'border-l-indigo-600'
                },
                {
                  title: 'Community Growth',
                  desc: 'Empowering the next generation of curators. We don\'t just teach \'how\' to code, we teach \'why\' it matters.',
                  border: 'border-l-rose-500'
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 border-l-4 ${item.border}`}
                >
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[3rem] p-16 lg:p-24 text-center relative overflow-hidden"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white rounded-full"></div>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 relative z-10">
              Let's build something meaningful.
            </h2>
            <p className="text-indigo-100 text-lg mb-12 max-w-2xl mx-auto relative z-10">
              Interested in collaboration or have a technical challenge? Let's talk code.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg relative z-10 shadow-2xl"
            >
              Get in Touch
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
