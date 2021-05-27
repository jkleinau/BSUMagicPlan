const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const bodyparser = require('body-parser')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layouts')
app.use(expressLayout)
app.use(bodyparser.urlencoded({limit:'10mb', extended:false}))

// Get Routes
const indexRouter = require('./routes/index')

app.use('/', indexRouter)

app.listen(process.env.PORT || 3000)