// this error will stop rsc to render.
export default class ShouldThrowError extends Error {
  constructor(type: string, options?: ErrorOptions) {
    super("A Error that should be caught by framework: " + type, options);
  }
}
