import { getConfig, getApiList, setConfig, removeConfig, transferData, endData } from '../tool'
const { Router } = require('express')
const router = Router()

// 查询所有的项目
router.get('/all-api', async function (req, res, next) {
  let config = await getConfig()
  const requests = await config.projectList.map(function (item) {
    const path = `http://${item.hostname}:${item.port}${item.path}`
    return getApiList(path);
  });
  
  Promise.all(requests).then(function (posts) {
    // 组装好数据返回给前端,筛选成功响应的swagger
    const successRes = posts.filter(item => item.status === 200)
    const failRes = posts.filter(item => item.status !== 200)
    const data = successRes.map(item => {
      const apiObj = item.data
      return transferData(apiObj)
    })
    // 招到错误的，提示前端删除
    if(failRes.length) {
      // 组装报错信息
      let str = failRes.join(';')
      res.json(endData(200, str, data))
      return
    }
    res.json(endData(200,'ok', data))
  }).catch(function(err){
    res.json(endData(500,err.message || err))
  });
})

// 查询所有配置
router.get('/all-config', async function (req, res, next) {
  const config = await getConfig()
  res.json(endData(200, 'ok', config.projectList ))
})

// 添加配置
router.post('/add-config', async function (req, res, next) {
  try{
    const addConfig = req.body
    const initConfig = await getConfig()
    await setConfig(initConfig,addConfig)
    res.json(endData(200, 'ok'))
  }catch(err) {
    res.json(endData(500, err))
  }
})

// 删除配置
router.post('/remove-config', async function (req, res, next) {
  try{
    const addConfig = req.body
    const initConfig = await getConfig()
    await removeConfig(initConfig,addConfig)
    res.json(endData(200, 'ok'))
  }catch(err) {
    res.json(endData(500, err))
  }
})

module.exports = router