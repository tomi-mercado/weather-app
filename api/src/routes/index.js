const { Router } = require('express');

// import all routers;
const cities = require('./cities');

const router = Router();

// load each router on a route
router.use('/cities', cities);

module.exports = router;