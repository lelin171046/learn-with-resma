const router = require('express').Router();
const { globalSearch } = require('../controllers/search.controller');

router.get('/', globalSearch);

module.exports = router;
