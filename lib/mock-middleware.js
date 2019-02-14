/**
 * =================================
 * @2018 塞伯坦CYBMOCK前端数据模拟服务器
 * https://github.com/jd-cyb/cybmock
 * =================================
 */

const CybmockConfig = require('./mock.config')

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
  const cybmockConfig = CybmockConfig
  let mockRoutes = []

  Object.keys(cybmockConfig).forEach(key => {
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
  })

  return mockRoutes
}

module.exports = mockMiddle()
