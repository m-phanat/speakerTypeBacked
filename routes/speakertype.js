const router = require('express').Router()
let mongodb = require('..//helper/mongodb')
const moment = require('moment')
const faker = require('faker')

router.get('/', (req, res) => {
  res.send('<h1>speaker-type</h1>')
})

let collection = 'speaker-type'

router.get('/getList', async (req, res) => {
  let json = await mongodb.find(collection, 'speakerType', {}, {}, 0, 10)
  res.json(json)
})

router.post('/getListFromChannel', async (req, res) => {
  let skip = req.body?.skip || 0
  let limit = req.body?.limit || 10
  let query = { channel: req.body.channel }
  let json = await mongodb.find(collection, 'speakerType', query, {}, skip, limit)
  res.json(json)
})

router.post('/getCount', async (req, res) => {
  let query = {}
  if (req?.body?.channel) {
    query = { channel: req.body.channel }
  }
  let json = await mongodb.count(collection, 'speakerType', query, {}, 0, 10)
  let model = { totalData: json }
  res.json(model)
})

router.post('/add', async (req, res) => {
  let obj = req.body

  let model = {
    id: obj?.id,
    username: obj?.username,
    channel: obj?.channel,
    imageUrl: obj?.imageUrl,
    displayName: obj?.displayName,
    speakerType: obj?.speakerType,
    companyName: obj?.companyName,
    specialType: obj?.specialType || [],
    updatetime: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
  }

  let select = {}
  if (!obj?._id) {
    model.createdate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
  } else {
    select = { _id: obj._id }
  }

  let data = { $set: model }
  let isInsert = { upsert: true }
  let json = await mongodb.updateOne(collection, 'speakerType', select, data, isInsert)
  res.json(json)
})

router.post('/remove', async (req, res) => {
  console.log(req.body)
  let json = await mongodb.deleteOne(collection, 'speakerType', req.body.id)
  res.json(json)
})

router.post('/check', async (req, res) => {
  let query = { username: req.body.username, companyName: req.body.companyName }
  let json = await mongodb.findOne(collection, 'speakerType', query, {})

  if (json) {
    let model = { result: json }
    res.json(model)
  }
  res.json({})
})

/**
 *  RANDOM DATA
 */

router.get('/random', async (req, res) => {
  let channel = ['facebook', 'twitter', 'youtube', 'instragram']

  for (i = 0; i < 10; i++) {
    let model = {
      id: faker.random.number(),
      username: faker.name.firstName(),
      channel: channel[faker.random.number() % 4],
      url: faker.internet.url(),
      displayName: faker.name.findName(),
      speakerType: faker.address.country(),
      companyName: faker.company.companyName(),
      imageUrl: faker.image.avatar(),
      specialType: [],
      updatetime: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
      createdate: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
    }

    let data = { $set: model }
    let isInsert = { upsert: true }
    let query = { username: faker.name.firstName() }
    await mongodb.updateOne(collection, 'speakerType', query, data, isInsert)
  }
  res.status(200)
  res.send('ok')
})

module.exports = router
