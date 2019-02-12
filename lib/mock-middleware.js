/**
 * =================================
 * @2018 塞伯坦CYBMOCK前端数据模拟服务器
 * https://github.com/jd-cyb/cybmock
 * =================================
 */

const path = require('path')
const fs = require('fs')

// 用于兼容全局和本地安装的preset-env
let babelPresetEnvPath = path.join(__dirname, '../node_modules/@babel/preset-env')
if (!fs.existsSync(babelPresetEnvPath)) {
  babelPresetEnvPath = '@babel/preset-env'
}
require('@babel/register')({
  babelrc: false,
  presets: [babelPresetEnvPath]
})

const cybmockConfigFile = path.join(process.cwd(), 'cybmock.config.js')

function getCybmockConfig() {
  if (fs.existsSync(cybmockConfigFile)) {
    return require(cybmockConfigFile).default || require(cybmockConfigFile)
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

  return {
    method,
    path
  }
}

function mockHandler(method, path, value) {
  return function mockHandler(...args) {
    const res = args[1]
    if (typeof value === 'function') {
      value(...args)
    } else {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      })
      res.write(JSON.stringify(value))
      res.end()
    }
  }
}

function mockMiddle(devServer) {

  let mockRoutes = []
  let mockServerConfig = {
    port: 3000
  }

  const cybmockConfig = getCybmockConfig()

  Object.keys(cybmockConfig).forEach(key => {
    if (key === 'config') {
      Object.assign(mockServerConfig, cybmockConfig[key])
    } else {
      const keyParsed = parseKey(key)
      if (typeof cybmockConfig[key] === 'string') {

        mockRoutes.push({
          route: keyParsed.path,
          method: keyParsed.method,
          handle: function (req, res, next) {
            res.writeHeader(200, {
              'Content-Type': 'text/html'
            })
            res.write(cybmockConfig[key])
            res.end()
          }
        })
      } else {
        mockRoutes.push({
          route: keyParsed.path,
          method: keyParsed.method,
          handle: mockHandler(keyParsed.method, keyParsed.path, cybmockConfig[key])
        })
      }
    }

  })
  return {
    routes: mockRoutes,
    config: mockServerConfig
  }
}

const mockServer = mockMiddle()

module.exports = {
  routes: mockServer.routes,
  config: mockServer.config
}
