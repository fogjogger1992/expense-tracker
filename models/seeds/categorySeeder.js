const Category = require('../Category')
const categoryList = require('./categories.json')

// mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.once('open', () => {
  console.log('mongodb connected')
  const promise = []

  for (let i = 0; i < categoryList.length; i++) {
    promise.push(
      Category.create({
        category: categoryList[i].category,
        categoryIcon: categoryList[i].categoryIcon
      })
    )
  }

  Promise.all(promise).then(() => {
    console.log('catgorySeeder done')
    db.close()
  })
})