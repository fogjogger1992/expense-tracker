// express
const express = require('express')
const app = express()
// mongoose
const mongoose = require('mongoose')
// handlebars
const exphbs = require('express-handlebars')
// dateformat
const dateFormat = require("dateformat")
// body-parser
const bodyParser = require('body-parser')
// method-override
const methodOverride = require('method-override')
// port
const PORT = 3000
// record
const Record = require('./models/Record')
const Category = require('./models/Category')
const { collection } = require('./models/Record')

// static files
app.use(express.static('public'))

// connection
mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
})

// view
app.engine('handlebars', exphbs({ defaultLayout: 'main', extname: '.handlebars' }))
app.set('view engine', 'handlebars')

// use body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// use methodOverride
app.use(methodOverride('_method'))

// route
const catNames = []
// index
app.get('/', (req, res) => {
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

// filter
app.get('/records/filter', (req, res) => {

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


// new
app.get('/records/new', (req, res) => {
  Category.find()
    .lean()
    .then(categories => {
      res.render('new', { categories })
    })
    .catch(error => console.error(error))
})

app.post('/records', (req, res) => {
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

// edit
app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => console.log(error))
})

app.put('/records/:id', (req, res) => {
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

// remove
app.delete('/records/:id/', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})