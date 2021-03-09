const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pug = require('pug');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const _rentals = require('./data/rentals.json');

const MAPBOX_API = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/assets'));

app.get('/', (req, res) => {
  _rentals.data.forEach(r => {
    const { location: { lat, lng } } = r.attributes;
    const width = height = 150;
    const zoom = 9;

    let coordinates = `${lng},${lat},${zoom}`;
    let dimensions = `${width}x${height}`;
    let accessToken = `access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;

    r.mapbox = `${MAPBOX_API}/${coordinates}/${dimensions}@2x?${accessToken}`;
  });

  res.render('index', { rentals: _rentals.data });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/rentals/:id', (req, res) => {
  const { id } = req.params;
  const { data } = require(`./data/rentals/${id}.json`)

  const { location: { lat, lng } } = data.attributes;
  const width = 894;
  const height = 600;
  const zoom = 12;

  let coordinates = `${lng},${lat},${zoom}`;
  let dimensions = `${width}x${height}`;
  let accessToken = `access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;

  data.mapbox = `${MAPBOX_API}/${coordinates}/${dimensions}@2x?${accessToken}`;
  res.render('rentals', { data });
});

app.post('/search', (req, res) => {
  const { search } = req.body;

  const results = _rentals.data.filter(r => {
    const _search = search.toLowerCase();
    const _title = r.attributes.title.toLowerCase();
    return _title.includes(_search);
  });

  const template  = pug.compileFile('views/includes/rental-list.pug');
  const markup = template({ rentals: results });
  res.send(markup);
});

app.listen(PORT);

console.log('Listening on port : ' + PORT);
