import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

const typescriptPluginOptions = {
  tsconfigOverride: {
    compilerOptions: { declaration: true, allowJs: false, isolatedModules: false },
  },
}

export default [
  // CommonJS (for Node) and ES module (for bundlers) build
  {
    input: `src/${pkg.name}.ts`,
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      typescript(typescriptPluginOptions), // so Rollup can convert TypeScript to JavaScript
    ],
    output: [{ file: pkg.main, format: 'cjs' }, { file: pkg.module, format: 'es' }],
  },
]

// rollup config with typescript was adopted from:
// - https://github.com/rollup/rollup-starter-lib/blob/typescript/rollup.config.js
// - https://hackernoon.com/building-and-publishing-a-module-with-typescript-and-rollup-js-faa778c85396
