import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

export function Markdown({
  children,
  components,
}: {
  children: string;
  components?: Components;
}) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ ...markdownComponents, ...components }} skipHtml>
      {children}
    </ReactMarkdown>
  );
}

export const markdownComponents: Components = {
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const isInline = !className && !match;
    if (isInline) return <code className="inline-code" {...props}>{children}</code>;
    return (
      <div className="code-block-wrapper">
        {match && <div className="code-block-header"><span className="code-block-lang">{match[1]}</span></div>}
        <pre className={`code-block ${match ? "has-header" : ""}`}><code className={className} {...props}>{children}</code></pre>
      </div>
    );
  },
  blockquote: ({ children, ...props }) => <blockquote className="note-blockquote" {...props}>{children}</blockquote>,
  a: ({ children, href, ...props }) => <a className="note-link" href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
  ul: ({ children, ...props }) => <ul className="note-list" {...props}>{children}</ul>,
  ol: ({ children, ...props }) => <ol className="note-list" {...props}>{children}</ol>,
  table: ({ children, ...props }) => <div className="note-table-wrapper"><table className="note-table" {...props}>{children}</table></div>,
};
