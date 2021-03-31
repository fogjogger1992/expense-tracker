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

// route
// index
app.get('/', (req, res) => {
  const catNames = []
  Category.find()
    .lean()
    .then(categories => {
      let totalAmount = 0
      categories.forEach(item => {
        catNames.push(item.category)
      })
    })

  Record.find()
    .lean()
    .then(records => {
      let totalAmount = 0
      records.forEach(item => {
        const formatDate = dateFormat(item.date, "mmmm dS, yyyy")
        item.date = formatDate
        totalAmount += item.amount
      })
      res.render('index', { records, totalAmount, catNames })
    })
    .catch(error => console.error(error))
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
  const { name, date, category, amount } = req.body

  const categoryIcon = Category.find()
    .lean()
    .then(categories => {
      categories.forEach(item => {
        if (item.category === category) {
          return item.categoryIcon
        }
      })
    })

  console.log(categoryIcon)


  if (Object.values(req.body).indexOf('') === -1) {
    return Record.create({
      name: name,
      date: date,
      category: category,
      categoryIcon: '',
      amount: amount
    })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  } else {
    res.render('new', { name, date, category, amount })
  }
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})