import {defineConfig} from "eslint/config";
import js from "@eslint/js";
import globals from "globals";


export default defineConfig([
    {
        files: ['src/js/**/*.{js,mjs,cjs}', 'src/blocks/**/*.{js,mjs,cjs}'],
        ignores: ['src/blocks/__example/**'],
        ...js.configs.recommended,
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            ...js.configs.recommended.rules
        },
    }
]);
