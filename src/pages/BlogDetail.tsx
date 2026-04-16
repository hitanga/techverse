import { Twitter, Linkedin, Link as LinkIcon, Share2, ArrowRight, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
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
          const snapshot = await getDocs(q);
          const fetched = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(d => d.id !== id)
            .slice(0, 3);
          setRelatedPosts(fetched);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        if (error instanceof Error && (error.message.includes('Quota') || error.message.includes('quota'))) {
          window.dispatchEvent(new CustomEvent('firestore-quota-exceeded'));
        }
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
    <div className="bg-[#f8f9fa] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-5 pt-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-bold text-sm group hover:text-primary/80 transition-all">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to blog
        </Link>
        
        {/* Article Header */}
        <header className="pt-12 pb-12 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-10"
          >
            <span className="inline-block px-3 py-1 rounded-lg bg-[#d4edda] text-[#155724] text-xs font-semibold">
              {post.category}
            </span>
            <p className="text-slate-400 text-sm font-medium">
              {post.date}
            </p>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-12 leading-tight tracking-tight"
          >
            {post.title}
          </motion.h1>
        </header>

        {/* Hero Image */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2.5rem] overflow-hidden shadow-sm shadow-black/5"
          >
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Content Section */}
        <div className="pb-40">
          {/* Main Article Content */}
          <article className="blog-content max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Share Buttons */}
          <div className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">Share this post</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleShare('twitter')}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-primary transition-all shadow-sm hover:shadow-md active:scale-95"
                  >
                    <Twitter size={20} />
                  </button>
                  <button 
                    onClick={() => handleShare('linkedin')}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-primary transition-all shadow-sm hover:shadow-md active:scale-95"
                  >
                    <Linkedin size={20} />
                  </button>
                  <button 
                    onClick={() => handleShare()}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-primary transition-all shadow-sm hover:shadow-md active:scale-95 relative"
                  >
                    {showCopied ? <CheckCircle size={20} className="text-emerald-500" /> : <LinkIcon size={20} />}
                    <AnimatePresence>
                      {showCopied && (
                        <motion.span 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg whitespace-nowrap"
                        >
                          Copied!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {post.category && (
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm font-medium italic">Category:</span>
                  <Link 
                    to={`/blog?category=${encodeURIComponent(post.category)}`}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-primary/20"
                  >
                    {post.category}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
