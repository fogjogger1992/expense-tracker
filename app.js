// express
const express = require('express')
const app = express()
// mongoose
const mongoose = require('mongoose')

const PORT = 3000

// connection
mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
})

// route
app.get('/', (req, res) => {
  res.send('expense tracker')
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})