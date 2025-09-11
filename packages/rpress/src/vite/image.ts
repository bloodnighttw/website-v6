import { type Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

export function image(): Plugin[] {
  let imageOutDir: string;
  let clientOutDir: string;
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
      resolveId(id) {
        if (id === "virtual:rpress:image") {
          if (this.environment.name === "client") {
            return this.resolve("./node_modules/rpress/dist/image/loader");
          } else {
            return this.resolve("./node_modules/rpress/dist/image/server");
          }
        }
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
          if (!fs.existsSync(dest)) {
            await fs.promises.mkdir(dest, { recursive: true });
          }
          if (fs.existsSync(imageOutDir)) {
            const files = await fs.promises.readdir(imageOutDir);
            await Promise.all(
              files.map((file) => {
                (console.log("Copying image:", file),
                  fs.promises.copyFile(
                    path.join(imageOutDir, file),
                    path.join(dest, file),
                  ));
              }),
            );
          }
        }
      },
    },
  ];
}
