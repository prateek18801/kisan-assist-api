const router = require('express').Router();

const controller = require('../controllers/controller');

router.get('/answer', controller.getAnswer);

module.exports = router;