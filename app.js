const express = require('express')
const cors = require('cors')
const logger = require('morgan')

const catRoutes = require('./routers/CatRouter')
const userRoutes = require('./routers/UserRouter')

const app = express(); 

app.use(logger('dev'))
app.use(express.json())
app.use(cors())

app.use('/cats', catRoutes)
app.use('/users', userRoutes)

app.get('/', (req, res) => {
  res.send({
    message: "welcome",
    description: "animals API",
    endpoints: [
        "GET / 200",
        "GET /cats 200"
    ]
  })
})


module.exports = app