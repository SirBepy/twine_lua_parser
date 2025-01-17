import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import polyfillNode from "rollup-plugin-polyfill-node";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
    name: "TwineToLua",
    globals: {
      string_decoder: "StringDecoder",
      events: "EventEmitter",
      timers: "Timers",
    },
  },
  plugins: [resolve({ preferBuiltins: false }), commonjs(), polyfillNode()],
};
