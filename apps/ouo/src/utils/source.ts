import CONFIG from "@/config/config.json";
import type { ComponentType } from "react";

const projectSource = import.meta.glob<{
  default: React.ComponentType<{
    components?: Record<string, ComponentType<any>>;
    [key: string]: any;
  }>;
}>("/docs/project/**/*.mdx");

const defaultLang = CONFIG["prefer-lang"] ?? "en";

class SourceTree {
  #source: Map<string, () => Promise<{ default: React.ComponentType }>> =
    new Map();
  #entries: Map<string, string[]> = new Map();

  constructor({
    prefix,
    source,
  }: {
    prefix: string;
    source: Record<string, () => Promise<{ default: React.ComponentType }>>;
  }) {
    Object.entries(source).forEach(([key, value]) => {
      const path = key.replace(prefix, "").replace(/\.mdx$/, "");
      const newSegment = path.split("/").filter((i) => i);
      // now put the en/zh to the end of the array
      const newSegmentI18n = [...newSegment.slice(1), newSegment[0]];
      this.#source.set(newSegmentI18n.toString(), value);
      this.#entries.set(newSegment.slice(1).toString(), newSegment.slice(1));
    });
  }

  public async search(
    path: string[],
    prefer: string,
  ): Promise<
    readonly [
      {
        default: React.ComponentType<{
          components?: Record<string, ComponentType<any>>;
          [key: string]: any;
        }>;
      },
      boolean,
    ]
  > {
    const key = [...path, prefer].toString();
    if (this.#source.has(key)) {
      const i = await this.#source.get(key)!();
      return [i, true] as const;
    } else {
      // try to find the prefered language
      const preferKey = [...path.slice(1), defaultLang].toString();
      if (this.#source.has(preferKey)) {
        return [await this.#source.get(preferKey)!(), false] as const;
      }
    }
    throw new Error("Not Found");
  }

  public entries(): string[][] {
    return [...this.#entries.values()];
  }
}

export default new SourceTree({
  prefix: "/docs/project",
  source: projectSource,
});
