<p align="center">
  <a href="http://cyb.hestudy.com" target="_blank">
    <img width="300" src="./cybmock.png">
  </a>
  <br>
  <br>
  <a href="https://www.npmjs.com/package/cybmock">
  <img src="https://img.shields.io/npm/v/cybmock.svg" alt="npm-version"></a>
  <br>
  <br>
  <img src="https://img.shields.io/npm/dm/cybmock.svg" alt="download-num">
  <img src="https://img.shields.io/npm/l/cybmock.svg" alt="license">
  <img src="https://img.shields.io/badge/platform-MacOS%7CLinux%7CWindows-lightgrey.svg" alt="platform">
  <br>
</p>

<h1 align="center">塞伯坦（CYBMOCK）前端数据模拟服务器</h1>
帮助WEB开发者快速生成模拟数据，支持在本地或远程快速构建真实的服务器环境，模拟服务器返回的各种场景的请求数据。支持同时启动多个MOCK服务，极大提高开发和测试效率。

<h2 align="center">安装和使用</h2>

- Mac系统推荐使用 [iterm2](http://iterm2.com/) 及 [oh my zsh](http://ohmyz.sh/)。
- 类 Unix 系统，请打开任意终端输入命令执行。
- Windows 用户请先安装 [git](http://git-scm.com/)，然后在 [Git Bash](http://git-for-windows.github.io/) 下执行命令。

### 安装

**1. 安装 Node 和 NPM**

- 官网下载安装Node: [https://nodejs.org](https://nodejs.org)。
- 建议使用最新稳定版(LTS)。
- Ubuntu 用户使用 `apt-get` 安装 node 后，安装的程序名叫 `nodejs`，需要软链成 `node`。
- Windows 用户安装完成后需要在 CMD 下确认是否能执行 node 和 npm。

> 设置 `npm config set loglevel=http` 可以查看npm包的下载和安装进度。

**2. 全局安装 CYBMOCK**

使用npm安装

```bash
npm install -g cybmock
```

使用yarn安装

```
yarn global add cybmock
```

> 某些window系统若不能正常安装CYB，请使用管理员身份先安装[windows-build-tools](https://github.com/felixrieseberg/windows-build-tools)。

### 使用

**1. 进入MOCK数据存放目录**

```bash
# 新建目录
mkdir cybmock-demo

# 或者进入已有项目目录
cd project

```

**2. 运行MOCK服务**

进入MOCK数据或已有项目目录 执行

```bash
cybmock start
```

在命令执行目录会自动生成`cybmock.config.js`配置文件及mock示例。

```
.
└── cybmock.config.js
```

```
//cybmock.config.js 示例
const proxy = {
  'GET /api/demoGet': {
    tips: '用于演示GET请求',
    name: '塞伯坦前端模块化工程构建工具',
    github: 'https://github.com/jd-cyb/cyb-cli'
  },
  'POST /api/demoPost': {
    tips: '用于演示POST请求',
    name: '塞伯坦前端数据模拟服务器',
    github: 'https://github.com/jd-cyb/cybmock'
  }
}

module.exports = proxy

```

为了便于复杂项目MOCK数据的管理，请在与`cybmock.config.js`同级新建`mock`目录，用于存放更多的MOCK数据模块，并支持使用ES6 Module或CommonJS的模块化管理MOCK数据。

```
.
├── cybmock.config.js
├── mock
│   ├── chart.js
│   ├── notices.js
│   ├── profile.js
│   └── rule.js
├── node_modules
│   └── mockjs
└── package.json


//cybmock.config.js

import chart from './mock/chart'
import notices from './mock/notices'
import profile from './mock/profile'
import rule from './mock/rule'

const proxy = {
    'GET /api/demoGet': chart,
    'POST /api/demoArray': notices,
    'GET /api/tags': profile,
    'POST /api/login': rule
}
module.exports = proxy
```

> CYBMOCK 同时会自动打开默认浏览器进入MOCK数据服务环境，并罗列出项目中的所有 MOCK接口，`cybmock.config.js`及`mock`目录中任意文件的更改都会自动更新接口，请尽情享用CYBMOCK为你带来高效、愉悦的MOCK服务体验！


<img width="100%" src="./cybmock-demo.png">

<h2 align="center">升级</h2>

- **使用npm升级**

```
npm update -g cybmock
```

- **使用yarn升级**

```
yarn global upgrade cybmock
```

<h2 align="center">License</h2>

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018, [塞伯坦前端小组](https://github.com/jd-cyb)


