/**
 * Created by Maxi- PC on 23.11.2016.
 */
import rollup      from 'rollup'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify'

//paths are relative to the execution path
// execute from ks_notenliste
export default {
    entry: 'ksn_client/app/main-aot.js',
    dest: 'ksn_client/aot/dist/build.js', // output a single application bundle
    sourceMap: false,
    sourceMapFile: 'ksn_client/aot/dist/build.js.map',
    format: 'iife',
    plugins: [
        nodeResolve({jsnext: true, module: true}),
        commonjs({
            include: 'ksn_client/node_modules/rxjs/**'
        }),
        uglify()
    ]
}