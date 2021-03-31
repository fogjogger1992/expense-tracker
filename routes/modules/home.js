const express = require('express')
const router = express.Router()
const dateFormat = require("dateformat")
const Record = require('../../models/Record')

const catNames = []

router.get('/', (req, res) => {
  let totalAmount = 0

  Record.find()
    .lean()
    .then(categories => {
      categories.forEach(item => {
        if (catNames.indexOf(item.category) === -1) {
          catNames.push(item.category)
        }
      })
    })

  Record.find()
    .lean()
    .then(records => {
      records.forEach(item => {
        const formatDate = dateFormat(item.date, "mmmm dS, yyyy")
        item.date = formatDate
        totalAmount += item.amount
      })
      res.render('index', { records, totalAmount, catNames })
    })
    .catch(error => console.error(error))
})

module.exports = router