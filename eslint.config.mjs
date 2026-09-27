import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next 16 removed `next lint`; `npm run lint` runs the ESLint CLI with this
// flat config instead.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // CommonJS files: require() is the only import they have.
    files: ["**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "Build/**", "public/**", "next-env.d.ts"]),
]);
