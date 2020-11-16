const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/loggers')
const mongoose = require('mongoose')

logger.info('connecting to ', config.DB_CONNECTION)

mongoose.connect(config.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        logger.info('Successful connection')
    })
    .catch((e) => {
        logger.error('Error: ', e.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', router)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app