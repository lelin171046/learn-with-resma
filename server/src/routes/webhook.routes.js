const router = require('express').Router();
const { handleWebhook } = require('../controllers/webhook.controller');

router.post('/stripe', require('express').raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
