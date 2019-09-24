import axios from 'axios'
const fs = require('fs')
const path = require('path')

// 获取配置
export function getConfig() {
  return new Promise(function(resolve, reject) {
    const configPath = path.join(__dirname, 'config.json')
    // 读取配置
    const stream = fs.createReadStream(configPath, {encoding: 'utf-8'})
    let content = ''
    stream.on('data', (chunk)=>{
      content+=chunk
    })
    stream.on('end',()=>{
      content = JSON.parse(content)
      resolve(content)
    })
  })
}

// 写入配置
export function setConfig(initConfig,addConfig) {
  return new Promise(function(resolve, reject) {
    // 查看是否有重复
    let duplicate = false
    initConfig.projectList.forEach(item => {
      if(item.hostname == addConfig.hostname && item.port == addConfig.port) {
        duplicate = true
      }
    })
    if(duplicate) {
      reject('配置重复')
      return
    }
    initConfig.projectList.push(addConfig)
    // resolve()
    const configPath = path.join(__dirname, 'config.json')
    // 创建一个写入流
    const stream = fs.createWriteStream(configPath, {encoding: 'utf-8'})

    stream.on('finish',() => {
      console.info('写入成功')
      resolve()
    })
    // 写入配置
    stream.write(JSON.stringify(initConfig))
  })
}

// 删除配置
export function removeConfig(initConfig,addConfig) {
  return new Promise(function(resolve, reject) {
    // 查看是否有这个配置
    let exist = false
    let idx = 0
    initConfig.projectList.forEach((item,index) => {
      if(item.hostname == addConfig.hostname && item.port == addConfig.port) {
        exist = true
        idx = index
      }
    })
    if(!exist) {
      reject('没有这个配置')
      return
    }
    initConfig.projectList.splice(idx,1)
    const configPath = path.join(__dirname, 'config.json')
    // 在这里直接返回成功，只要数据结构，验证通过没问题，就不管后面的操作的
    // resolve()
    // 创建一个写入流
    const stream = fs.createWriteStream(configPath, {encoding: 'utf-8'})

    stream.on('finish',() => {
      console.info('删除成功')
      resolve()
    })
    // 写入配置
    stream.write(JSON.stringify(initConfig))
  })
}

// 获取apilist
export function getApiList(path) {
  console.info('发起请求：' + path)
  // 这里做个操作，不管请求成功与否，都传过去
  return new Promise(function(resolve, reject) {
    axios.get(path).then((data) => {
      resolve(data)
    }).catch(() => {
      resolve(path)
    })
  })
}

// 转换友好的数据给前端
export function transferData(apiObj) {
  // 组装的apis在这里
  apiObj.apis = []
  // 先处理tags
  let tags = []
  const paths = apiObj.paths
  // 所有的api
  const pathArr = Object.keys(paths)
  pathArr.forEach(key => {
    let obj = {}
    const method = paths[key].post ? 'POST' : 'GET'
    const tagArr = method === 'POST' ? paths[key].post.tags : paths[key].get.tags
    
    // tag去重
    tags.push(...tagArr)
    apiObj.tags = [...new Set(tags)]

    // 组装api项
    obj.path = key
    obj.method = method
    const middleVar = method === 'POST' ? paths[key].post : paths[key].get
    Object.assign(obj, middleVar)
    apiObj.apis.push(obj)
  })
  // 我只需要这么多的属性
  const result =  (({info,host,basePath,tags,apis,definitions}) => ({info,host,basePath,tags,apis,definitions}))(apiObj)
  return result;
}

// 组装返回数据
export function endData(code, msg, data = '') {
  const obj = {
    code,
    data,
    msg,
  }
  return obj
}