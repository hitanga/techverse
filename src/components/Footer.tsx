import { Twitter, Github, Linkedin, Mail, Rss } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(false);
    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        createdAt: serverTimestamp()
      });
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-950 pt-24 pb-12 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 block">
              Tech<span className="text-primary">Verse</span>
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
              Building the future, one byte at a time. Join our community of 50k+ developers.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-sm">Content</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors">Github</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors">Twitter</a></li>
              <li><a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-sm">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-sm">Newsletter</h4>
            {subscribed ? (
              <p className="text-emerald-600 text-sm font-bold">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
                />
                <button 
                  disabled={isSubmitting}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isSubmitting ? '...' : 'Subscribe'}
                </button>
                {error && <p className="text-rose-500 text-[10px] font-bold">Subscription failed. Try again.</p>}
              </form>
            )}
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs">© 2024 TechVerse. Curating the future of code.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Rss size={18} /></a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors"><Mail size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

