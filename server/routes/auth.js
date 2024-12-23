const express = require('express');
const controller = require('../controllers/auth.controller');

const router = express.Router(); //create module router here

router.post('/signin', controller.signin) // just pass - not call
router.post('/signup', controller.signup) // just pass - not call
router.get('/check', controller.validateToken) // just pass - not call

module.exports = router; 