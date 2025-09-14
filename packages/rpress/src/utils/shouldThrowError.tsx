// this error will stop rsc to render.
export default class ShouldThrowError extends Error {
  constructor(type: string, options?: ErrorOptions) {
    super("A Error that shouldn't be caught by framework: " + type, options);
  }
}
