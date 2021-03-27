export default function first() {
    return {
        name: 'first',

        // build hooks

        options(options) {
            // kind: async, sequential
            console.log('options:>')
            console.log()
            console.log(this.meta)
        },

        buildStart(options) {
            // kind: async, parallel
            console.log('buildStart:>', options)
            console.log()
        },


        async resolveId(source, importer, options) {
            // kind: async, first (first 也是 sequential 的)
            // 可以通过 this.emitFile 在别的 hooks 中触发，或者手动调用 this.resolve 触发
            // 这里面可以定义一个 custom resolver
            console.log('resolveId:>', source, importer, options)
            console.log()
            // if (!importer) {
            //     const resolution = await this.resolve(source, undefined, {skipSelf:true})
            //     console.log(resolution)
            //     if (!resolution) return null
            //     return `${resolution.id}?entry-proxy`
            // }
            // return null
        },

        resolveDynamicImport(specifier, importer) {
            // kind: async, first (first 也是 sequential 的)
        },

        load(id) {
            // kind: async, first (first 也是 sequential 的)
            console.log('load:>', id)
            console.log()
            // if (id.endsWith('?entry-proxy')) {
            //     const importee = id.slice(0, -'?entry-proxy'.length)
            //     // return `export {default} from '${importee}';`
            //     return {id: importee, external: true}
            // }
            // return null
        },

        transform(code, id) {
            // kind: async, sequential
            console.log('transform:>')
            console.log()
        },

        moduleParsed(moduleInfo) {
            // kind: async, parallel
            console.log('moduleParsed:>', moduleInfo)
            console.log()
        },


        buildEnd(error) {
            // kind: async, parallel
            console.log('buildEnd:>', error)
            console.log()
        },

        // output hooks

        outputOptions() {
            console.log('outputOptions:>')
            console.log()
        },

        // watch specific hooks
        watchChange() {
            console.log('watchChange:>')
            console.log()
        },

        closeWatcher() {
            // kind: sync, sequential
            console.log('closeWatcher:>')
            console.log()
        },

        closeBundle() {
            console.log('closeBundle:>')
            console.log()
        }
    }
}
