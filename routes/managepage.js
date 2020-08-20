const router = require('express').Router()
let mongodb = require('..//helper/mongodb')
const mongoose = require('mongoose')
const moment = require('moment')
const axios = require('axios')

let collection = 'manage-page'
let schema = 'page'

router.get('/', async (req, res) => {
  let json = await mongodb.find(collection, schema, {}, { _id: -1 }, 0, 100).catch((err) => {
    res.send('Could not find data in MongoDb...')
  })
  res.json(json)
})

router.post('/add', async (req, res) => {
  let obj = req.body

  let model = {
    id: obj?.id,
    name: obj?.name,
    priority: obj?.priority,
    limit: obj?.limit,
    updatetime: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
  }
  let select = { _id: new mongoose.Types.ObjectId() }
  if (!obj?._id) {
    model.createdate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
  } else {
    select = { _id: obj._id }
  }

  let data = { $set: model }
  let isInsert = { upsert: true }
  let json = await mongodb.updateOne(collection, schema, select, data, isInsert)
  res.json(json)
})

router.post('/remove', async (req, res) => {
  console.log(req.body)
  let json = await mongodb.softDelete(collection, schema, req.body.id)
  res.json(json)
})

router.post('/crawl-user', async (req, res) => {
  if (!req.body.url) {
    return res.send('no url')
  }
  let raw_url = req.body.url
  let page = ''
  if (raw_url.includes('facebook')) {
    raw_url = raw_url.split('.com/')
    page = raw_url[1].split('/')[0]
    console.log('crawl ', page)
    let url = `https://graph.facebook.com/v8.0/${page}?fields=id,name,picture,fan_count&access_token=314032576098038|HZOtbOFOll8pcYyZda7n4UD528M`
    let promise = axios.get(url).catch((e) => {
      res.send(e)
    })
    let result = await promise
    res.send(result.data)
  } else {
    res.json({
      status: false
    })
  }
  console.log(page)

  res.send(result.data)
})

module.exports = router
