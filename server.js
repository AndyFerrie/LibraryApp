if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const app = express()
  const expressLayouts = require('express-ejs-layouts')
  const bodyParser = require('body-parser')
  const methodOverride = require('method-override')
  const cors = require('cors')

  app.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src * 'self' 'unsafe-inline' https://mybrary79.herokuapp.com; font-src 'self'; img-src 'self' data: https://mybrary79.herokuapp.com; script-src 'self' 'unsafe-inline' https://mybrary79.herokuapp.com https://unpkg.com; style-src 'self' https://unpkg.com; frame-src 'self'"
    );
    next();
  });
  
  
  const indexRouter = require('./routes/index')
  const authorRouter = require('./routes/authors')
  const bookRouter = require('./routes/books')
  
  app.set('view engine', 'ejs')
  app.set('views', __dirname + '/views')
  app.set('layout', 'layouts/layout')
  app.use(expressLayouts)
  app.use(methodOverride('_method'))
  app.use(express.static('public'))
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
  app.use(cors())
  app.options('*', cors())
  
  const mongoose = require('mongoose')
  mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
  const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to Mongoose'))
  
  app.use('/', indexRouter)
  app.use('/authors', authorRouter)
  app.use('/books', bookRouter)
  
  app.listen(process.env.PORT || 3000)