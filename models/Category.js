const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  category: {
    type: String
  },
  categoryIcon: {
    type: String
  }
})

module.exports = mongoose.model('Category', categorySchema)