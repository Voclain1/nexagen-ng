import "server-only";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx";

/**
 * Compiles an MDX string on the server (at build time for static pages).
 * Components available inside content are listed in src/components/mdx.tsx.
 */
export async function MDXContent({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: true }]],
  });
  return <Content components={mdxComponents} />;
}
