import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { stripHtml } from '../lib/utils';

const filters = ['All Posts', 'React & Frontend', 'Architecture', 'DevOps', 'AI'];

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('category') || 'All Posts';
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update active filter if URL param changes
    const categoryParam = searchParams.get('category');
    if (categoryParam && filters.includes(categoryParam)) {
      setActiveFilter(categoryParam);
    } else if (!categoryParam) {
      setActiveFilter('All Posts');
    }
  }, [searchParams]);

  useEffect(() => {
    let q = query(
      collection(db, 'posts'), 
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );

    if (activeFilter !== 'All Posts') {
      q = query(
        collection(db, 'posts'),
        where('status', '==', 'published'),
        where('category', '==', activeFilter),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }));
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'All Posts') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', filter);
    }
    setSearchParams(searchParams);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6"
        >
          The <span className="text-primary">Editorial</span> Feed.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-12"
        >
          Deep dives into modern engineering, architecture, and the culture of building great software.
        </motion.p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter, idx) => (
            <motion.button
              key={filter}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleFilterChange(filter)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeFilter === filter 
                ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </div>
      </header>

      {/* Blog Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No posts found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 gap-16 mb-20">
              {/* Main Featured Post */}
              {posts[0] && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="lg:col-span-2 group cursor-pointer"
                >
                  <Link to={`/blog/${posts[0].id}`}>
                    <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-8">
                      <img 
                        src={posts[0].image} 
                        alt={posts[0].title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {posts[0].category}
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6 group-hover:text-primary transition-colors">
                      {posts[0].title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed max-w-3xl line-clamp-2">
                      {posts[0].description || stripHtml(posts[0].content).substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center gap-4">
                      <img src={posts[0].authorAvatar} alt={posts[0].authorName} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{posts[0].authorName}</p>
                        <p className="text-xs text-slate-400">{posts[0].date} • {posts[0].readTime}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Side Post */}
              {posts[1] && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/blog/${posts[1].id}`}>
                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6">
                      <img 
                        src={posts[1].image} 
                        alt={posts[1].title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        {posts[1].category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                      {posts[1].title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {posts[1].description || stripHtml(posts[1].content).substring(0, 100) + '...'}
                    </p>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Grid for more posts */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.slice(2).map((post, idx) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/blog/${post.id}`}>
                    <div className="relative aspect-[3/2] rounded-2xl overflow-hidden mb-6">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                      {post.description || stripHtml(post.content).substring(0, 80) + '...'}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {posts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 dark:hover:text-white transition-colors">
              <ChevronLeft size={20} />
              Previous
            </button>
            <div className="flex gap-2">
              {[1, 2, 3].map(page => (
                <button 
                  key={page}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    page === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-primary transition-colors">
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
