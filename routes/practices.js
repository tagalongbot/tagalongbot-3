let express = require('express');
let router = express.Router();

let handleRoute = require('../middlewares/handleRoute.js');
let cache = require('../middlewares/cache.js');

let getPractices = require('../routes/practices/practices.js');
let getPracticeServices = require('../routes/practices/services.js');
let getPracticePromos = require('../routes/practices/promos.js');
let claimPractice = require('../routes/practices/claim.js');
let practiceClaimed = require('../routes/practices/claimed.js');
let listPractice = require('../routes/practices/list.js');

router.get(
  '/search/:search_type',
  handleRoute(getPractices, '[Error] Searching Providers')
);

router.get(
  '/services',
  cache.withTtl('1 day'),
  handleRoute(getPracticeServices, '[Error] Viewing Provider Services')
);

router.get(
  '/promos',
  handleRoute(getPracticePromos, '[Error] Viewing Provider Promos')
);

router.use(
  '/claim',
  claimPractice,
);

router.get(
  '/claimed',
  handleRoute(practiceClaimed, '[Error] Checking Claimed Provider')
);

router.get(
  '/list',
  handleRoute(listPractice, '[Error] Listing Provider')
);

module.exports = router;