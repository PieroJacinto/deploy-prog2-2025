const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware')
const userController = require('../controllers/UserController');
const validations = require('../middlewares/validations')

router.get('/',userController.index);

router.get('/:id', userController.show);

module.exports = router;