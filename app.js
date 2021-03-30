const PORT = 3000

// express
const express = require('express')
const app = express()

// route
app.get('/', (req, res) => {
  res.send('expense tracker')
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})