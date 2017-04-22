import typescript from 'rollup-plugin-typescript'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-js-harmony';

export default {
    entry: "src/main.ts",
    dest: "dist/main.js",
    format: 'cjs',
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
        uglify({}, minify),
    ]
}