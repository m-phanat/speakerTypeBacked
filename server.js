const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

app.use(cors())
app.use(bodyParser.json({ limit: '500mb' }))
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }))

var port = process.env.PORT || 3000
const connectionStringURI = `mongodb://${process.env.IP_MONGODB}:27017/${process.env.DB_MONGODB}`
console.log(connectionStringURI)

mongoose.connect(connectionStringURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

app.listen(port, function () {
  console.log('listening on ' + port)
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const speakerType = require('./routes/speakertype')
app.use('/speakertype', speakerType)
