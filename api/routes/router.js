const router = require('express').Router();

const controller = require('../controllers/controller');

router.get('/v1/answer', controller.getAnswer);

router.post('/v1/produce', controller.registerProduce);

router.get('/v1/RAQ', controller.getRAQs);

module.exports = router;