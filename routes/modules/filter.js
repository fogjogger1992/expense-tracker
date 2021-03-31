const express = require('express')
const router = express.Router()
const dateFormat = require("dateformat")
const Record = require('../../models/Record')
const Category = require('../../models/Category')

const catNames = []

router.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(categories => {
      categories.forEach(item => {
        if (catNames.indexOf(item.category) === -1) {
          catNames.push(item.category)
        }
      })
    })

  const filter = req.query.selectedFilter
  const filteredAmounts = Record.aggregate([
    { $match: { category: filter } }, {
      $group: {
        _id: null,
        amount: { $sum: "$amount" },
      }
    }
  ]).exec()

  const filteredRecords = Record.aggregate([
    { $match: { category: filter } },
    {
      $project: {
        name: 1,
        category: 1,
        amount: 1,
        merchant: 1,
        date: 1,
        categoryIcon: 1,
      }
    }
  ]).exec()

  if (filter) {
    Promise.all([filteredAmounts, filteredRecords])
      .then(([filteredAmounts, records]) => {
        records.forEach(item => {
          const formatDate = dateFormat(item.date, "mmmm dS, yyyy")
          item.date = formatDate
        })
        const totalAmount = filteredAmounts[0].amount
        res.render('index', { totalAmount, records, filter, catNames })
      })
  } else {
    Promise.all([filteredAmounts, filteredRecords])
      .then(() => res.redirect('/'))
  }
})

module.exports = router