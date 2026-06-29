"use client";

import { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import TurndownService from "turndown";
import { marked } from "marked";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

function mdToHtml(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

interface InlineEditorProps {
  content: string;
  onChange?: (markdown: string) => void;
  editable?: boolean;
  placeholder?: string;
}

export function InlineEditor({ content, onChange, editable = false, placeholder = "Start writing..." }: InlineEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder }),
      Underline,
      LinkExtension.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: mdToHtml(content),
    editable,
    onUpdate: ({ editor: ed }) => {
      const md = turndown.turndown(ed.getHTML());
      onChange?.(md);
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor || editable) return;
    const current = turndown.turndown(editor.getHTML());
    if (current !== content) {
      editor.commands.setContent(mdToHtml(content));
    }
  }, [editor, content, editable]);

  if (!editor) return null;

  const ToolBtn = ({ onClick, active, label, children }: { onClick: () => void; active?: boolean; label: string; children: React.ReactNode }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded text-sm transition-colors ${active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full">
      {editable && (
        <div className="flex items-center gap-0.5 pb-2 border-b border-border/30 mb-3">
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold (⌘B)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 12a4 4 0 0 0 0-8H6v8"/><path d="M15 20a4 4 0 0 0 0-8H6v8Z"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic (⌘I)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} label="Underline (⌘U)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg>
          </ToolBtn>
          <span className="w-px h-4 bg-border/50 mx-1" />
          <ToolBtn onClick={() => {
            const h = editor.isActive("heading", { level: 1 }) ? "heading" : editor.isActive("heading", { level: 2 }) ? "heading" : null;
            if (h) {
              const next = { heading: { level: 2 }, "heading:2": { level: 3 }, "heading:3": null } as const;
              const key = editor.isActive("heading", { level: 1 }) ? "heading" : editor.isActive("heading", { level: 2 }) ? "heading:2" : "heading:3";
              const n = next[key];
              if (n) editor.chain().focus().toggleHeading(n).run();
              else editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }
          }} active={editor.isActive("heading")} label="Heading (⌘⌥1-3)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/></svg>
          </ToolBtn>
          <span className="w-px h-4 bg-border/50 mx-1" />
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="Bullet list (⌘⇧8)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="Ordered list (⌘⇧7)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
          </ToolBtn>
          <span className="w-px h-4 bg-border/50 mx-1" />
          <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} label="Inline code (⌘E)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="Blockquote (⌘⇧B)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          </ToolBtn>
          <ToolBtn onClick={setLink} active={editor.isActive("link")} label="Link (⌘K)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </ToolBtn>
          <div className="ml-auto" />
          <ToolBtn onClick={() => {
            const html = editor.getHTML();
            const md = turndown.turndown(html);
            navigator.clipboard.writeText(md);
          }} label="Copy as Markdown">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          </ToolBtn>
        </div>
      )}
      <style>{`
        .ProseMirror { outline: none; min-height: 100px; padding: 0; line-height: 1.75; color: inherit; }
        .ProseMirror p { margin: 0.5em 0; }
        .ProseMirror h1 { font-size: 1.5rem; font-weight: 600; margin: 1em 0 0.5em; line-height: 1.3; }
        .ProseMirror h2 { font-size: 1.25rem; font-weight: 600; margin: 1em 0 0.5em; line-height: 1.3; }
        .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; margin: 1em 0 0.5em; line-height: 1.3; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 1.5em; margin: 0.5em 0; }
        .ProseMirror li { margin: 0.25em 0; }
        .ProseMirror code { background: rgba(128,128,128,0.1); border-radius: 3px; padding: 0.15em 0.3em; font-size: 0.9em; }
        .ProseMirror pre { background: rgba(128,128,128,0.08); border-radius: 6px; padding: 1em; overflow-x: auto; margin: 0.75em 0; }
        .ProseMirror pre code { background: none; padding: 0; }
        .ProseMirror blockquote { border-left: 3px solid rgba(128,128,128,0.3); padding-left: 1em; margin: 0.75em 0; color: rgba(128,128,128,0.8); }
        .ProseMirror hr { border: none; border-top: 1px solid rgba(128,128,128,0.2); margin: 1.5em 0; }
        .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); float: left; color: rgba(128,128,128,0.4); pointer-events: none; height: 0; }
        .ProseMirror a { color: var(--accent, #06B6D4); text-decoration: underline; cursor: pointer; }
        .ProseMirror ul { list-style-type: disc; }
        .ProseMirror ol { list-style-type: decimal; }
        .ProseMirror li > ul, .ProseMirror li > ol { margin: 0; }
        .ProseMirror s { text-decoration: line-through; }
        .ProseMirror strong { font-weight: 600; }
        .ProseMirror table { width: 100%; border-collapse: collapse; margin: 1em 0; overflow: hidden; }
        .ProseMirror th, .ProseMirror td { border: 1px solid rgba(128,128,128,0.3); padding: 0.5em 0.75em; text-align: left; vertical-align: top; }
        .ProseMirror th { background: rgba(128,128,128,0.08); font-weight: 600; }
        .ProseMirror td { background: transparent; }
        .ProseMirror table .selectedCell { background: rgba(128,128,128,0.1); }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
}
