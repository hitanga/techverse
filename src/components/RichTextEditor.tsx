import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';

// Custom Extension for Font Size
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    } as any;
  },
});

// Custom Extension for Line Height
const LineHeight = Extension.create({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultLineHeight: '1.6',
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight,
            renderHTML: attributes => {
              if (!attributes.lineHeight) {
                return {};
              }
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight: lineHeight => ({ commands }) => {
        return this.options.types.every(type => commands.updateAttributes(type, { lineHeight }));
      },
      unsetLineHeight: () => ({ commands }) => {
        return this.options.types.every(type => commands.resetAttributes(type, 'lineHeight'));
      },
    } as any;
  },
});

import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  Link as LinkIcon, Image as ImageIcon, Undo, Redo,
  Heading1, Heading2, Heading3, Type, Quote, Code,
  ChevronDown
} from 'lucide-react';

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px'];
const LINE_HEIGHTS = ['1.0', '1.2', '1.4', '1.6', '1.8', '2.0', '2.5'];

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder,
      }),
      TextStyle,
      Color,
      Highlight,
      FontSize,
      LineHeight,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false,
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean;
    children: React.ReactNode; 
    title: string;
  }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      type="button"
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary text-white' 
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col w-full border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm min-h-[600px]">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex gap-1 pr-2 border-r border-slate-200 dark:border-slate-800">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex gap-1 px-2 border-r border-slate-200 dark:border-slate-800">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex gap-1 px-2 border-r border-slate-200 dark:border-slate-800">
          {/* Font Size Dropdown */}
          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 px-2 rounded-lg">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Size</span>
            <select 
              className="bg-transparent text-xs font-medium focus:outline-none dark:text-slate-300 py-1"
              onChange={(e) => {
                if (e.target.value === '') {
                  editor.chain().focus().unsetFontSize().run();
                } else {
                  editor.chain().focus().setFontSize(e.target.value).run();
                }
              }}
              value={editor.getAttributes('textStyle').fontSize || ''}
            >
              <option value="">Default</option>
              {FONT_SIZES.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Line Height Dropdown */}
          <div className="flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 px-2 rounded-lg ml-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Height</span>
            <select 
              className="bg-transparent text-xs font-medium focus:outline-none dark:text-slate-300 py-1"
              onChange={(e) => {
                if (e.target.value === '') {
                  editor.chain().focus().unsetLineHeight().run();
                } else {
                  // @ts-ignore
                  editor.chain().focus().setLineHeight(e.target.value).run();
                }
              }}
              value={editor.getAttributes('paragraph').lineHeight || ''}
            >
              <option value="">Default</option>
              {LINE_HEIGHTS.map(height => (
                <option key={height} value={height}>{height}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-1 px-2 border-r border-slate-200 dark:border-slate-800">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex gap-1 px-2 border-r border-slate-200 dark:border-slate-800">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex gap-1 px-2 border-r border-slate-200 dark:border-slate-800">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="Align Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex gap-1 px-2">
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive('link')}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={addImage}
            title="Add Image"
          >
            <ImageIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content Container */}
      <div className="flex-1 p-6 blog-content overflow-y-auto">
        <EditorContent editor={editor} className="prose dark:prose-invert max-w-none" />
      </div>

      <style>{`
        .ProseMirror {
          min-height: 500px;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 { font-size: 2.25rem !important; margin-top: 1.5rem !important; margin-bottom: 1rem !important; font-weight: 700 !important; }
        .ProseMirror h2 { font-size: 1.875rem !important; margin-top: 1.25rem !important; margin-bottom: 0.75rem !important; font-weight: 700 !important; }
        .ProseMirror h3 { font-size: 1.5rem !important; margin-top: 1rem !important; margin-bottom: 0.5rem !important; font-weight: 600 !important; }
        .ProseMirror p { margin-bottom: 1rem !important; }
        .ProseMirror ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; }
        .ProseMirror ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; }
        .ProseMirror blockquote { border-left: 4px solid #3b36db; padding-left: 1rem; font-style: italic; margin-bottom: 1rem; }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
