const router = require('express').Router()
let mongodb = require('..//helper/mongodb')
const moment = require('moment')
const faker = require('faker')

router.get('/', (req, res) => {
  res.send('<h1>test</h1>')
})

let collection = 'speaker-type'

router.get('/getList', async (req, res) => {
  let json = await mongodb.find(collection, 'speakerType', {}, {}, 0, 10)
  res.json(json)
})

router.post('/getListFromChannel', async (req, res) => {
  let skip = req?.body?.skip || 0
  let limit = req?.body?.limit || 10
  console.log(req.body)
  let query = { channel: req.body.channel }
  let json = await mongodb.find(collection, 'speakerType', query, {}, skip, limit)
  res.json(json)
})

router.post('/getCount', async (req, res) => {
  console.log('/getCount')
  let query = {}
  if (req?.body?.channel) {
    query = { channel: req.body.channel }
  }
  let json = await mongodb.count(collection, 'speakerType', query, {}, 0, 10)
  let model = { totalData: json }
  res.json(model)
})

router.post('/add', async (req, res) => {
  console.log('body ', req.body)
  let obj = req.body

  let model = {
    id: obj.id,
    username: obj.username,
    channel: obj.channel,
    displayName: obj.displayName,
    speakerType: obj.speakerType,
    companyName: obj.companyName,
    specialType: obj.specialType || [],
    updatetime: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
  }

  let select = { username: obj.username }
  console.log(obj?._id)
  if (!obj?._id) {
    console.log('not have id')
    model.createdate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
  } else {
    console.log('have id', obj._id)
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
    displayName: faker.name.findName(),
    speakerType: faker.address.country(),
    companyName: faker.company.companyName(),
    specialType: [],
    updatetime: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
    createdate: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
  }
  console.log(model)
  let json = await mongodb.updateOne(
    collection,
    'speakerType',
    { username: faker.name.firstName() },
    {
      $set: model
    },
    { upsert: true }
  )
  res.json(json)
})

module.exports = router
