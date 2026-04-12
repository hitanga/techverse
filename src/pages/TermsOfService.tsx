import { motion } from 'motion/react';
import { Scale, Gavel, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 md:p-16 shadow-sm border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Scale size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Terms of Service</h1>
          </div>

          <p className="text-slate-500 dark:text-slate-400 mb-12 leading-relaxed">
            Last updated: April 11, 2026. By using TechVerse, you agree to the following terms and conditions. Please read them carefully.
          </p>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Gavel size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                By accessing or using TechVerse, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Use License</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Permission is granted to temporarily download one copy of the materials (information or software) on TechVerse's website for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Disclaimer</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                The materials on TechVerse's website are provided on an 'as is' basis. TechVerse makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Scale size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Limitations</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                In no event shall TechVerse or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TechVerse's website.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              TechVerse reserves the right to revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
