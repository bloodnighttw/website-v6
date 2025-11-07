import CONFIG from "@/config/config.json";
import type { ComponentType } from "react";

const defaultLang = CONFIG["prefer-lang"] ?? "zh";

interface MDXProps {
  components?: Record<string, ComponentType<any>>;
  [key: string]: any;
}

// Base module interface with common properties
export interface BaseModule<T> {
  default: ComponentType<MDXProps>;
  zod: T;
}

// Module interface for blog posts (with preview)
export interface BlogModule<T> extends BaseModule<T> {
  preview: string | undefined;
}

// Module interface for projects (without preview)
export interface ProjectModule<T> extends BaseModule<T> {}

// Generic module type that can be either BlogModule or ProjectModule
export type Module<T, M extends BaseModule<T> = BaseModule<T>> = M;

interface SourceEntry {
  slug: string;
  lang: string;
}

/**
 * SourceTree manages i18n content from MDX files
 *
 * Input format: "lang/slug/nested" (e.g., "en/blog-post", "zh/about")
 * Internal storage: Map<"slug,lang", Module> (e.g., "blog-post,en")
 */
export class SourceTree<
  E,
  M extends BaseModule<E> = BaseModule<E>,
  T extends Record<string, M> = Record<string, M>,
> {
  #modules: Map<string, M> = new Map();
  #slugs: Set<string> = new Set();

  constructor(source: T) {
    for (const [path, module] of Object.entries(source)) {
      const entry = this.parsePath(path);
      if (!entry) continue;

      // Store as "slug,lang" format
      const key = this.createKey(entry.slug, entry.lang);
      this.#modules.set(key, module);
      this.#slugs.add(entry.slug);
    }
  }

  /**
   * Parse path from "lang/slug/nested" to {slug, lang}
   */
  private parsePath(path: string): SourceEntry | null {
    const segments = path.split("/").filter(Boolean);
    if (segments.length < 2) return null;

    const [lang, ...slugParts] = segments;
    const slug = slugParts.join("/");

    return { slug, lang };
  }

  /**
   * Create internal key from slug and lang
   */
  private createKey(slug: string, lang: string): string {
    return `${slug},${lang}`;
  }

  /**
   * Search for a module by slug and language
   * Returns [module, isExactMatch]
   * - If found in preferred language: [module, true]
   * - If found in default language: [module, false]
   * - If not found: throws error
   */
  public async search(
    slug: string[],
    preferredLang: string,
  ): Promise<readonly [M, boolean]> {
    const slugStr = slug.join("/");

    // Try preferred language first
    const preferredKey = this.createKey(slugStr, preferredLang);
    if (this.#modules.has(preferredKey)) {
      return [this.#modules.get(preferredKey)!, true] as const;
    }

    // Fallback to default language
    const fallbackKey = this.createKey(slugStr, defaultLang);
    if (this.#modules.has(fallbackKey)) {
      return [this.#modules.get(fallbackKey)!, false] as const;
    }

    throw new Error(
      `Content not found: slug="${slugStr}", languages tried: [${preferredLang}, ${defaultLang}]`,
    );
  }

  /**
   * Get all unique slugs (without language)
   */
  public getSlugs(): string[] {
    return Array.from(this.#slugs);
  }

  /**
   * Get all entries as [slug] arrays for route generation
   */
  public entries(): string[][] {
    return this.getSlugs().map((slug) => [slug]);
  }

  /**
   * Get all modules with their preferred language
   * Returns a record where each slug maps to the module in the preferred language (or default language if not available)
   */
  public entriesWithLang(preferredLang: string): Record<string, M> {
    const result: Record<string, M> = {};

    for (const slug of this.#slugs) {
      // Try preferred language first
      const preferredKey = this.createKey(slug, preferredLang);
      if (this.#modules.has(preferredKey)) {
        result[slug] = this.#modules.get(preferredKey)!;
        continue;
      }

      // Fallback to default language
      const fallbackKey = this.createKey(slug, defaultLang);
      if (this.#modules.has(fallbackKey)) {
        result[slug] = this.#modules.get(fallbackKey)!;
      }
    }

    return result;
  }

  /**
   * Get all modules for a specific language
   */
  public getByLang(lang: string): Record<string, M> {
    const result: Record<string, M> = {};

    for (const slug of this.#slugs) {
      const key = this.createKey(slug, lang);
      const module = this.#modules.get(key);
      if (module) {
        result[slug] = module;
      }
    }

    return result;
  }

  /**
   * Get all available languages for a slug
   */
  public getAvailableLanguages(slug: string): string[] {
    const languages: string[] = [];

    for (const [key] of this.#modules) {
      const [keySlug, keyLang] = key.split(",");
      if (keySlug === slug) {
        languages.push(keyLang);
      }
    }

    return languages;
  }

  /**
   * Check if content exists for a slug in a specific language
   */
  public has(slug: string, lang: string): boolean {
    return this.#modules.has(this.createKey(slug, lang));
  }
}
