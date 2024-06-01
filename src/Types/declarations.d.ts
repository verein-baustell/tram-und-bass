// svelte-markdown.d.ts
// svelte-markdown.d.ts
declare module "svelte-markdown" {
  import { SvelteComponentTyped } from "svelte";

  interface SvelteMarkdownProps {
    source?: string;
  }

  export default class SvelteMarkdown extends SvelteComponentTyped<SvelteMarkdownProps> {}
}
declare module "*.md" {
  const attributes: Record<string, any> | undefined;
  export { attributes };
}
declare module ".*/content/lines.md" {
  const attributes: {
    lines: Line[];
  };
  export { attributes };
}
