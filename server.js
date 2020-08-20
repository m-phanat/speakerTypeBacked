const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()
app.use(cors())
require('./startup/routes')(app)
require('./startup/db')()

var port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('listening on ' + port)
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
