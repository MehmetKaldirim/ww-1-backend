const express = require('express');
const passport = require('passport');
const imgUploader = require('../middleware/imgUploader');
const controller = require('../controllers/record.controller');

const router = express.Router(); //create module router here

router.get('/', passport.authenticate('jwt', {session: false}), controller.getAll);
router.post('/', passport.authenticate('jwt', {session: false}), imgUploader.single('image'), controller.newRecord);
router.get('/:id', passport.authenticate('jwt', {session: false}), controller.getById);
router.put('/:id',imgUploader.single('image'), passport.authenticate('jwt', {session: false}), controller.updRecord);
router.delete('/:id', passport.authenticate('jwt', {session: false}), controller.deleteRecord);

module.exports = router; 