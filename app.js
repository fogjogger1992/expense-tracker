// express
const express = require('express')
const app = express()
// mongoose
const mongoose = require('mongoose')
// handlebars
const exphbs = require('express-handlebars')
// port
const PORT = 3000
// record
const Record = require('./models/Record')
// dateformat
const dateFormat = require("dateformat")

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

// route
// index
app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(records => {
      records.forEach(item => {
        const formatDate = dateFormat(item.date, "mmmm dS, yyyy")
        item.date = formatDate
      })
      res.render('index', { records })
    })
    .catch(error => console.error(error))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})