const router = require('express').Router()
let mongodb = require('..//helper/mongodb')
let helper = require('..//helper/helper')
const mongoose = require('mongoose')
const moment = require('moment')
const fs = require('fs')
const XLSX = require('xlsx')
const sleep = require('util').promisify(setTimeout)
const faker = require('faker')

router.get('/', (req, res) => {
  res.send('<h1>speaker-type</h1>')
})

let collection = 'speaker-type'

router.get('/getList', async (req, res) => {
  let json = await mongodb.find(collection, 'speakerType', {}, { _id: -1 }, 0, 100).catch((err) => {
    res.send('Could not find data in MongoDb...')
  })
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
  let select = { _id: new mongoose.Types.ObjectId() }
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
  let json = await mongodb.softDelete(collection, 'speakerType', req.body.id)
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

  for (let i = 0; i < 10; i++) {
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

router.get('/export', async (req, res) => {
  let query = {}
  if (req?.query?.channel) {
    query = { channel: req?.query?.channel }
  }
  console.log(query)

  let json = await mongodb.find(collection, 'speakerType', query)
  // res.json(json)

  let header = {
    header: [
      'id',
      'username',
      'imageUrl',
      'url',
      'channel',
      'displayName',
      'speakerType',
      'companyName',
      'specialType',
      'createdate',
      'updatetime'
    ]
  }

  let filename = 'Raw_Data'
  let catetime = new Date()
  let pathname = __dirname + `/${filename}_${catetime.getTime()}.xlsx`
  let wb = XLSX.utils.book_new()
  let ws = XLSX.utils.json_to_sheet([{}], header)

  XLSX.utils.book_append_sheet(wb, ws, 'Speaker Type Raw Data')

  for (let i = 0; i < json.length; i++) {
    let temp = []
    let obj = json[i]
    temp[i] = {
      id: obj.id,
      username: obj.username,
      imageUrl: obj.imageUrl,
      url: obj.url,
      channel: obj.channel,
      displayName: obj.displayName,
      speakerType: obj.speakerType,
      companyName: obj.companyName,
      specialType: obj.specialType,
      createdate: obj.createdate,
      updatetime: obj.updatetime
    }
    if (i == 0) {
      const data = temp[0]
      var wscols = []
      Object.keys(temp[i]).forEach(function (key) {
        wscols.push({ wch: data[key].length + 10 })
      })
      ws['!cols'] = wscols
    }

    XLSX.utils.sheet_add_json(wb.Sheets['Speaker Type Raw Data'], temp, header)
    await sleep(1)
  }

  const wb_opts = { bookType: 'xlsx', type: 'binary' }
  XLSX.writeFile(wb, pathname, wb_opts)

  //File stream
  if (!res.headersSent) {
    if (typeof res.writeHead === 'function')
      res.writeHead(200, {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment;filename=' + `speaker-type-raw-data.xlsx`
      })
  }
  const stream = fs.createReadStream(pathname)
  stream.pipe(res)
  helper.delete_file(pathname)
})

var multer = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './')
  },
  filename: function (req, file, cb) {
    cb(null, 'import-data.xlsx')
  }
})
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .xlsx format allowed!'))
    }
  }
})

router.post('/upload', upload.single('file'), async (req, res) => {
  let pathname = './import-data.xlsx'
  let query = {}
  if (req?.body?.channel) {
    query = { channel: req.body.channel }
  }
  var wb = XLSX.readFile(pathname)
  let name_ws = wb.SheetNames[0]
  var worksheet = wb.Sheets[name_ws]
  var json = XLSX.utils.sheet_to_json(worksheet)

  json.forEach(async (it) => {
    let select = { channel: it.channel, displayName: it.displayName }
    let data = { $set: it }
    let isInsert = { upsert: true }
    await mongodb.updateOne(collection, 'speakerType', select, data, isInsert)
  })
  helper.delete_file(pathname)
  res.json({
    status: 'success'
  })
})

module.exports = router
