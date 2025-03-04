import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: true,
});

const eslintConfig = [
	...compat.config({
		extends: [
			"next/core-web-vitals",
			"next/typescript",
			"standard",
			"plugin:tailwindcss/recommended",
			"prettier",
		],
		rules: {
			semi: ["error", "always"],
			"prefer-arrow-callback": ["error"],
			"prefer-template": ["error"],
			"no-undef": "off",
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		ignorePatterns: [".next/", "node_modules/"],
	}),
];

export default eslintConfig;
