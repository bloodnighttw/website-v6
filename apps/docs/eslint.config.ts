import config from "@rpress/eslint";

export default [
  ...config,
  {
    plugins: ["@stylexjs"],
    rules: {
      "@stylexjs/valid-styles": "error",
      "@stylexjs/no-unused": "error",
      "@stylexjs/valid-shorthands": "warn",
      "@stylexjs/sort-keys": "warn",
    },
  },
];
