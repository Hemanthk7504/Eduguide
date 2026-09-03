import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
  compact?: boolean;
}

/**
 * Some backends emit literal "<br>" inside markdown table cells instead of
 * a GFM-safe line break. remark-gfm won't render raw HTML, so normalize
 * those into a separator our custom cell renderer expands into lines.
 */
function normalize(content: string): string {
  return content.replace(/<br\s*\/?>/gi, "\n");
}

export function Markdown({ content, compact = false }: MarkdownProps) {
  const textSize = compact ? "text-sm" : "text-sm leading-relaxed";

  return (
    <div className={`markdown-body ${textSize}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-5 font-display text-lg font-semibold first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-5 font-display text-base font-semibold first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-sm font-semibold text-[var(--color-ink)] first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-3 leading-relaxed text-[var(--color-ink-dim)] last:mb-0">{children}</p>
          ),
          strong: ({ children }) => <strong className="font-semibold text-[var(--color-ink)]">{children}</strong>,
          em: ({ children }) => <em className="text-[var(--color-ink)]">{children}</em>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[var(--color-brand)] underline decoration-[var(--color-brand)]/30 underline-offset-2 hover:text-[var(--color-brand-hover)]"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 text-[var(--color-ink-dim)] last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5 text-[var(--color-ink-dim)] last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="pl-0.5">{children}</li>,
          hr: () => <hr className="my-4 border-[var(--color-border-soft)]" />,
          code: ({ children }) => (
            <code className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-ink)]">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-3 border-l-2 border-[var(--color-brand)]/40 pl-3 text-[var(--color-ink-faint)] last:mb-0">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto rounded-xl border border-[var(--color-border-soft)] last:mb-0">
              <table className="w-full border-collapse text-left text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[var(--color-surface-2)] text-[var(--color-ink-faint)]">{children}</thead>
          ),
          tbody: ({ children }) => children,
          tr: ({ children }) => <tr className="border-t border-[var(--color-border-soft)] first:border-t-0">{children}</tr>,
          th: ({ children }) => (
            <th className="whitespace-pre-line px-3 py-2 align-top font-medium">{children}</th>
          ),
          td: ({ children }) => (
            <td className="whitespace-pre-line px-3 py-2 align-top text-[var(--color-ink-dim)]">{children}</td>
          ),
        }}
      >
        {normalize(content)}
      </ReactMarkdown>
    </div>
  );
}
