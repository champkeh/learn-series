export default function moduleProxy() {
    return {
        name: 'module-proxy',

        async resolveId(source, importer) {
            if (!importer) {
                const resolution = await this.resolve(source, undefined, { skipSelf: true });
                if (!resolution) return null
                return `${resolution.id}?entry-proxy`
            }
            return null
        },

        load(id) {
            if (id.endsWith('?entry-proxy')) {
                const importee = id.slice(0, -'?entry-proxy'.length)
                return `export {default} from '${importee}';`
            }
            return null
        }
    }
}
