/**
 * =================================
 * @2018 塞伯坦CYBMOCK前端数据模拟服务器
 * https://github.com/jd-cyb/cybmock
 * =================================
 */

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const portscanner = require('portscanner')
const mockMiddleware = require('./lib/mock-middleware')
const fsExtra = require('fs-extra')
const path = require('path')
const cons = require('consolidate')
const internalIp = require('internal-ip')
const Handlebars = require('handlebars')

// 允许所有的请求形式
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// 添加json解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/static', express.static(path.join(__dirname, './public')))
app.set('views', path.join(__dirname, './views'))
app.engine('html', cons.handlebars)
app.set('view engine', 'html')

/**
 * [@index 从 1 开始]
 */
Handlebars.registerHelper("inc", function(value, options) {
  return parseInt(value) + 1;
})

const cacheFile = path.join(process.cwd(), './.cache')

let interface = [] //接口列表

mockMiddleware().filter(item => {
  app.all(item.route, item.handle)

  interface.push({
    method: item.method,
    route: item.route
  })
})

const serverIp = internalIp.v4.sync() || 'localhost' //服务器IP

let serverPort = 0

app.get('/', (req, res) => {
  res.render('index', { projectName: process.cwd().split(path.sep).pop(), interface: interface, serverIp: serverIp, serverPort: serverPort })
})


portscanner.findAPortNotInUse(3000, 3050, '127.0.0.1', function(error, port) {
  serverPort = port //服务器端口

  fsExtra.writeJson(cacheFile, { port: port }, err => {
    if (err) return console.error(err)
    app.listen(port, () => console.log(`Mock Server listening on port ${port}!`))
  })

})

process.on('SIGINT', () => {
  console.log("Gracefully shutting down from SIGINT (Ctrl-C)")
  process.exit()
})
