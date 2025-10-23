import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: {
            react: pluginReact,
            "react-hooks": pluginReactHooks
        },
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        settings: {
            react: {
                version: "detect"
            }
        },
        rules: {
            ...pluginReact.configs.recommended.rules,
            ...pluginReactHooks.configs.recommended.rules,
            // Disable overly strict rules for existing codebase
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/display-name": "off",
            "react/no-children-prop": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "no-prototype-builtins": "off",
            "no-sparse-arrays": "off",
            "no-constant-binary-expression": "off",
            "no-empty": "warn",
            "no-var": "warn",
            "prefer-const": "warn",
            "no-extra-boolean-cast": "warn",
            // Make React hooks rules less strict
            "react-hooks/exhaustive-deps": "warn",
            "react-hooks/rules-of-hooks": "error"
        }
    }
];
