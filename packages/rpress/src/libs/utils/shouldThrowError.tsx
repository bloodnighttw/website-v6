// this error will stop rsc to render.
export default class ShouldThrowError extends Error {
  constructor(type?: string, options?: ErrorOptions) {
    super(type ?? "A Error that shouldn't be caught by framework!", options);
  }
}
