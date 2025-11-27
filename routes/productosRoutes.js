const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const productoController = require('../controllers/ProductoController');
const validations = require('../middlewares/validations')

router.get('/', productoController.index);

router.get('/create', productoController.create )

router.post('/create', 
    upload.array('imagenes_producto', 5),
    validations.producto,
    validations.handleErrors,
    productoController.store )

router.get('/edit/:id/', productoController.edit)

router.put('/edit/:id',
    upload.array('imagenes_producto', 5),
    validations.productoUpdate,
    validations.handleErrors,
    productoController.update)

router.delete('/:id', productoController.destroy)

router.get('/show/:id/', productoController.show )

module.exports = router;

