const Koa = require('koa')
const body = require('koa-json-body')
const cors = require('@koa/cors')
const fs = require('fs')
const path = require('path')

const app = new Koa()

const PORT = 5000

const events = {}

app.use(cors())
app.use(body({limit: '10mb', fallback: true}))

app.use(async ctx => {
    switch (ctx.path) {
        case '/save':
            const data = ctx.request.body
            events[data.uid] = events[data.uid] || []
            events[data.uid].push(...data.events)
            ctx.body = {code:0,msg:'save ok'}
            console.log(`save uid: <${data.uid}> ${data.events.length} records`)
            break
        case '/users':
            ctx.body = {code:0,msg:'ok',data:Object.keys(events)}
            break
        case '/fetch':
            console.log(ctx.query)
            const { uid } = ctx.query
            ctx.body = {code:0,msg:'fetch ok', data: events[uid]}
            break
        case '/persist':
            const file = path.resolve(__dirname, 'events.json')
            fs.writeFileSync(file, JSON.stringify(events))
            ctx.body = {code:0,msg:'ok'}
            break
        case '/html':
            ctx.body = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MutationObserver</title>
</head>
<body id="root">
<script>
    const observer = new MutationObserver((mutations, observer) => {
        console.log(mutations)
    })

    const root = document.getElementById('root')
    observer.observe(root, {
        childList: true,
        attributes: true,
        attributeOldValue: true,
    })

    // const textarea = document.createElement('textarea')
    // const select = document.createElement('select')
    // root.appendChild(textarea)
    // root.replaceChild(select, textarea)

    root.hidden = true
    root.hidden = false
    root.id = 'myid123'
    root.id = 'youid345'
    root.title = 'root-document'
    root.title = 'Root document'
    root.onclick = () => {}
    root.tabIndex = 1
    root.option = 'f'

    const someHttpRequest = async () => {
        const res = await fetch('https://www.example.com')
        return res.text()
    }

    someHttpRequest().then(text => {
        const span = document.createElement('span')
        span.innerHTML += text.substring(0, 100)
        root.dataset.something = span.innerHTML
        root.style.backgroundColor = 'red'
    })
</script>
</body>
</html>
`
            break
        default:
            ctx.body = {code:1,msg:'unsupported operation:' + ctx.path}
            break
    }

})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
