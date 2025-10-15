import CONFIG from "@/config/config.json";
import type { ComponentType } from "react";

const defaultLang = CONFIG["prefer-lang"] ?? "en";

interface MDXProps {
  components?: Record<string, ComponentType<any>>;
  [key: string]: any;
}

interface Module<T> {
  default: ComponentType<MDXProps>;
  zod: T;
}

export class SourceTree<E, T extends Record<string, Module<E>>> {
  #source: Map<string, Module<E>> = new Map();
  #entries: Map<string, string[]> = new Map();

  constructor(source: T) {
    Object.entries(source).forEach(([key, value]) => {
      const newSegment = key.split("/").filter((i) => i);
      const newSegmentI18n = [...newSegment.slice(1), newSegment[0]];
      this.#source.set(newSegmentI18n.toString(), value);
      this.#entries.set(newSegment.slice(1).toString(), newSegment.slice(1));
    });
  }

  public async search(
    path: string[],
    prefer: string,
  ): Promise<readonly [Module<E>, boolean]> {
    const key = [...path, prefer].toString();
    if (this.#source.has(key)) {
      const i = this.#source.get(key)!;
      return [i, true] as const;
    } else {
      const preferKey = [...path.slice(1), defaultLang].toString();
      if (this.#source.has(preferKey)) {
        return [this.#source.get(preferKey)!, false] as const;
      }
    }
    throw new Error("Not Found");
  }

  public entries(): string[][] {
    return [...this.#entries.values()];
  }

  public getByLang(lang: string): Record<string, Module<E>> {
    const result: Record<string, Module<E>> = {};
    for (const [key, value] of this.#source.entries()) {
      const parts = key.split(",");
      if (parts[parts.length - 1] === lang) {
        const slug = parts[0];
        result[slug] = value;
      }
    }
    return result;
  }
}
