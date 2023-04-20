const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AlbumModelSchema = new Schema({
  _id: Number,
  title: String,
  artist: String,
  year: Number,
})

module.exports = mongoose.model('Albums', AlbumModelSchema)