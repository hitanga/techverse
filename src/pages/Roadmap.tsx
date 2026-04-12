import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Terminal, 
  Layers, 
  Database, 
  Globe, 
  Cpu, 
  Cloud, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Map
} from 'lucide-react';

const roadmapData = [
  {
    id: 'frontend',
    title: 'Frontend Mastery',
    category: 'React & Frontend',
    icon: <Globe className="text-blue-500" />,
    description: 'Master the art of building beautiful, responsive user interfaces.',
    steps: ['HTML5 & Semantic Web', 'Advanced CSS & Tailwind', 'JavaScript ES6+', 'React & State Management', 'Performance Optimization']
  },
  {
    id: 'backend',
    title: 'Backend Architecture',
    category: 'Architecture',
    icon: <Database className="text-emerald-500" />,
    description: 'Build scalable servers and manage complex data systems.',
    steps: ['Node.js & Express', 'PostgreSQL & MongoDB', 'API Design (REST/GraphQL)', 'Authentication & Security', 'Microservices']
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud',
    category: 'DevOps',
    icon: <Cloud className="text-indigo-500" />,
    description: 'Deploy, scale, and manage infrastructure like a pro.',
    steps: ['Docker & Containers', 'CI/CD Pipelines', 'AWS/Google Cloud', 'Kubernetes', 'Monitoring & Logging']
  },
  {
    id: 'ai',
    title: 'AI & Machine Learning',
    category: 'AI',
    icon: <Sparkles className="text-purple-500" />,
    description: 'Integrate intelligent features into your applications.',
    steps: ['Python Fundamentals', 'Data Analysis', 'Neural Networks', 'LLM Integration', 'AI Ethics']
  }
];

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Map size={14} />
            Learning Paths
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6"
          >
            Your Path to <span className="text-primary">Excellence</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            Follow our curated roadmaps to master the most in-demand technologies in the industry.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {roadmapData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-none hover:shadow-slate-200/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600">
                  {item.steps.length} Modules
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                {item.description}
              </p>

              <div className="space-y-4">
                {item.steps.map((step, sIndex) => (
                  <div key={sIndex} className="flex items-center gap-4 group/step">
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 dark:text-slate-500 group-hover/step:bg-primary group-hover/step:text-white transition-colors">
                      {sIndex + 1}
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover/step:text-slate-900 dark:group-hover/step:text-white transition-colors">
                      {step}
                    </span>
                    <ChevronRight size={14} className="ml-auto text-slate-200 dark:text-slate-700 group-hover/step:text-primary transition-colors" />
                  </div>
                ))}
              </div>

              <Link to={`/blog?category=${encodeURIComponent(item.category)}`}>
                <button className="w-full mt-10 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                  Start Learning Path
                  <ArrowRight size={18} />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
