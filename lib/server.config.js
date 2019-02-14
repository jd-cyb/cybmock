const path = require('path')
const fs = require('fs')
const merge = require('lodash/merge')

// 用于兼容全局和本地安装的preset-env
let babelPresetEnvPath = path.join(__dirname, '../node_modules/@babel/preset-env')
if (!fs.existsSync(babelPresetEnvPath)) {
  babelPresetEnvPath = '@babel/preset-env'
}
require('@babel/register')({
  babelrc: false,
  presets: [babelPresetEnvPath]
})

const configFile = path.join(process.cwd(), 'cybmock.server.config.js')

function getConfig() {
  if (fs.existsSync(configFile)) {
    return require(configFile).default || require(configFile)
  } else {
    return {}
  }
}

const defaultConfig = {
  port: 3000,
  cookie: {
    secret: 'cybmock',
    options: {}
  },
  session: {
    secret: 'cybmock', // 对session id相关的cookie进行签名
    resave: false, //是否每次都重新保存会话，建议false
    saveUninitialized: true // 是否自动保存未初始化的会话，建议false
    // cookie: {
    //   maxAge: 10 * 1000 // 有效期，单位是毫秒
    // }
  },
  browserSync: {}
}

module.exports = merge({}, defaultConfig, getConfig())
