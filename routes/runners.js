let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let createRunner = require('../routes/runners/create.js');
let searchRunners = require('../routes/runners/search.js');
let requestRunners = require('../routes/runners/request.js');

router.get(
  '/create',
  // cache.withTtl('1 day'),
  handleRoute(createRunner, '[Error] User')
);

router.get(
  '/search',
  // cache.withTtl('1 day'),
  handleRoute(searchRunners, '[Error] User')
);

router.use(
  '/request',
  // cache.withTtl('1 day'),
  requestRunners
);

module.exports = router;