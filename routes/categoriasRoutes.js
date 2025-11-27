const express = require('express');
const router = express.Router();
const categoriaController = require("../controllers/CategoriaController")
const validations = require('../middlewares/validations')

router.get('/', categoriaController.index )

router.get('/create', categoriaController.create )

router.post('/create', 
    validations.categoria,
    validations.handleErrors,
    categoriaController.store )

router.get('/edit/:id/',categoriaController.edit)

router.put('/edit/:id',
    validations.categoria,
    validations.handleErrors,
    categoriaController.update)

router.delete('/:id', categoriaController.destroy)

module.exports = router; 