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
  res.send('<h1>manage-page</h1>')
})

router.post('/add', (req, res) => {
  res.send('<h1>manage-page</h1>')
})

module.exports = router
