import { visit } from "unist-util-visit";
import type { Root, Image } from "mdast";
import type { Program } from "estree";
import type { VFile } from "vfile";

export function remarkExtractImage() {
  return () => (tree: Root, vfile: VFile) => {
    visit(tree, "image", (node: Image) => {
      if (node.url) {
        if (vfile.data.preview) return;
        vfile.data.preview = node.url;
      }
    });
  };
}

export function recmaInjectPreview() {
  return () => (tree: Program, vfile: VFile) => {
    if (vfile.data.preview) {
      tree.body.push({
        type: "ExportNamedDeclaration",
        declaration: {
          type: "VariableDeclaration",
          declarations: [
            {
              type: "VariableDeclarator",
              id: { type: "Identifier", name: "preview" },
              init: {
                type: "Literal",
                value: JSON.stringify(vfile.data.preview),
                raw: JSON.stringify(vfile.data.preview),
              },
            },
          ],
          kind: "const",
        },
        specifiers: [],
      } as any);
    }
  };
}
