import typescript from 'rollup-plugin-typescript'

export default {
    entry: "src/main.ts",
    dest: "dist/main.js",
    format: 'umd',
    moduleName: 'course-scheduler',
    plugins: [
        typescript({
            typescript: require('typescript'),
        })
    ]
}