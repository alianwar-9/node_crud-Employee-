// imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const url = 'mongodb://localhost:27017/node_crud'

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(url, {
	autoIndex: false,
	family: 4
})
	
mongoose.connection.on('connected', () => {
	console.log(`Connected to MongoDB`)
});

mongoose.connection.on('error', error => {
	console.error(error)
	process.exit(0);
});

// database connection
// mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
// const db = mongoose.connection;
// db.on('error', (error) => console.log(error));
// db.once('open', () => console.log("Connected to Mongodb"))

// middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(
    session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static('uploads'));

// set template engine
app.set('view engine', 'ejs');

// route prefix
app.use('', require('./routes/routes'))

app.listen(5000, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});