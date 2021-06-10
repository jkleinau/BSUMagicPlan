const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layouts');
app.use(expressLayout);
app.use(bodyparser.urlencoded({ limit: '10mb', extended: false }));
app.use(express.static('public'));
// Connecting to MongoDB database

mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost/BSUMagicPlan', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => {
	console.log('Connected to Mongoose');
	// console.log(process.env.DATABASE_URL)
});

app.use(function (req, res, next) {
	res.locals.page = req.path;
	next();
});

// Get Routes
const indexRouter = require('./routes/index');
const planRouter = require('./routes/plan');

app.use('/', indexRouter);
app.use('/plan', planRouter);

app.listen(process.env.PORT || 3000);
