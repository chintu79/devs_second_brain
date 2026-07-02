"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TextStyle, Color, FontFamily } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { TextAlign } from "@tiptap/extension-text-align";
import { Image as ImageExtension } from "@tiptap/extension-image";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Highlighter, Palette, Type,
  Heading1, Heading2, Heading3, List, ListOrdered, ListChecks, Quote, Minus, Link, Image,
  Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Plus, X, Heading,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon, RemoveFormatting,
  Table as TableIcon, Columns, Rows, Merge, Split, Trash2, Check, ExternalLink, ChevronDown
} from "lucide-react";

const DEBOUNCE_MS = 500;

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() { return { types: ["textStyle"] as string[] }; },
  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: { fontSize: { default: null, parseHTML: (el) => el.style.fontSize || null, renderHTML: (attrs) => !attrs.fontSize ? {} : { style: `font-size: ${attrs.fontSize}` } } },
    }];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize: () => ({ chain }) => chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px", "64px"];
const FONT_FAMILIES = [
  { label: "Default", value: "Inter, system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "'JetBrains Mono', 'Fira Code', monospace" },
  { label: "Sans", value: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif" },
];

function ToolBtn({ onClick, active, label, children }: { onClick: () => void; active?: boolean; label: string; children: React.ReactNode }) {
  return (
    <button type="button" onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded-md text-xs transition-all duration-100 ${active ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}
      aria-label={label} title={label}
    >
      {children}
    </button>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return <div className={`w-px h-5 bg-border/30 mx-0.5 ${className}`} />;
}

function ContextMenuItem({ onClick, label, shortcut }: { onClick: () => void; label: string; shortcut?: string }) {
  return (
    <button onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-colors rounded-sm"
    >
      <span>{label}</span>
      {shortcut && <span className="text-[10px] text-muted-foreground/40 ml-6">{shortcut}</span>}
    </button>
  );
}

function ContextMenuSeparator() {
  return <div className="h-px bg-border/20 my-1 mx-2" />;
}

function SelectDropdown({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[]; label: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="h-7 rounded-md bg-transparent text-xs text-muted-foreground hover:text-foreground border border-border/20 px-1.5 cursor-pointer outline-none focus:border-primary/40 transition-all"
      aria-label={label}
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function RichToolbar({ editor, onLinkClick }: { editor: NonNullable<ReturnType<typeof useEditor>>; onLinkClick: () => void }) {
  const isInTable = editor.isActive("table");
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);

  const currentFontSize = editor.getAttributes("textStyle").fontSize || "16px";
  const currentFontFamily = editor.getAttributes("textStyle").fontFamily || "";

  return (
    <div className="sticky top-0 z-30 bg-sidebar/95 backdrop-blur-xl border-b border-border/30 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-0.5 px-3 py-1.5 min-w-max">
        {/* --- Text --- */}
        <div className="flex items-center gap-0.5">
          <div className="relative">
            <button onMouseDown={(e) => e.preventDefault()} onClick={() => setShowFontFamily(!showFontFamily)}
              className="h-7 rounded-md bg-transparent text-xs text-muted-foreground hover:text-foreground border border-border/20 px-1.5 flex items-center gap-1 cursor-pointer transition-all"
              aria-label="Font family"
            >
              <span className="max-w-[50px] truncate">{currentFontFamily ? FONT_FAMILIES.find(f => f.value === currentFontFamily)?.label || "Custom" : "Font"}</span>
              <ChevronDown className="h-2.5 w-2.5" />
            </button>
            {showFontFamily && (
              <div className="absolute top-full left-0 mt-1 z-50 min-w-[130px] py-1 rounded-lg bg-sidebar/95 backdrop-blur-xl border border-border/30 shadow-lg" onMouseLeave={() => setShowFontFamily(false)}>
                {FONT_FAMILIES.map((f) => (
                  <button key={f.value} onMouseDown={(e) => e.preventDefault()} onClick={() => { editor.chain().focus().setFontFamily(f.value).run(); setShowFontFamily(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-muted/60 ${editor.isActive("textStyle", { fontFamily: f.value }) ? "text-primary bg-primary/10" : "text-foreground/80"}`}
                  >{f.label}</button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button onMouseDown={(e) => e.preventDefault()} onClick={() => setShowFontSize(!showFontSize)}
              className="h-7 rounded-md bg-transparent text-xs text-muted-foreground hover:text-foreground border border-border/20 px-1.5 flex items-center gap-1 cursor-pointer transition-all w-12 justify-center"
              aria-label="Font size"
            >
              <span>{currentFontSize.replace("px", "")}</span>
              <ChevronDown className="h-2.5 w-2.5" />
            </button>
            {showFontSize && (
              <div className="absolute top-full left-0 mt-1 z-50 min-w-[80px] py-1 rounded-lg bg-sidebar/95 backdrop-blur-xl border border-border/30 shadow-lg max-h-[200px] overflow-y-auto" onMouseLeave={() => setShowFontSize(false)}>
                {FONT_SIZES.map((s) => (
                  <button key={s} onMouseDown={(e) => e.preventDefault()} onClick={() => { editor.chain().focus().setFontSize(s).run(); setShowFontSize(false); }}
                    className={`w-full text-center px-2 py-1 text-xs transition-colors hover:bg-muted/60 ${currentFontSize === s ? "text-primary bg-primary/10" : "text-foreground/80"}`}
                  >{s.replace("px", "")}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <Divider />

        {/* Formatting */}
        <div className="flex items-center gap-0.5">
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold (Ctrl+B)"><Bold className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic (Ctrl+I)"><Italic className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} label="Underline (Ctrl+U)"><UnderlineIcon className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} label="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} label="Superscript"><SuperscriptIcon className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} label="Subscript"><SubscriptIcon className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} label="Inline Code"><Code className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} label="Clear Formatting"><RemoveFormatting className="h-3.5 w-3.5" /></ToolBtn>
        </div>
        <Divider />

        {/* Headings */}
        <div className="flex items-center gap-0.5">
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} label="Heading 1"><Heading1 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Heading 2"><Heading2 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Heading 3"><Heading3 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive("heading", { level: 4 })} label="Heading 4"><Heading className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} label="Normal Text"><Type className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Quote"><Quote className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} label="Code Block"><Code className="h-3.5 w-3.5" /></ToolBtn>
        </div>
        <Divider />

        {/* Alignment */}
        <div className="flex items-center gap-0.5">
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} label="Align Left"><AlignLeft className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} label="Align Center"><AlignCenter className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} label="Align Right"><AlignRight className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} label="Justify"><AlignJustify className="h-3.5 w-3.5" /></ToolBtn>
        </div>
        <Divider />

        {/* Lists */}
        <div className="flex items-center gap-0.5">
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Bullet List"><List className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Numbered List"><ListOrdered className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} label="Checklist"><ListChecks className="h-3.5 w-3.5" /></ToolBtn>
        </div>
        <Divider />

        {/* Insert */}
        <div className="flex items-center gap-0.5">
          <ToolBtn onClick={onLinkClick} active={editor.isActive("link")} label="Insert Link (Ctrl+K)"><Link className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => { const url = window.prompt("Image URL"); if (url) editor.chain().focus().setImage({ src: url }).run(); }} label="Insert Image"><Image className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} label="Insert Table"><TableIcon className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Divider"><Minus className="h-3.5 w-3.5" /></ToolBtn>
        </div>

        {/* Table controls */}
        {isInTable && (
          <>
            <Divider />
            <div className="flex items-center gap-0.5 bg-primary/5 rounded-lg px-1 py-0.5">
              <ToolBtn onClick={() => editor.chain().focus().addRowBefore().run()} label="Add Row Above"><Rows className="h-3.5 w-3.5" /></ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().addRowAfter().run()} label="Add Row Below"><Columns className="h-3.5 w-3.5 rotate-90" /></ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().addColumnBefore().run()} label="Add Column Left"><Columns className="h-3.5 w-3.5" /></ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().addColumnAfter().run()} label="Add Column Right"><Rows className="h-3.5 w-3.5" /></ToolBtn>
              <Divider />
              <ToolBtn onClick={() => editor.chain().focus().mergeCells().run()} label="Merge Cells"><Merge className="h-3.5 w-3.5" /></ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().splitCell().run()} label="Split Cell"><Split className="h-3.5 w-3.5" /></ToolBtn>
              <Divider />
              <ToolBtn onClick={() => editor.chain().focus().deleteRow().run()} label="Delete Row"><Trash2 className="h-3.5 w-3.5 text-destructive" /></ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().deleteColumn().run()} label="Delete Column"><X className="h-3.5 w-3.5 text-destructive" /></ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().deleteTable().run()} label="Delete Table"><Trash2 className="h-3.5 w-3.5 text-destructive" /></ToolBtn>
            </div>
          </>
        )}

        <Divider />

        {/* History */}
        <div className="flex items-center gap-0.5">
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} label="Undo (Ctrl+Z)"><Undo2 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} label="Redo (Ctrl+Y)"><Redo2 className="h-3.5 w-3.5" /></ToolBtn>
        </div>
      </div>
    </div>
  );
}

export function NotesEditor({ onNewNote, placeholder, storageKey }: { onNewNote?: () => void; placeholder?: string; storageKey?: string }) {
  const NOTES_STORAGE_KEY = storageKey || "resources-notes";
  const [titleHTML, setTitleHTML] = useState("");
  const titleRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [linkPopup, setLinkPopup] = useState<{ x: number; y: number } | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // Floating toolbar
  const [floatingPos, setFloatingPos] = useState<{ x: number; y: number } | null>(null);
  const [showFloating, setShowFloating] = useState(false);
  const floatingRef = useRef<HTMLDivElement>(null);

  // Context menu
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const ctxRef = useRef<HTMLDivElement>(null);

  // Slash menu
  const [slashMenu, setSlashMenu] = useState<{ x: number; y: number; query: string } | null>(null);
  const slashRef = useRef<HTMLDivElement>(null);
  const slashIndexRef = useRef(0);

  const clearSaveTimer = useCallback(() => {
    if (saveTimerRef.current !== undefined) clearTimeout(saveTimerRef.current);
  }, []);

  const saveContent = useCallback((title: string, bodyHTML: string) => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify({ title, body: bodyHTML }));
    setLastSaved(new Date());
  }, [NOTES_STORAGE_KEY]);

  const scheduleSave = useCallback((title: string, bodyHTML: string) => {
    clearSaveTimer();
    saveTimerRef.current = setTimeout(() => saveContent(title, bodyHTML), DEBOUNCE_MS);
  }, [clearSaveTimer, saveContent]);

  // Restore content
  useEffect(() => {
    const saved = localStorage.getItem(NOTES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitleHTML(parsed.title);
        if (parsed.body) {
          setTimeout(() => {
            if (editor?.commands) editor.commands.setContent(parsed.body);
          }, 0);
        }
      } catch {}
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (titleRef.current && titleRef.current.innerHTML !== titleHTML) {
      titleRef.current.innerHTML = titleHTML;
    }
  }, [titleHTML]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Placeholder.configure({ placeholder: placeholder || "Write what you want to save here..." }),
      Underline,
      Superscript,
      Subscript,
      LinkExtension.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
      TaskList, TaskItem.configure({ nested: true }),
      TextStyle, Color, FontFamily.configure({ types: ["textStyle"] }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ImageExtension.configure({ allowBase64: true }),
      FontSize,
    ],
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === "/" && !event.ctrlKey && !event.metaKey) {
          setTimeout(() => {
            const { state } = view;
            const { from } = state.selection;
            const textBefore = state.doc.textBetween(Math.max(0, from - 50), from);
            const slashIdx = textBefore.lastIndexOf("/");
            if (slashIdx !== -1) {
              const afterSlash = textBefore.slice(slashIdx + 1);
              if (!afterSlash.includes(" ")) {
                const coords = view.coordsAtPos(from);
                setSlashMenu({ x: coords.left, y: coords.top, query: afterSlash });
                slashIndexRef.current = 0;
                return false;
              }
            }
            setSlashMenu(null);
          }, 10);
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();
            if (!file) continue;
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              editor?.chain().focus().setImage({ src }).run();
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;
        for (const file of Array.from(files)) {
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              editor?.chain().focus().setImage({ src }).run();
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      const bodyHtml = ed.getHTML();
      const title = titleRef.current?.innerHTML || "";
      scheduleSave(title, bodyHtml);
      if (slashMenu && !ed.state.selection.empty) setSlashMenu(null);
    },
    onSelectionUpdate: () => {
      const { selection } = editor?.state || {};
      if (!selection || selection.empty) {
        setShowFloating(false);
        setSlashMenu(null);
        return;
      }
      const { from, to } = selection;
      const { view } = editor!;
      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to === from ? from + 1 : to);
      setFloatingPos({
        x: (start.left + end.left) / 2,
        y: Math.min(start.top, end.top) - 8,
      });
      setShowFloating(true);
    },
  });

  useEffect(() => { return () => clearSaveTimer(); }, [clearSaveTimer]);
  useEffect(() => { return () => editor?.destroy(); }, [editor]);

  const handleTitleInput = useCallback(() => {
    const html = titleRef.current?.innerHTML || "";
    setTitleHTML(html);
    const bodyHtml = editor?.getHTML() || "";
    scheduleSave(html, bodyHtml);
  }, [editor, scheduleSave]);

  // Close menus on click outside
  useEffect(() => {
    const handler = () => { setCtxMenu(null); setSlashMenu(null); setLinkPopup(null); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const exec = useCallback((fn: () => void) => {
    fn();
    setCtxMenu(null);
    setSlashMenu(null);
  }, []);

  const execSlash = useCallback((command: string) => {
    if (!editor || !slashMenu) return;
    const { state, view } = editor;
    const { from } = state.selection;
    const textBefore = state.doc.textBetween(Math.max(0, from - 50), from);
    const slashIdx = textBefore.lastIndexOf("/");
    const deleteFrom = from - (textBefore.length - slashIdx);
    const tr = state.tr.delete(deleteFrom, from);
    view.dispatch(tr);
    requestAnimationFrame(() => {
      const cmdMap: Record<string, () => void> = {
        "heading1": () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        "heading2": () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        "heading3": () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        "bullets": () => editor.chain().focus().toggleBulletList().run(),
        "numbered": () => editor.chain().focus().toggleOrderedList().run(),
        "checklist": () => editor.chain().focus().toggleTaskList().run(),
        "table": () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
        "code": () => editor.chain().focus().toggleCodeBlock().run(),
        "divider": () => editor.chain().focus().setHorizontalRule().run(),
        "quote": () => editor.chain().focus().toggleBlockquote().run(),
      };
      cmdMap[command]?.();
    });
    setSlashMenu(null);
  }, [editor, slashMenu]);

  const handleLinkClick = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    setLinkUrl(prev);
    setLinkText(selectedText);
    setLinkPopup({ x: window.innerWidth / 2 - 120, y: 200 });
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setLinkPopup(null);
    setLinkUrl("");
    setLinkText("");
  }, [editor, linkUrl]);

  const cancelLink = useCallback(() => {
    setLinkPopup(null);
    setLinkUrl("");
    setLinkText("");
  }, []);

  const insertLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const insertImage = useCallback(() => {
    const url = window.prompt("Image URL", "https://");
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const slashCommands = useMemo(() => [
    { id: "heading1", label: "Heading 1", icon: Heading1 },
    { id: "heading2", label: "Heading 2", icon: Heading2 },
    { id: "heading3", label: "Heading 3", icon: Heading3 },
    { id: "bullets", label: "Bullet List", icon: List },
    { id: "numbered", label: "Numbered List", icon: ListOrdered },
    { id: "checklist", label: "Checklist", icon: ListChecks },
    { id: "table", label: "Table", icon: Type },
    { id: "code", label: "Code Block", icon: Code },
    { id: "divider", label: "Divider", icon: Minus },
    { id: "quote", label: "Quote", icon: Quote },
  ], []);

  const filteredSlashCommands = useMemo(() => {
    if (!slashMenu) return [];
    const q = slashMenu.query.toLowerCase();
    return q ? slashCommands.filter((c) => c.label.toLowerCase().includes(q) || c.id.includes(q)) : slashCommands;
  }, [slashMenu, slashCommands]);

  const handleSlashKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!slashMenu || filteredSlashCommands.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); slashIndexRef.current = Math.min(slashIndexRef.current + 1, filteredSlashCommands.length - 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); slashIndexRef.current = Math.max(slashIndexRef.current - 1, 0); }
    else if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); execSlash(filteredSlashCommands[slashIndexRef.current].id); }
    else if (e.key === "Escape") { e.preventDefault(); setSlashMenu(null); }
  }, [slashMenu, filteredSlashCommands, execSlash]);

  return (
    <div className="h-full flex flex-col" onContextMenu={handleContextMenu}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/10 shrink-0">
        <span className="text-xs font-medium text-muted-foreground/40 tracking-wider uppercase">
          Notes {lastSaved ? `${Math.floor((Date.now() - lastSaved.getTime()) / 1000) < 5 ? "• saved" : "• saved " + Math.floor((Date.now() - lastSaved.getTime()) / 1000) + "s ago"}` : ""}
        </span>
        <button onClick={onNewNote} aria-label="New note"
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] text-muted-foreground/50 hover:text-foreground hover:bg-muted/30 transition-all duration-150 hover:scale-[1.03]"
        >
          <Plus className="h-3 w-3" /> New Note
        </button>
      </div>

      {/* Rich Toolbar */}
      {editor && <RichToolbar editor={editor} onLinkClick={handleLinkClick} />}

      {/* Editor */}
      <div className="flex-1 overflow-y-auto" onKeyDown={handleSlashKeyDown}>
        <div className="px-10 py-6">
          <div ref={titleRef} contentEditable suppressContentEditableWarning onInput={handleTitleInput}
            data-placeholder="What do you want to build today?"
            className="text-[72px] font-bold leading-[1.1] text-foreground outline-none mb-6 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/15"
            role="textbox" aria-label="Note title" aria-multiline="false"
          />
          <EditorContent editor={editor} className="prose-editor-wrapper" />
        </div>
      </div>

      {/* Floating Toolbar */}
      {showFloating && floatingPos && editor && (
        <div ref={floatingRef}
          className="fixed z-50 flex items-center gap-0.5 px-2 py-1.5 rounded-xl bg-sidebar/95 backdrop-blur-xl border border-border/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-90 duration-100"
          style={{ left: floatingPos.x, top: floatingPos.y }}
        >
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold"><Bold className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic"><Italic className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} label="Underline"><UnderlineIcon className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} label="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} label="Inline Code"><Code className="h-3.5 w-3.5" /></ToolBtn>
          <Divider />
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} label="Heading 1"><Heading1 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="Heading 2"><Heading2 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="Heading 3"><Heading3 className="h-3.5 w-3.5" /></ToolBtn>
          <Divider />
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Bullet List"><List className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Numbered List"><ListOrdered className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} label="Checklist"><ListChecks className="h-3.5 w-3.5" /></ToolBtn>
          <Divider />
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Quote"><Quote className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={insertLink} active={editor.isActive("link")} label="Link"><Link className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={insertImage} label="Image"><Image className="h-3.5 w-3.5" /></ToolBtn>
          <Divider />
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} label="Align Left"><AlignLeft className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} label="Align Center"><AlignCenter className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} label="Align Right"><AlignRight className="h-3.5 w-3.5" /></ToolBtn>
          <Divider />
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} label="Undo"><Undo2 className="h-3.5 w-3.5" /></ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} label="Redo"><Redo2 className="h-3.5 w-3.5" /></ToolBtn>
        </div>
      )}

      {/* Link Popup */}
      {linkPopup && (
        <div className="fixed z-50 rounded-xl bg-sidebar/95 backdrop-blur-xl border border-border/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] p-4 min-w-[280px]"
          style={{ left: linkPopup.x, top: linkPopup.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-foreground">Insert Link</span>
            <button onClick={cancelLink} aria-label="Close" className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"><X className="h-3.5 w-3.5" /></button>
          </div>
          <div className="space-y-2.5">
            <div>
              <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-1 block">Display Text</label>
              <input value={linkText} onChange={(e) => setLinkText(e.target.value)}
                className="w-full h-8 rounded-lg border border-border/30 bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="Selected text..."
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider mb-1 block">URL</label>
              <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full h-8 rounded-lg border border-border/30 bg-background px-2.5 text-xs text-foreground outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="https://..."
                onKeyDown={(e) => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") cancelLink(); }}
                autoFocus
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/20">
            <button onClick={applyLink}
              className="flex-1 h-8 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >Apply</button>
            <button onClick={cancelLink}
              className="flex-1 h-8 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted/80 transition-all"
            >Cancel</button>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {ctxMenu && editor && (
        <div ref={ctxRef} className="fixed z-50 min-w-[200px] py-1.5 rounded-xl bg-sidebar/95 backdrop-blur-xl border border-border/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-100"
          style={{ left: ctxMenu.x, top: ctxMenu.y }}
        >
          <ContextMenuItem onClick={() => exec(() => document.execCommand("cut"))} label="Cut" shortcut="Ctrl+X" />
          <ContextMenuItem onClick={() => exec(() => document.execCommand("copy"))} label="Copy" shortcut="Ctrl+C" />
          <ContextMenuItem onClick={() => exec(() => document.execCommand("paste"))} label="Paste" shortcut="Ctrl+V" />
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().toggleBold().run())} label="Bold" shortcut="Ctrl+B" />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().toggleItalic().run())} label="Italic" shortcut="Ctrl+I" />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().toggleUnderline().run())} label="Underline" shortcut="Ctrl+U" />
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().toggleHeading({ level: 1 }).run())} label="Heading 1" />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().toggleHeading({ level: 2 }).run())} label="Heading 2" />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().toggleHeading({ level: 3 }).run())} label="Heading 3" />
          <ContextMenuSeparator />
          <ContextMenuItem onClick={insertLink} label="Insert Link" shortcut="Ctrl+K" />
          <ContextMenuItem onClick={() => exec(insertImage)} label="Insert Image" />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().setHorizontalRule().run())} label="Insert Divider" />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().toggleCodeBlock().run())} label="Insert Code Block" />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())} label="Insert Table" />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().toggleTaskList().run())} label="Insert Checklist" />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().toggleBlockquote().run())} label="Insert Callout" />
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => exec(() => editor.chain().focus().clearNodes().unsetAllMarks().run())} label="Clear Formatting" />
        </div>
      )}

      {/* Slash Menu */}
      {slashMenu && filteredSlashCommands.length > 0 && (
        <div ref={slashRef} className="fixed z-50 min-w-[200px] py-1 rounded-xl bg-sidebar/95 backdrop-blur-xl border border-border/30 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in-95 duration-100"
          style={{ left: slashMenu.x, top: slashMenu.y }}
        >
          <div className="px-3 py-1.5 text-[10px] font-medium text-muted-foreground/40 uppercase tracking-wider">Commands</div>
          {filteredSlashCommands.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <button key={cmd.id} onMouseDown={(e) => { e.preventDefault(); execSlash(cmd.id); }}
                onMouseEnter={() => slashIndexRef.current = i}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-foreground/80 hover:bg-muted/60 transition-colors rounded-sm ${i === slashIndexRef.current ? "bg-muted/50 text-foreground" : ""}`}
              >
                <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />
                <span>{cmd.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ProseMirror styles */}
      <style>{`
        .prose-editor-wrapper .ProseMirror { outline: none; min-height: 20vh; padding: 0; line-height: 1.75; color: inherit; font-size: 0.875rem; }
        .prose-editor-wrapper .ProseMirror p { margin: 0.4em 0; }
        .prose-editor-wrapper .ProseMirror h1 { font-size: 1.75rem; font-weight: 700; margin: 0.8em 0 0.3em; line-height: 1.3; }
        .prose-editor-wrapper .ProseMirror h2 { font-size: 1.35rem; font-weight: 600; margin: 0.8em 0 0.3em; line-height: 1.3; }
        .prose-editor-wrapper .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 0.8em 0 0.3em; line-height: 1.3; }
        .prose-editor-wrapper .ProseMirror h4 { font-size: 1rem; font-weight: 600; margin: 0.8em 0 0.3em; line-height: 1.3; }
        .prose-editor-wrapper .ProseMirror ul, .prose-editor-wrapper .ProseMirror ol { padding-left: 1.5em; margin: 0.4em 0; }
        .prose-editor-wrapper .ProseMirror li { margin: 0.15em 0; }
        .prose-editor-wrapper .ProseMirror code { background: rgba(128,128,128,0.12); border-radius: 4px; padding: 0.15em 0.35em; font-size: 0.85em; font-family: monospace; }
        .prose-editor-wrapper .ProseMirror pre { background: rgba(128,128,128,0.06); border-radius: 8px; padding: 1em; overflow-x: auto; margin: 0.75em 0; border: 1px solid rgba(128,128,128,0.1); }
        .prose-editor-wrapper .ProseMirror pre code { background: none; padding: 0; font-size: 0.8em; }
        .prose-editor-wrapper .ProseMirror blockquote { border-left: 3px solid rgba(99,102,241,0.3); padding-left: 1em; margin: 0.75em 0; color: rgba(255,255,255,0.65); }
        .prose-editor-wrapper .ProseMirror hr { border: none; border-top: 1px solid rgba(128,128,128,0.15); margin: 1.5em 0; }
        .prose-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: rgba(128,128,128,0.25); pointer-events: none; height: 0; }
        .prose-editor-wrapper .ProseMirror a { color: #6366F1; text-decoration: underline; cursor: pointer; }
        .prose-editor-wrapper .ProseMirror a:hover { opacity: 0.8; }
        .prose-editor-wrapper .ProseMirror ul { list-style-type: disc; }
        .prose-editor-wrapper .ProseMirror ol { list-style-type: decimal; }
        .prose-editor-wrapper .ProseMirror li > ul, .prose-editor-wrapper .ProseMirror li > ol { margin: 0; }
        .prose-editor-wrapper .ProseMirror s { text-decoration: line-through; }
        .prose-editor-wrapper .ProseMirror strong { font-weight: 600; }
        .prose-editor-wrapper .ProseMirror table { width: 100%; border-collapse: collapse; margin: 0.75em 0; overflow: hidden; }
        .prose-editor-wrapper .ProseMirror th, .prose-editor-wrapper .ProseMirror td { border: 1px solid rgba(128,128,128,0.25); padding: 0.4em 0.6em; text-align: left; vertical-align: top; min-width: 80px; }
        .prose-editor-wrapper .ProseMirror th { background: rgba(128,128,128,0.06); font-weight: 600; }
        .prose-editor-wrapper .ProseMirror th:hover, .prose-editor-wrapper .ProseMirror td:hover { background: rgba(128,128,128,0.02); }
        .prose-editor-wrapper .ProseMirror ul[data-type="taskList"] { list-style: none; padding-left: 0; }
        .prose-editor-wrapper .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5em; }
        .prose-editor-wrapper .ProseMirror ul[data-type="taskList"] li > label { flex-shrink: 0; margin-top: 0.25em; }
        .prose-editor-wrapper .ProseMirror ul[data-type="taskList"] li > label input[type="checkbox"] { accent-color: #6366F1; cursor: pointer; }
        .prose-editor-wrapper .ProseMirror img { max-width: 100%; height: auto; border-radius: 8px; margin: 0.75em 0; }
        .prose-editor-wrapper .ProseMirror img.ProseMirror-selectednode { outline: 2px solid #6366F1; outline-offset: 2px; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-in-90 { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-in { animation: fade-in 0.1s ease-out; }
        .fade-in { animation: fade-in 0.1s ease-out; }
        .zoom-in-90 { animation: zoom-in-90 0.1s ease-out; }
        .zoom-in-95 { animation: zoom-in-95 0.1s ease-out; }
      `}</style>
    </div>
  );
}
