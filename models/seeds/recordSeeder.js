const Record = require('../Record')
const recordList = require('./records.json')

// mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.once('open', () => {
  console.log('mongodb connected')

  for (let i = 0; i < recordList.length; i++) {
    Record.create({
      name: recordList[i].name,
      category: recordList[i].category,
      categoryIcon: recordList[i].categoryIcon,
      date: recordList[i].date,
      amount: recordList[i].amount
    })
  }

  console.log('recordSeeder done')
})