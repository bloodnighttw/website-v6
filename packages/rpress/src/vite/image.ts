import { type Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

export function image(): Plugin[] {
  let imageOutDir: string;
  let clientOutDir: string;
  let isBuild = false;
  return [
    {
      name: "rpress:image",
      configResolved(config) {
        config.build.rollupOptions.external = [
          // ...((config.build.rollupOptions.external as string[]) || []),
          "./node_modules/rpress/dist/image/loader",
          "./node_modules/rpress/dist/image/server",
        ];
      },
      buildStart() {
        isBuild = true;
      },
      resolveId(id) {
        if (id === "virtual:rpress:image") {
          if (this.environment.name === "client" || !isBuild) {
            return this.resolve("./node_modules/rpress/dist/image/loader");
          } else {
            return this.resolve("./node_modules/rpress/dist/image/server");
          }
        }
      },
      buildEnd() {
        isBuild = false;
      },
    },
    {
      name: "rpress:image-base",
      configResolved(config) {
        imageOutDir = config.build.outDir + "/images/";
        clientOutDir = config.environments.client.build.outDir;
      },
      resolveId(id) {
        if (id === "virtual:rpress:image-base") {
          return "\0" + id;
        }
      },
      load(id) {
        if (id === "\0virtual:rpress:image-base") {
          return `export default "${imageOutDir}"`;
        }
      },
      // copy into client build dir after build
      async closeBundle() {
        if (this.environment.name === "ssr") {
          // copy all files from base to clientOutDir/images
          const dest = path.join(clientOutDir, "images");
          if (!fs.existsSync(imageOutDir)) return;

          if (!fs.existsSync(dest)) {
            await fs.promises.mkdir(dest, { recursive: true });
          }

          console.log("Copying images to client build:", dest, imageOutDir);
          // copy all files from imageOutDir to dest
          const files = await fs.promises.readdir(imageOutDir);
          await Promise.all(
            files.map((file) =>
              fs.promises.copyFile(
                path.join(imageOutDir, file),
                path.join(dest, file),
              ),
            ),
          );
        }
      },
    },
  ];
}
