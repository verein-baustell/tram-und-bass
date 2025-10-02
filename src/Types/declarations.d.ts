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
declare module ".*/content/cities.md" {
    const attributes: {
        cities: {
            color: string;
            lng: number;
            shortName: string;
            name: string;
            slug: string;
            legal: string;
            description: string;
            released: boolean;
            lat: number;
            map?: string;
            stations: {
                name: string;
                lat: number;
                lng: number;
            }[];
            lines: Line[];
        }[];
    };
    export { attributes };
}
