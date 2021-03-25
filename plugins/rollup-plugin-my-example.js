export default function myExample() {
    return {
        name: 'my-example',

        resolveId(source) {
            if (source === 'virtual-module') {
                // this signals that rollup should not ask other plugins or check the file system to find this id
                return source
            }
            // other ids should be handled as usually
            return null
        },

        load(id) {
            if (id === 'virtual-module') {
                // the source code for "virtual-module"
                return 'export default "This is virtual!"'
            }
            // other ids should be handled as usually
            return null
        }
    }
}
