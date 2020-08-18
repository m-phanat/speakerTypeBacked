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
  console.log(req.body)
  let query = { channel: req.body.channel }
  let json = await mongodb.find(collection, 'speakerType', query, {}, skip, limit)
  res.json(json)
})

router.post('/getCount', async (req, res) => {
  // console.log('/getCount')
  let query = {}
  if (req?.body?.channel) {
    query = { channel: req.body.channel }
  }
  let json = await mongodb.count(collection, 'speakerType', query, {}, 0, 10)
  let model = { totalData: json }
  res.json(model)
})

router.post('/add', async (req, res) => {
  // console.log('body ', req.body)
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
    // console.log('not have id')
    model.createdate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
  } else {
    // console.log('have id', obj._id)
    select = { _id: obj._id }
  }

  let json = await mongodb.updateOne(
    collection,
    'speakerType',
    select,
    { $set: model },
    { upsert: true }
  )
  res.json(json)
})

router.post('/remove', async (req, res) => {
  console.log(req.body)
  let json = await mongodb.deleteOne(collection, 'speakerType', req.body.id)
  res.json(json)
})

router.get('/random', async (req, res) => {
  let channel = ['facebook', 'twitter', 'youtube', 'instragram']

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
  // console.log(model)

  let data = { $set: model }
  let isInsert = { upsert: true }
  let query = { username: faker.name.firstName() }
  let json = await mongodb.updateOne(collection, 'speakerType', query, data, isInsert)
  res.json(json)
})

router.post('/check', async (req, res) => {
  let query = { username: req.body.username, companyName: req.body.companyName }
  // console.log(req.body)
  let json = await mongodb.findOne(collection, 'speakerType', query, {})
  if (json) {
  }
  let model = {
    result: json
  }
  res.json(model)
})

module.exports = router
