import { Twitter, Linkedin, Link as LinkIcon, Share2, ArrowRight, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, collection, query, where, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { stripHtml } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post.title;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
      return;
    }

    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
      return;
    }

    if (navigator.share && !platform) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPost({
            id: docSnap.id,
            ...data,
            date: data.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          });

          // Fetch related posts
          const q = query(
            collection(db, 'posts'),
            where('category', '==', data.category),
            where('status', '==', 'published'),
            limit(4)
          );
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs
              .map(d => ({ id: d.id, ...d.data() }))
              .filter(d => d.id !== id)
              .slice(0, 3);
            setRelatedPosts(fetched);
          });
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-300">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Post not found</h1>
        <Link to="/blog" className="text-primary font-bold hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Article Header */}
      <header className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <Link to="/blog" className="flex items-center gap-2 text-primary font-bold text-sm mb-10 group w-fit">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to blogs
        </Link>

        <div className="flex gap-3 mb-8">
          <span className="px-3 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
            {post.category}
          </span>
          <span className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            {post.readTime}
          </span>
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-10 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={post.authorAvatar} 
              alt={post.authorName} 
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{post.authorName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Lead Architect @ TechVerse • {post.date}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleShare('twitter')}
              className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-primary transition-colors"
              title="Share on Twitter"
            >
              <Twitter size={18} />
            </button>
            <button 
              onClick={() => handleShare('linkedin')}
              className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-primary transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin size={18} />
            </button>
            <button 
              onClick={() => handleShare()}
              className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-primary transition-colors"
              title="Copy Link"
            >
              <LinkIcon size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[2.5rem] overflow-hidden aspect-[21/9] shadow-2xl shadow-slate-200 dark:shadow-none"
        >
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="">
          {/* Main Article Content */}
          <article className="prose prose-slate dark:prose-invert max-w-none">
            <div 
              className="markdown-body quill-content dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Post Actions */}
            <div className="flex flex-wrap items-center justify-end pt-12 border-t border-slate-100 dark:border-slate-800 gap-8 mt-16">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Share this article</span>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleShare()}
                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Continue Reading Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/50 py-24 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Continue Reading</h2>
                <p className="text-slate-500 dark:text-slate-400">Selected deep dives for curious engineers.</p>
              </div>
              <Link to="/blog" className="flex items-center gap-2 text-primary font-bold text-sm group">
                View all posts
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((p, idx) => (
                <motion.div 
                  key={p.id}
                  whileHover={{ y: -5 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/blog/${p.id}`}>
                    <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                      <img 
                        src={p.image} 
                        alt={p.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {p.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        {p.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                      {p.description || stripHtml(p.content).substring(0, 100) + '...'}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Copied Notification */}
      <AnimatePresence>
        {showCopied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
              <CheckCircle size={18} className="text-emerald-400" />
              <span className="text-sm font-bold">Link copied to clipboard!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
