import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { stripHtml } from '../lib/utils';

export default function LatestUpdates() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts starting from the 4th one (since top 3 are in Featured)
        const q = query(
          collection(db, 'posts'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(6) // Fetch 6 to show 3 after skipping featured
        );

        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Skip the first 3 if they exist (they are in featured)
        setPosts(fetched.length > 3 ? fetched.slice(3) : fetched);
      } catch (error) {
        console.error("Error fetching latest updates:", error);
        if (error instanceof Error && (error.message.includes('Quota') || error.message.includes('quota'))) {
          window.dispatchEvent(new CustomEvent('firestore-quota-exceeded'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Latest Updates</h2>
          <Link to="/blog" className="text-primary font-semibold text-sm hover:underline">Browse All Posts</Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post, idx) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link to={`/blog/${post.id}`}>
                <div className="rounded-2xl overflow-hidden mb-6 aspect-video relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {post.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.description || stripHtml(post.content).substring(0, 120) + '...'}
                </p>
                <button className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm group/link">
                  Read More
                  <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
