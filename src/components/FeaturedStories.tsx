import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { stripHtml } from '../lib/utils';

export default function FeaturedStories() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;
  if (posts.length === 0) return null;

  const mainPost = posts[0];
  const sidePosts = posts.slice(1);

  return (
    <section className="py-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">Featured Stories</h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Featured Card */}
          {mainPost && (
            <motion.div 
              whileHover={{ y: -5 }}
              className="lg:col-span-2 relative h-[600px] rounded-3xl overflow-hidden group cursor-pointer"
            >
              <Link to={`/blog/${mainPost.id}`}>
                <img 
                  src={mainPost.image} 
                  alt={mainPost.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-10 lg:p-16">
                  <span className="inline-block px-3 py-1 rounded bg-primary text-[10px] font-bold uppercase tracking-wider text-white mb-6">
                    {mainPost.category}
                  </span>
                  <h3 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight max-w-2xl">
                    {mainPost.title}
                  </h3>
                  <p className="text-slate-300 text-lg mb-8 max-w-xl line-clamp-2">
                    {mainPost.description || stripHtml(mainPost.content).substring(0, 150) + '...'}
                  </p>
                  <button className="flex items-center gap-2 text-white font-bold group/btn">
                    Read Story
                    <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Side Cards */}
          <div className="flex flex-col gap-8">
            {sidePosts.map((post, idx) => (
              <motion.div 
                key={post.id}
                whileHover={{ y: -5 }}
                className="relative flex-1 rounded-3xl overflow-hidden group cursor-pointer"
              >
                <Link to={`/blog/${post.id}`}>
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white mb-3 ${
                      idx === 0 ? 'bg-indigo-600' : 'bg-orange-600'
                    }`}>
                      {post.category}
                    </span>
                    <h4 className="text-xl font-bold text-white leading-tight line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
