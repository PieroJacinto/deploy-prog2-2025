const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController')
const guestMiddleware = require('../middlewares/guestMiddleware');
const upload = require("../middlewares/uploadMiddleware");
const validations = require("../middlewares/validations");
const authMiddleware = require('../middlewares/authMiddleware');

// rutas solo para invitados (no logueados)
router.get('/register', guestMiddleware, authController.registerForm );
router.post('/register', 
    guestMiddleware,
    upload.single("imagen_usuario"),
    validations.register,
    validations.handleErrors,
    authController.processRegister);

router.get('/login',authController.login );
router.post('/login',
    guestMiddleware,
    validations.login,
    validations.handleErrors,
    authController.processlogin);

// ruta para logout (para cualquiera)
router.post('/logout',
    authMiddleware,
    authController.logout );

module.exports = router;