import CONFIG from "@/config/config.json";

const projectSource = import.meta.glob<{ default: React.ComponentType }>(
  "/docs/project/**/*.mdx",
);

const defaultLang = CONFIG["prefer-lang"] ?? "en";

class SourceTree {
  #source: Map<string, () => Promise<{ default: React.ComponentType }>> =
    new Map();
  #entries: Map<string, string[]> = new Map();

  constructor(
    prefix: string,
    source: Record<string, () => Promise<{ default: React.ComponentType }>>,
  ) {
    Object.entries(source).forEach(([key, value]) => {
      const path = key.replace(prefix, "").replace(/\.mdx$/, "");
      const newSegment = path.split("/");
      // now put the en/zh to the end of the array
      const newSegmentI18n = [...newSegment.slice(1), newSegment[0]];
      this.#source.set(newSegmentI18n.toString(), value);
    });
  }

  public search(path: string[], prefer: string) {
    if (!this.#entries.has(path.toString())) {
      throw new Error("Not Found");
    }
    const key = [...path, prefer].toString();
    if (this.#source.has(key)) {
      return [this.#source.get(key)!, true] as const;
    } else {
      // try to find the prefered language
      const preferKey = [...path.slice(1), defaultLang].toString();
      if (this.#source.has(preferKey)) {
        return [this.#source.get(preferKey)!, false] as const;
      }
    }
  }

  public entries(): string[][] {
    return [...this.#entries.values()];
  }
}

export default new SourceTree("/docs/project", projectSource);
