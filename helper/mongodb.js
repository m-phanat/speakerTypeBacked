const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')
const Schema = mongoose.Schema

module.exports = {
  count,
  find,
  findOne,
  updateOne,
  updateMany,
  findAggregate,
  deleteOne,
  softDelete
}

let speakerType = Schema({
  id: { type: 'String', default: '' },
  username: { type: 'String', default: '' },
  imageUrl: { type: 'String', default: '' },
  url: { type: 'String', default: '' },
  channel: { type: 'String', default: '' },
  displayName: { type: 'String', default: '' },
  speakerType: { type: 'String', default: '' },
  companyName: { type: 'String', default: '' },
  createdate: { type: 'String', default: '' },
  updatetime: { type: 'String', default: '' },
  specialType: []
})

function init(schema) {
  var inputMap = {
    speakerType: speakerType
  }
  var defaultSchema = null
  return inputMap[schema] || defaultSchema
}

speakerType.plugin(mongoose_delete, { overrideMethods: true, deletedAt: true })

async function count(collection, schema, obj = {}) {
  schema = await init(schema)
  let model = await mongoose.model(collection, schema, collection)
  let cursor = await model.countDocuments(obj)
  cursor = JSON.stringify(cursor)
  cursor = JSON.parse(cursor)
  return cursor
}

async function find(collection, schema, obj = {}, sort = {}, skip = 0, limit = null) {
  schema = await init(schema)
  let model = await mongoose.model(collection, schema, collection)
  let cursor = await model.find(obj).sort(sort).skip(skip).limit(limit)
  cursor = JSON.stringify(cursor)
  cursor = JSON.parse(cursor)
  return cursor
}

async function findOne(collection, schema, obj = {}, sort = {}) {
  schema = await init(schema)
  let model = await mongoose.model(collection, schema, collection)
  let cursor = await model.findOne(obj).sort(sort)
  cursor = JSON.stringify(cursor)
  cursor = JSON.parse(cursor)
  return cursor
}

async function updateOne(collection, schema, index = {}, value = {}, options = {}) {
  schema = await init(schema)
  let model = await mongoose.model(collection, schema, collection)
  let cursor = await model.updateOne(index, value, options)
  cursor = JSON.stringify(cursor)
  cursor = JSON.parse(cursor)
  return await cursor
}

async function findAggregate(collection, schema, arr = []) {
  schema = await init(schema)
  let model = await mongoose.model(collection, schema, collection)
  let cursor = await model.aggregate(arr)
  cursor = JSON.stringify(cursor)
  cursor = JSON.parse(cursor)
  return await cursor
}

async function softDelete(collection, schema, id) {
  schema = await init(schema)
  let model = await mongoose.model(collection, schema, collection)
  let _id = await mongoose.Types.ObjectId(id)
  let cursor = await model.deleteById(_id)
  cursor = JSON.stringify(cursor)
  cursor = JSON.parse(cursor)
  return cursor
}

async function deleteOne(collection, schema, id) {
  schema = await init(schema)
  let model = await mongoose.model(collection, schema, collection)
  let _id = await mongoose.Types.ObjectId(id)
  let cursor = await model.deleteOne({ _id: _id })
  cursor = JSON.stringify(cursor)
  cursor = JSON.parse(cursor)
  return cursor
}

async function updateMany(collection, schema, value = []) {
  schema = await init(schema)
  let model = await mongoose.model(collection, schema, collection)
  let cursor = await model.insertMany(value)
  cursor = JSON.stringify(cursor)
  cursor = JSON.parse(cursor)
  return await cursor
}
