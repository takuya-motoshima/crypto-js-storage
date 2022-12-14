import typescript from 'rollup-plugin-typescript2';
import {terser} from "rollup-plugin-terser";
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import pkg from './package.json';

// Determine whether it is a production environment
const isPro = () => {
  return process.env.NODE_ENV === 'production';
}

export default {
  input: './src/index.ts',
  plugins: [
    typescript({
      tsconfigDefaults: {compilerOptions: {}},
      tsconfig: "tsconfig.json",
      tsconfigOverride: {compilerOptions: {}},
      useTsconfigDeclarationDir: true
    }),
    isPro() && terser(),
    // terser(),
    json(),
    commonjs(),
    nodeResolve({
      mainFields: ['module', 'main'],
      browser: true
    })
  ],
  output: [
    // ES module (for bundlers) build.
    {
      format: 'esm',
      file: pkg.module
    },
    // browser-friendly UMD build
    {
      format: 'umd',
      file: pkg.browser,
      name: pkg.name
        .replace(/^.*\/|\.js$/g, '')
        .replace(/^([a-z])/, group => group.toUpperCase())
        .replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''))
    }
  ],
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**'
  }
}