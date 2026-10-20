import Link from "next/link"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import type { GuideCategory } from "@/types/guide"

const blockquoteAccent: Record<GuideCategory, string> = {
  mente: "border-mente dark:border-mente-light",
  relaciones: "border-relaciones dark:border-relaciones-light",
  cuerpo: "border-cuerpo-dark dark:border-cuerpo-light",
  finanzas: "border-finanzas dark:border-finanzas-light",
  general: "border-gray-400 dark:border-gray-500",
}

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-12 scroll-mt-24 border-t border-gray-200 pt-8 text-2xl font-bold tracking-tight text-gray-900 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-800 dark:text-gray-100">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 scroll-mt-24 text-lg font-semibold text-gray-900 dark:text-gray-100">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-[1.0625rem] leading-8 text-gray-700 dark:text-gray-300">{children}</p>
  ),
  a: ({ href, children, title }) => {
    if (typeof href === "string" && href.startsWith("/")) {
      return (
        <Link
          href={href}
          title={title}
          data-interactive="true"
          className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-black hover:decoration-gray-900 dark:text-gray-100 dark:decoration-gray-600 dark:hover:text-white dark:hover:decoration-gray-200"
        >
          {children}
        </Link>
      )
    }

    return (
      <a
        href={href}
        title={title}
        target="_blank"
        rel="noopener noreferrer"
        data-interactive="true"
        className="font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-black hover:decoration-gray-900 dark:text-gray-100 dark:decoration-gray-600 dark:hover:text-white dark:hover:decoration-gray-200"
      >
        {children}
      </a>
    )
  },
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-gray-400 dark:marker:text-gray-500">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 marker:text-gray-400 dark:marker:text-gray-500">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 text-[1.0625rem] leading-8 text-gray-700 dark:text-gray-300">{children}</li>
  ),
  blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  hr: () => <hr className="my-10 border-gray-200 dark:border-gray-800" />,
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-50 dark:bg-white/5">{children}</thead>,
  th: ({ children, style }) => (
    <th
      style={style}
      className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100"
    >
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td
      style={style}
      className="border-t border-gray-200 px-4 py-3 text-sm leading-6 text-gray-700 dark:border-gray-700 dark:text-gray-300"
    >
      {children}
    </td>
  ),
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm leading-6 text-gray-100 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit dark:bg-black/60">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    if (className?.includes("language-")) {
      return <code className={className}>{children}</code>
    }

    return (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.9em] text-gray-800 dark:bg-white/10 dark:text-gray-200">
        {children}
      </code>
    )
  },
}

interface GuideMarkdownProps {
  content: string
  category: GuideCategory
}

export default function GuideMarkdown({ content, category }: GuideMarkdownProps) {
  const blockquoteClass = [
    "my-6 rounded-r-xl border-l-4 bg-gray-50 px-5 py-4 dark:bg-white/5",
    blockquoteAccent[category],
  ].join(" ")

  return (
    <div className="guide-markdown mt-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ...components,
          blockquote: ({ children }) => <blockquote className={blockquoteClass}>{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
