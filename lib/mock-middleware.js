/**
 * =================================
 * @2018 塞伯坦CYBMOCK前端数据模拟服务器
 * https://github.com/jd-cyb/cybmock
 * =================================
 */


const path = require('path')
const fs = require('fs')

// 用于兼容全局和本地安装的babel-preset-env
let babelPresetEnvPath = path.join(__dirname, '../node_modules/@babel/preset-env')
if (!fs.existsSync(babelPresetEnvPath)) {
  babelPresetEnvPath = '@babel/preset-env'
}
require('@babel/register')({
  babelrc: false,
  presets: [babelPresetEnvPath]
})

const mockRouterFile = path.join(process.cwd(), 'cybmock.config.js')

function getConfig() {
  if (fs.existsSync(mockRouterFile)) {
    return require(mockRouterFile).default || require(mockRouterFile)
  } else {
    return {}
  }
}

function parseKey(key) {
  let method = 'get'
  let path = key

  if (key.indexOf(' ') > -1) {
    const splited = key.split(' ')
    method = splited[0].toLowerCase()
    path = splited[1]
  }

  return { method, path }
}

function mockHandler(method, path, value) {
  return function mockHandler(...args) {
    const res = args[1]
    if (typeof value === 'function') {
      value(...args)
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.write(JSON.stringify(value))
      res.end()
    }
  }
}

let mockMiddleware = []

function mockMiddle(devServer) {
  const config = getConfig()

  Object.keys(config).forEach(key => {
    const keyParsed = parseKey(key)
    if (typeof config[key] === 'string') {

      mockMiddleware.push({
        route: keyParsed.path,
        method: keyParsed.method,
        handle: function(req, res, next) {
          res.writeHeader(200, { 'Content-Type': 'text/html' })
          res.write(config[key])
          res.end()
        }
      })
    } else {
      mockMiddleware.push({
        route: keyParsed.path,
        method: keyParsed.method,
        handle: mockHandler(keyParsed.method, keyParsed.path, config[key])
      })
    }
  })
  return mockMiddleware
}

module.exports = mockMiddle
