import { motion } from 'motion/react';
import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        createdAt: serverTimestamp()
      });
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto bg-primary rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-6">
            {subscribed ? 'Welcome to the Community!' : 'Stay Ahead of the Curve'}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-12 max-w-2xl mx-auto">
            {subscribed 
              ? "Thank you for subscribing! You'll receive our next update in your inbox soon."
              : "Join 50,000+ developers receiving the best technical insights, tutorials, and industry news every Monday morning."}
          </p>
          
          {!subscribed && (
            <>
              <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-4" onSubmit={handleSubmit}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-8 py-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all"
                  required
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                  className="bg-white text-primary px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </motion.button>
              </form>
              {error && <p className="text-rose-200 text-sm mb-8 font-medium">{error}</p>}
            </>
          )}
          
          <p className="text-primary-foreground/60 text-sm">
            No spam. Just code. Unsubscribe at any time.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
