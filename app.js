var express = require("express");
var bodyParser = require('body-parser');
var app = express();
require('dotenv').config();
const port = process.env.PORT_NUMBER;
const session = require('express-session');
const flash = require('connect-flash');

function checkAuth(req, res, next) {
  if (!req.session.userTkn) {
    // res.send('You are not authorized to view this page');
    res.render('./pages/login',{
      authWarn:"Yönetici paneline erişmek için lütfen önce giriş yapınız!"
    })
  } else {
    next();
  }
}

app.use(session({
  secret: 'pratikTekno',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());
var con = require('./database');

const { beLoggedIn, frontendPage, getProducts, productAddPage, addProduct, productUpdatePage, updateProduct, deleteProduct, searchProduct, addNewAdmin, updateAdminPassword,clearSearchProduct } = require('./public/routes/mysqlQuery')


urlencodedParser = bodyParser.urlencoded({ extended: true })
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.get('/panel', getProducts);
app.get('/', frontendPage);
app.get('/edit/:id', productUpdatePage);
app.get('/login', (req, res) => {
  res.render("./pages/login");
});
app.get('/logout', function (req, res) {
  delete req.session.userTkn;
  res.redirect('/login');
});
app.get('/settings', checkAuth, (req, res) => {
  res.render('./pages/settings');
});
app.post('/addNewAdmin', addNewAdmin);
app.post('/updateAdminPassword', updateAdminPassword);
app.post('/login', beLoggedIn);
app.post('/edit/:id', updateProduct);
app.get('/add', productAddPage);
app.post('/add', addProduct);
app.post('/search', searchProduct);
app.post('/clear', clearSearchProduct);
app.post('/:id', deleteProduct);

con.connect(function (err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});

app.listen(port, function () { console.log(`PORT ${port} is running...`) })