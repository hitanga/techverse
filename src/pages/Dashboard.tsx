import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Cropper from 'react-easy-crop';
import { db, auth } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, limit, onSnapshot, getDocs, getDocFromServer } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import { useTheme } from '../context/ThemeContext';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Image as ImageIcon, 
  BarChart3, 
  Settings, 
  Upload, 
  Save, 
  Send,
  MoreVertical,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Edit2,
  Trash,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const COLORS = ['#3b36db', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['code-block', 'link'],
    ['clean']
  ],
};

const quillFormats = [
  'header', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'color', 'background',
  'list', 'align',
  'code-block', 'link'
];

export default function Dashboard() {
  const { user, isAdmin, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('React & Frontend');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Cropper State
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleCropSave = async () => {
    try {
      if (imageToCrop && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        if (croppedImage) {
          setImageUrl(croppedImage);
          setImageToCrop(null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    if (showUrlInput) {
      setTempImageUrl(imageUrl);
    }
  }, [showUrlInput, imageUrl]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      // Fetch recent posts for dashboard
      const qRecent = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(5));
      const unsubscribeRecent = onSnapshot(qRecent, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentPosts(posts);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'posts');
      });

      // Fetch all posts for analytics
      const qAll = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const unsubscribeAll = onSnapshot(qAll, (snapshot) => {
        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllPosts(posts);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'posts');
      });

      // Fetch subscriber count
      const qSubscribers = query(collection(db, 'subscribers'));
      const unsubscribeSubscribers = onSnapshot(qSubscribers, (snapshot) => {
        setSubscriberCount(snapshot.size);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'subscribers');
      });

      return () => {
        unsubscribeRecent();
        unsubscribeAll();
        unsubscribeSubscribers();
      };
    }
  }, [isAdmin]);

  // Analytics Data Calculations
  const categoryData = allPosts.reduce((acc: any[], post) => {
    const existing = acc.find(item => item.name === post.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: post.category, value: 1 });
    }
    return acc;
  }, []);

  const statusData = [
    { name: 'Published', value: allPosts.filter(p => p.status === 'published').length },
    { name: 'Drafts', value: allPosts.filter(p => p.status === 'draft').length },
  ];

  const trafficData = [
    { name: 'Mon', views: 2400, visitors: 1200 },
    { name: 'Tue', views: 3200, visitors: 1800 },
    { name: 'Wed', views: 2800, visitors: 1400 },
    { name: 'Thu', views: 4500, visitors: 2200 },
    { name: 'Fri', views: 3800, visitors: 1900 },
    { name: 'Sat', views: 5200, visitors: 2800 },
    { name: 'Sun', views: 4800, visitors: 2400 },
  ];

  const handleSeedPost = async () => {
    setIsPublishing(true);
    try {
      const samplePost = {
        title: "React 19: The Future of Web Development",
        category: "React & Frontend",
        tags: ["React", "Frontend", "WebDev", "React19"],
        content: `
          <h1>React 19: The Future of Web Development</h1>
          <p>React 19 is finally here, and it brings a host of revolutionary features that change how we think about building user interfaces.</p>
          
          <h2>1. The React Compiler</h2>
          <p>The most anticipated feature is the <strong>React Compiler</strong> (formerly known as Forget). It automatically memoizes your components, reducing the need for <code>useMemo</code> and <code>useCallback</code>.</p>
          
          <h2>2. Actions</h2>
          <p>Actions simplify how you handle data mutations and state updates. With the new <code>useActionState</code> hook, managing form submissions and loading states becomes a breeze.</p>
          
          <h2>3. New Hooks</h2>
          <ul>
            <li><strong>useOptimistic</strong>: For building snappy UIs with optimistic updates.</li>
            <li><strong>useFormStatus</strong>: Access form state from nested components.</li>
          </ul>
          
          <blockquote>
            "React 19 is a massive step forward in developer experience and performance. Start exploring these features today!"
          </blockquote>
        `,
        status: 'published',
        authorId: user?.uid,
        authorName: user?.displayName || 'Admin',
        authorAvatar: user?.photoURL || 'https://i.pravatar.cc/150?u=admin',
        createdAt: serverTimestamp(),
        image: `https://picsum.photos/seed/react19/1200/800`,
        readTime: "5 min read"
      };

      await addDoc(collection(db, 'posts'), samplePost);
      showNotification("Sample React JS post created successfully!");
    } catch (error) {
      console.error('Error seeding post:', error);
      showNotification("Failed to create sample post.", 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePublish = async (status: 'draft' | 'published') => {
    if (!title || !content) {
      showNotification('Please fill in title and content', 'error');
      return;
    }
    
    setIsPublishing(true);
    try {
      const postData = {
        title,
        category,
        tags: tags.split(',').map(t => t.trim()),
        content,
        status,
        authorId: user?.uid,
        authorName: user?.displayName || 'Admin',
        authorAvatar: user?.photoURL || 'https://i.pravatar.cc/150?u=admin',
        updatedAt: serverTimestamp(),
        image: imageUrl || `https://picsum.photos/seed/${title.length}/1200/800`,
        readTime: `${Math.ceil(stripHtml(content).split(' ').length / 200)} min read`
      };

      if (editingPostId) {
        await updateDoc(doc(db, 'posts', editingPostId), postData);
        showNotification('Post updated successfully!');
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          createdAt: serverTimestamp(),
        });
        showNotification(`Post ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
      }
      
      resetForm();
      setActiveView('all-posts');
    } catch (error) {
      console.error('Error publishing post:', error);
      showNotification('Error saving post. Please try again.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setImageUrl('');
    setEditingPostId(null);
  };

  const handleEdit = (post: any) => {
    setTitle(post.title);
    setCategory(post.category);
    setTags(post.tags?.join(', ') || '');
    setContent(post.content);
    setImageUrl(post.image || '');
    setEditingPostId(post.id);
    setActiveView('new-post');
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      showNotification('Post deleted successfully!');
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      showNotification('Failed to delete post.', 'error');
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUrlInput(true);
  };

  const handleApplyImage = () => {
    if (tempImageUrl) {
      setImageUrl(tempImageUrl);
    }
    setShowUrlInput(false);
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 dark:text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col">
        <div className="p-8">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">Management</h2>
          <nav className="space-y-2">
            <SidebarLink 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              active={activeView === 'dashboard'} 
              onClick={() => setActiveView('dashboard')}
            />
            <SidebarLink 
              icon={<FileText size={18} />} 
              label="All Posts" 
              active={activeView === 'all-posts'}
              onClick={() => setActiveView('all-posts')}
            />
            <SidebarLink 
              icon={<PlusCircle size={18} />} 
              label="New Post" 
              active={activeView === 'new-post'}
              onClick={() => setActiveView('new-post')}
            />
            <SidebarLink 
              icon={<ImageIcon size={18} />} 
              label="Media Library" 
              active={activeView === 'media'}
              onClick={() => setActiveView('media')}
            />
          </nav>

          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-12 mb-8">Performance</h2>
          <nav className="space-y-2">
            <SidebarLink 
              icon={<BarChart3 size={18} />} 
              label="Analytics" 
              active={activeView === 'analytics'}
              onClick={() => setActiveView('analytics')}
            />
            <SidebarLink 
              icon={<Settings size={18} />} 
              label="Settings" 
              active={activeView === 'settings'}
              onClick={() => setActiveView('settings')}
            />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {activeView === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <StatCard label="Total Views" value="24.5k" change="+12%" />
              <StatCard label="Total Posts" value={allPosts.length.toString()} subtext="Lifetime" />
              <StatCard label="New Subscribers" value={subscriberCount.toString()} highlighted />
            </div>

            {/* Recent Posts Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Posts</h2>
                <button 
                  onClick={() => setActiveView('all-posts')}
                  className="text-primary font-bold text-sm flex items-center gap-2 group"
                >
                  View All Posts
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-100 dark:border-slate-800">
                      <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Title</th>
                      <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                      <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                      <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {recentPosts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-500 dark:text-slate-400">
                          No recent posts found. Create your first post!
                        </td>
                      </tr>
                    ) : (
                      recentPosts.map((post) => (
                        <tr key={post.id} className="group">
                          <td className="py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                                <img src={post.image} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{post.title}</p>
                                <p className="text-xs text-slate-400">{post.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                              post.status === 'published' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="py-6 text-sm text-slate-500 dark:text-slate-400">
                            {post.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleEdit(post)}
                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => setPostToDelete(post.id)}
                                className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                              >
                                <Trash size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeView === 'new-post' && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-10 mb-12">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {editingPostId ? 'Edit Post' : 'Create New Post'}
              </h2>
              <div className="flex gap-4">
                {editingPostId && (
                  <button 
                    onClick={resetForm}
                    className="px-6 py-2.5 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
                <button 
                  onClick={handleSeedPost}
                  disabled={isPublishing}
                  className="px-6 py-2.5 text-emerald-600 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Sparkles size={18} />
                  Seed Sample React Post
                </button>
                <button 
                  onClick={() => handlePublish('draft')}
                  disabled={isPublishing}
                  className="px-6 py-2.5 text-primary font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl transition-colors"
                >
                  {editingPostId ? 'Save as Draft' : 'Save Draft'}
                </button>
                <button 
                  onClick={() => handlePublish('published')}
                  disabled={isPublishing}
                  className="px-8 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                  {isPublishing ? 'Saving...' : (editingPostId ? 'Update Post' : 'Publish')}
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <input 
                type="text" 
                placeholder="Post Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-bold border-none bg-slate-50 dark:bg-slate-800 dark:text-white rounded-2xl px-8 py-6 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/10 transition-all"
              />

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                  >
                    <option>React & Frontend</option>
                    <option>Architecture</option>
                    <option>DevOps</option>
                    <option>AI</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Tags</label>
                  <input 
                    type="text" 
                    placeholder="Enter tags separated by commas"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Featured Image</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="relative group">
                  <div 
                    onClick={handleImageUpload}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] p-16 text-center hover:border-primary/40 transition-colors cursor-pointer relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center"
                  >
                    {imageUrl ? (
                      <div className="absolute inset-0 pointer-events-none">
                        <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white font-bold">Change Image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="pointer-events-none">
                        <Upload className="mx-auto text-slate-300 dark:text-slate-700 group-hover:text-primary transition-colors mb-4" size={32} />
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          Click to <span className="text-primary font-bold">upload from system</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-2">Max size: 800KB</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button 
                      onClick={handleUrlInputClick}
                      className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                    >
                      Or use Image URL
                    </button>
                  </div>

                  {showUrlInput && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-[2rem] p-8 flex flex-col items-center justify-center z-10">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Enter Image URL</h4>
                      <input 
                        type="text" 
                        value={tempImageUrl}
                        onChange={(e) => setTempImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-4 focus:ring-2 focus:ring-primary/20 outline-none dark:text-white"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={handleApplyImage}
                          className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                        >
                          Apply
                        </button>
                        <button 
                          onClick={() => setShowUrlInput(false)}
                          className="px-6 py-2 text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Content Editor</label>
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                  <ReactQuill 
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Start typing your editorial masterpiece..."
                    className="h-[400px] mb-12 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'media' && (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Media Library</h2>
                <p className="text-slate-500">Manage your assets and featured images.</p>
              </div>
              <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                <Upload size={18} />
                Upload New
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-200 cursor-pointer">
                  <img 
                    src={`https://picsum.photos/seed/media-${i}/400/400`} 
                    alt="" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="p-2 bg-white rounded-lg text-slate-900 shadow-xl">
                      <ImageIcon size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {activeView === 'all-posts' && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-10">All Posts</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-100 dark:border-slate-800">
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Title</th>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
                    <th className="pb-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {allPosts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-500 dark:text-slate-400">
                        No posts found.
                      </td>
                    </tr>
                  ) : (
                    allPosts.map((post) => (
                      <tr key={post.id} className="group">
                        <td className="py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                              <img src={post.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{post.title}</p>
                              <p className="text-xs text-slate-400">{post.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                            post.status === 'published' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="py-6 text-sm text-slate-500 dark:text-slate-400">
                          {post.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(post)}
                              className="p-2 text-slate-400 hover:text-primary transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => setPostToDelete(post.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics Overview</h2>
                <p className="text-slate-500 dark:text-slate-400">Real-time performance metrics for TechVerse.</p>
              </div>
              <div className="flex gap-4">
                <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 12 Months</option>
                </select>
              </div>
            </div>

            {/* Analytics Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <AnalyticsStatCard icon={<Eye size={20} />} label="Page Views" value="0" change="0%" positive />
              <AnalyticsStatCard icon={<Users size={20} />} label="Unique Visitors" value="0" change="0%" positive />
              <AnalyticsStatCard icon={<Clock size={20} />} label="Avg. Session" value="0m 0s" change="0%" positive={false} />
              <AnalyticsStatCard icon={<TrendingUp size={20} />} label="Bounce Rate" value="0%" change="0%" positive />
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Traffic Chart */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-slate-900 dark:text-white">Traffic Overview</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-200 dark:bg-indigo-900"></div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Visitors</span>
                    </div>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b36db" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b36db" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          backgroundColor: theme === 'dark' ? '#0f172a' : '#fff',
                          color: theme === 'dark' ? '#fff' : '#000'
                        }}
                        itemStyle={{ color: 'inherit' }}
                      />
                      <Area type="monotone" dataKey="views" stroke="#3b36db" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                      <Area type="monotone" dataKey="visitors" stroke="#c7d2fe" strokeWidth={3} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-8">Category Distribution</h3>
                <div className="h-[300px] w-full flex items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          backgroundColor: theme === 'dark' ? '#0f172a' : '#fff',
                          color: theme === 'dark' ? '#fff' : '#000'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 pr-8">
                    {categoryData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{entry.name}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">{entry.value} posts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Post Status */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-8">Publication Status</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 12 }}
                      />
                      <Tooltip 
                        cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f8faff' }}
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          backgroundColor: theme === 'dark' ? '#0f172a' : '#fff',
                          color: theme === 'dark' ? '#fff' : '#000'
                        }}
                      />
                      <Bar dataKey="value" fill="#3b36db" radius={[8, 8, 0, 0]} barSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-8">Engagement Metrics</h3>
                <div className="space-y-6">
                  <EngagementRow label="Average Likes per Post" value="142" progress={75} />
                  <EngagementRow label="Average Comments" value="28" progress={45} />
                  <EngagementRow label="Share Rate" value="12.4%" progress={60} />
                  <EngagementRow label="Newsletter Conversion" value="3.2%" progress={30} />
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeView === 'settings') && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-primary mb-6">
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{activeView.replace('-', ' ').toUpperCase()} View</h3>
            <p className="text-slate-500 dark:text-slate-400">This section is currently under development.</p>
            <button 
              onClick={() => setActiveView('dashboard')}
              className="mt-8 text-primary font-bold hover:underline"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[200]"
          >
            <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <p className="font-bold text-sm">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {postToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 max-w-md w-full shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 flex items-center justify-center mb-6">
                <Trash size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-left">Delete Post?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-left">This action cannot be undone. The post will be permanently removed from TechVerse.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setPostToDelete(null)}
                  className="flex-1 px-6 py-3 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(postToDelete)}
                  className="flex-1 px-6 py-3 bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors"
                >
                  Delete Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Cropper Modal */}
      <AnimatePresence>
        {imageToCrop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          >
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] overflow-hidden flex flex-col h-[80vh]">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Crop Featured Image</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Adjust the image to fit the blog layout.</p>
                </div>
                <button 
                  onClick={() => setImageToCrop(null)}
                  className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <X size={24} className="text-slate-400 dark:text-slate-500" />
                </button>
              </div>

              <div className="flex-1 relative bg-slate-50 dark:bg-slate-950">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={21 / 9}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>

              <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="w-full md:w-64">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Zoom Level</label>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button
                    onClick={() => setImageToCrop(null)}
                    className="flex-1 md:flex-none px-8 py-3 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCropSave}
                    className="flex-1 md:flex-none px-10 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                  >
                    Save & Apply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarLink({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
      active ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
    }`}>
      {icon}
      {label}
    </button>
  );
}

function StatCard({ label, value, change, subtext, highlighted = false }: any) {
  return (
    <div className={`p-8 rounded-3xl border transition-colors duration-300 ${
      highlighted 
        ? 'bg-primary border-primary text-white' 
        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <p className={`text-[10px] font-bold uppercase tracking-widest ${highlighted ? 'text-white/60' : 'text-slate-400'}`}>
          {label}
        </p>
        {highlighted && <PlusCircle size={18} className="text-white/60" />}
      </div>
      <div className="flex items-end gap-4">
        <p className="text-4xl font-extrabold">{value}</p>
        {change && <p className="text-xs font-bold text-primary mb-1">{change}</p>}
        {subtext && <p className={`text-xs font-bold mb-1 ${highlighted ? 'text-white/40' : 'text-slate-300 dark:text-slate-600'}`}>{subtext}</p>}
      </div>
    </div>
  );
}

function AnalyticsStatCard({ icon, label, value, change, positive }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          {icon}
        </div>
        <span className={`text-xs font-bold ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {change}
        </span>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function EngagementRow({ label, value, progress }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-bold text-slate-600 dark:text-slate-400">{label}</span>
        <span className="font-bold text-slate-900 dark:text-white">{value}</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
