const Category = require('../Category')
const categoryList = require('./categories.json')
const db = require('../../config/mongoose')

db.once('open', () => {
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