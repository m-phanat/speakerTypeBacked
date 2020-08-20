const mongoose = require('mongoose')

module.exports = function () {
  const connectionStringURI = `mongodb://${process.env.IP_MONGODB}:27017/${process.env.DB_MONGODB}`
  console.log(connectionStringURI)

  mongoose.connect(connectionStringURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
}
