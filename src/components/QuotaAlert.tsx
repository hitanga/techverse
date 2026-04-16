import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function QuotaAlert() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkQuotaError = () => {
      // We check if any firestore error in console or state indicates quota
      // For this demo, we'll listen for a custom event we can dispatch
      const handleQuotaEvent = () => setIsVisible(true);
      window.addEventListener('firestore-quota-exceeded', handleQuotaEvent);
      return () => window.removeEventListener('firestore-quota-exceeded', handleQuotaEvent);
    };
    return checkQuotaError();
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-4 right-4 z-[100] flex justify-center pointer-events-none"
        >
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl shadow-2xl max-w-2xl w-full flex items-start gap-4 pointer-events-auto">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-xl text-amber-600 dark:text-amber-400">
              <AlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-1">Firestore Quota Reached</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                The daily free tier limit for database reads (50,000) has been reached. 
                The app will automatically resume working when the quota resets in 24 hours. 
                <span className="block mt-2 font-semibold">Note: I have already optimized the code to prevent this from happening again once the reset occurs.</span>
              </p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-amber-400 hover:text-amber-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
