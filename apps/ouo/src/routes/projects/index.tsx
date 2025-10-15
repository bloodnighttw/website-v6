import { createRoute, type RouterProps } from "rpress/route";
import RootLayout from "@/layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import "server-only";
import CONFIG from "@/config/config.json";
import projectSource from "virtual:source:pj";
import type { Lang } from "@/contexts/i18n";

const defaultLang = CONFIG["prefer-lang"] ?? "en";

class SourceTree {
  #source: Map<string, (typeof projectSource)[string]> = new Map();
  #entries: Map<string, string[]> = new Map();

  constructor(source: typeof projectSource) {
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
  ): Promise<readonly [(typeof projectSource)[string], boolean]> {
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
}

const source = new SourceTree(projectSource);

export const route = createRoute("/:lang/projects/:pj", {
  generator: async () => {
    console.log("Generating routes for /:lang", source.entries());
    const routes = [] as { lang: string; pj: string }[];
    for (const entry of source.entries()) {
      const pj = entry;
      routes.push({ lang: "en", pj: pj[0] });
      routes.push({ lang: "zh", pj: pj[0] });
    }

    return routes;
  },
});

export default async function Index(props: RouterProps<typeof route>) {
  const helper = new FlatComponentHelper();
  helper.add(RootLayout, { lang: props.params.lang as Lang });
  const Flatten = helper.flatten();
  const [dyComponent] = await source.search(
    [props.params.pj],
    props.params.lang,
  );
  const DyComponent = dyComponent.default;

  return (
    <Flatten>
      <DyComponent />
      <pre className="bg-accent-100/20 p-4">
        <code>{JSON.stringify(dyComponent.zod, null, 2)}</code>
      </pre>
    </Flatten>
  );
}
