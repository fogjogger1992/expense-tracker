const Category = require('../Category')
const categoryList = require('./categories.json')

// mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.once('open', () => {
  console.log('mongodb connected')

  for (let i = 0; i < categoryList.length; i++) {
    Category.create({
      category: categoryList[i].category,
      categoryIcon: categoryList[i].categoryIcon
    })
  }

  console.log('categorySeeder done')
})