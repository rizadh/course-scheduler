import typescript from 'rollup-plugin-typescript'

export default {
    entry: "src/main.ts",
    dest: "dist/bundle.js",
    format: 'cjs',
    plugins: [
        typescript({
            typescript: require('typescript')
        })
    ]
}