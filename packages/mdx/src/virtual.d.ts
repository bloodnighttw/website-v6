declare module "virtual:source:*" {
  const modules: Record<string, string>;
  export default modules;
}
