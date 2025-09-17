// note this will call in both client and server.

export default class ShouldCaughtError extends Error {
  constructor(type: string) {
    super("A Error that should be caught by framework: " + type);
  }
}
