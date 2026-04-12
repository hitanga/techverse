import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
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
              <Shield size={24} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
          </div>

          <p className="text-slate-500 dark:text-slate-400 mb-12 leading-relaxed">
            Last updated: April 11, 2026. Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Information We Collect</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, and any other information you choose to provide.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">How We Use Your Information</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect TechVerse and our users. We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Security</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cookies</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We use cookies and similar technologies to provide and support our services and each of the uses outlined in this policy. You can control cookies through your browser settings.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-400 dark:text-slate-500">
              If you have any questions about this Privacy Policy, please contact us at privacy@techverse.com.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
