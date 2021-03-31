const Record = require('../Record')
const recordList = require('./records.json')

// mongoose
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/expense', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.once('open', () => {
  console.log('mongodb connected')
  const promise = []

  for (let i = 0; i < recordList.length; i++) {
    promise.push(
      Record.create({
        name: recordList[i].name,
        category: recordList[i].category,
        categoryIcon: recordList[i].categoryIcon,
        date: recordList[i].date,
        amount: recordList[i].amount
      })
    )
  }

  Promise.all(promise).then(() => {
    console.log('recordSeeder done')
    db.close()
  })
})