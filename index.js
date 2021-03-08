const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.listen(PORT);

console.log('Listening on port : ' + PORT);
