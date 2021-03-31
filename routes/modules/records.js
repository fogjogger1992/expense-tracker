const express = require('express')
const router = express.Router()
const Record = require('../../models/Record')
const Category = require('../../models/Category')

// create
router.get('/new', (req, res) => {
  Category.find()
    .lean()
    .then(categories => {
      res.render('new', { categories })
    })
    .catch(error => console.error(error))
})

router.post('/', (req, res) => {
  const { name, date, Category, amount } = req.body
  let [category, categoryIcon] = Category.split('/')

  if (Object.values(req.body).indexOf('') === -1) {
    return Record.create({
      name: name,
      date: date,
      category: category,
      categoryIcon: categoryIcon,
      amount: amount
    })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  } else {
    res.render('new', { name, date, category, amount })
  }
})

// update
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, date, Category, amount } = req.body
  let [category, categoryIcon] = Category.split('/')

  return Record.findById(id)
    .then(record => {
      record.name = name,
        record.date = date,
        record.category = category,
        record.categoryIcon = categoryIcon,
        record.amount = amount
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router