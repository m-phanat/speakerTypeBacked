const bodyParser = require('body-parser')
const speakerType = require('../routes/speakertype')
const managePage = require('../routes/managepage')

module.exports = function (app) {
  app.use(bodyParser.json({ limit: '500mb' }))
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }))

  app.use('/speakertype', speakerType)
  app.use('/page', managePage)
}
