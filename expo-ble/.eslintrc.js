module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    jsx: true,
  },
  plugins: ["react", "react-native", "@typescript-eslint"],
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "no-undef": "off",
    "no-var": "error",
    "prefer-template": "error",
    "no-unused-vars": "off",
    "react-native/no-unused-styles": 2,
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    indent: "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/array-type": ["error", { default: "generic" }],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      { accessibility: "explicit" },
    ],
    "import/prefer-default-export": "off",
    "react/jsx-one-expression-per-line": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/ban-types": "off",
    "no-unneeded-ternary": "error",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": [
      "error",
      {
        ignoreTypeValueShadow: true,
        ignoreFunctionTypeParameterNameValueShadow: true,
      },
    ],
    eqeqeq: "error",
    "no-empty-function": "error",
    "no-nested-ternary": "error",
  },
  overrides: [
    {
      files: ["**/*.js", "**/*.jsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/no-magic-numbers": "off",
      },
    },
  ],
};
