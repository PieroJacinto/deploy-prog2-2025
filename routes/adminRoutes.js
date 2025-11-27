const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const adminController = require('../controllers/adminController');

router.use(authMiddleware); //router.use aplica el middleware a todas las rutas que la siguen
router.use(roleMiddleware(['admin']));

router.get('/dashboard', adminController.dashboard)

router.get('/usuarios', adminController.listarUsuarios)

router.put('/usuarios/:id/cambiar-rol', adminController.cambiarRol)

router.delete('/usuarios/:id', adminController.eliminarUsuario)

module.exports = router;