const expoConfig = require("eslint-config-expo/flat");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    rules: {
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
    },
  },
]);
