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


const configFile = path.join(process.cwd(), 'cybmock.config.js')

function getConfig() {
  if (fs.existsSync(configFile)) {
    return require(configFile).default || require(configFile)
  } else {
    return {}
  }
}

module.exports = getConfig()
