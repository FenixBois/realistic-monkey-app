/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier",
  ],
  env: {
    "cypress/globals": true,
  },
  plugins: ["cypress"],
  // we're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but it means we have to explicitly
  // set the jest version.
  settings: {
    jest: {
      version: 28,
    },
  },
  rules: {
    /**
     * Rules we don't want to apply
     */
    "import/no-anonymous-default-export": "off",
    /**
     *  Rules override needed until we include them into ackee-eslint-config
     */
    "react/react-in-jsx-scope": "off",
    /**
     *  Override core rules with their typesript version
     *  https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-am-using-a-rule-from-eslint-core-and-it-doesnt-work-correctly-with-typescript-code
     */
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "padding-line-between-statements": [
      "warn",
      {
        blankLine: "always",
        prev: "*",
        next: "return",
      },
      { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
      {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"],
      },
      {
        blankLine: "always",
        prev: ["function", "class", "multiline-const"],
        next: "*",
      },
      { blankLine: "always", prev: ["import", "export"], next: "*" },
      { blankLine: "any", prev: "import", next: "import" },
      { blankLine: "any", prev: "export", next: "export" },
    ],
  },
};
