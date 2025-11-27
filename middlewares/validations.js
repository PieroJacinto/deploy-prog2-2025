const {body, validationResult } = require("express-validator");
const {Usuario, Producto , Categoria} = require('../database/models');
const fs = require('fs');
const path = require("path");

const validations = {

    register: [
        body('nombre')
            .notEmpty()
            .withMessage('El nombre es obligatorio')
            .isLength({ min:4 ,max: 100})
            .withMessage('El nombre debe tener entre 4 y 100 caracteres')
            .trim(),
        body('email')
            .notEmpty()
            .withMessage('El email es obligatorio')
            .isEmail()
            .withMessage('Debe ser un email valido')
            .normalizeEmail()// pasa a minusculas y lo normaliza
            .custom( async (email) => {
                const existeUsuario = await Usuario.findOne({ where: {email}});
                if(existeUsuario){
                    throw new Error("Este mail ya esta registrado")
                }
                return true;
            }),
        body("password")
            .notEmpty()
            .withMessage("la contraseña es obligatoria")
            .isLength({min: 6})
            .withMessage("LA CONTRASEÑA DEBE TENER UN MINIMO DE 6 CARACTERES")     ,       
        body("re-password")
            .notEmpty()
            .withMessage("Debes confirmar contraseña")
            .custom((value, {req})=>{
                if(req.body.password != value){
                    throw new Error("Las contraseñas no coinciden")
                }
                return true;
            }),
        body('imagen_usuario')
            .custom( (value, {req}) => {
                // el objeto request desestructurado, tiene la info del archivo subido
                // req.file,. multer guarda el archjivo alli
                if(!req.file) {
                    return true; //imagen opcional
                };

                // 
                const extensionesPermitidas = [ ".jpg", ".jpeg", ".png", ".gif"];
                const extension = path.extname(req.file.originalname).toLowerCase();

                if(!extensionesPermitidas.includes(extension)){
                    throw new Error(
                        `Las extensuiones permitidas son: ${extensionesPermitidas.join(', ')}`
                    )
                }
                    const maxSize = 5 * 1024 * 1024; // 5mb
                    if( req.file.size > maxSize){
                        throw new Error(
                            `El tamaño maximo de la imagen es de 5mb`)
                    }
                return true
            })
    ],
    login: [
            body('email')
                .notEmpty()
                .withMessage('El email es obligatorio')
                .isEmail()
                .withMessage('Debe ser un email valido')
                .normalizeEmail()
                .custom( async (email, {req}) => {
                    const usuario = await Usuario.findOne({ where: {email}});
                    if(!usuario){
                        throw new Error("Credenciales invalidas")
                    }
                    // puedo guardar el usario en req, para usarlo despues
                    req.usuarioEncontrado = usuario;
                    return true;
                }),
            body("password")
                .notEmpty()
                .withMessage("la contraseña es obligatoria")
                .custom((password, {req})=> {
                    const bcrypt= require("bcryptjs");
    
                    // verifico que tenemos el usuario del paso anterior
                    if(!req.usuarioEncontrado){
                        throw new Error("Credenciales Invalidas")
                    }
                    // comparo el password
                    const passwordCorrecta = bcrypt.compareSync(
                        password,
                        req.usuarioEncontrado.password
                    )
    
                    if(!passwordCorrecta){
                        throw new Error("Credenciales Invalidas")
                    }
    
                    return true;
    
                })  
        ],
    producto: [
        body('nombre')
            .notEmpty()
            .withMessage('El nombre del producto es obligatorio')
            .isLength({ min:4 ,max: 100})
            .withMessage('El nombre debe tener entre 4 y 100 caracteres')
            .trim(),
        body('precio')
            .notEmpty()
            .withMessage('El precio es obligatorio')
            .isFloat({min: 0.01})
            .withMessage('El precio debe ser un numero mayor a 0') ,
        body('descripcion')          
            .notEmpty()
            .withMessage('La descripcion del producto es obligatorio')
            .isLength({ min:10 ,max: 500})
            .withMessage('La descripciondebe tener entre 10 y 500 caracteres')
            .trim(),
        body('usuario_id')
            .notEmpty()
            .withMessage('Debes seleccionar un dueño para el producto')
            .isInt()
            .withMessage("'El dueño debe ser valido")
            .custom(async (value) => {
                const usuario = await Usuario.findByPk(value)
                if(!usuario){
                    throw new Error('El usuario seleccionado no existe')
                }
                return true;
            }),
        body('imagenes_producto')
            .custom( (value, {req}) => {
                if(!req.files || req.files.length === 0) {
                    throw new Error("Debes subir al menos una imagen del producto")
                }
                if(req.files.length > 5){
                    throw new Error("Puedes subir maximo 5 imagenes del producto")
                }
                const extensionesPermitidas = [ ".jpg", ".jpeg", ".png", ".gif"];
                req.files.forEach((file, index) => {
                    const extension = path.extname(file.originalname).toLowerCase();

                    if(!extensionesPermitidas.includes(extension)){
                        throw new Error(
                            `Imagen ${index + 1}: Las extensiones permitidas son: ${extensionesPermitidas.join(', ')}`
                        )
                    }

                    const maxSize = 5 * 1024 * 1024; // 5mb
                    if( file.size > maxSize){
                        throw new Error(
                            `Imagen ${index + 1}: El tamaño maximo es de 5mb`)
                    }
                });
                return true;
            })
    ],
    productoUpdate: [
        body('nombre')
            .notEmpty()
            .withMessage('El nombre del producto es obligatorio')
            .isLength({ min:4 ,max: 100})
            .withMessage('El nombre debe tener entre 4 y 100 caracteres')
            .trim(),
        body('precio')
            .notEmpty()
            .withMessage('El precio es obligatorio')
            .isFloat({min: 0.01})
            .withMessage('El precio debe ser un numero mayor a 0') ,
        body('descripcion')          
            .notEmpty()
            .withMessage('La descripcion del producto es obligatorio')
            .isLength({ min:10 ,max: 500})
            .withMessage('La descripciondebe tener entre 10 y 500 caracteres')
            .trim(),
        body('usuario_id')
            .notEmpty()
            .withMessage('Debes seleccionar un dueño para el producto')
            .isInt()
            .withMessage("'El dueño debe ser valido")
            .custom(async (value) => {
                const usuario = await Usuario.findByPk(value)
                if(!usuario){
                    throw new Error('El usuario seleccionado no existe')
                }
                return true;
            }),
        body('imagenes_producto')
            .custom( (value, {req}) => {
                if(req.files){
                    if(req.files.length > 5){
                        throw new Error("Puedes subir maximo 5 imagenes del producto")
                    }
                    const extensionesPermitidas = [ ".jpg", ".jpeg", ".png", ".gif"];
                    req.files.forEach((file, index) => {
                        const extension = path.extname(file.originalname).toLowerCase();
    
                        if(!extensionesPermitidas.includes(extension)){
                            throw new Error(
                                `Imagen ${index + 1}: Las extensiones permitidas son: ${extensionesPermitidas.join(', ')}`
                            )
                        }
    
                        const maxSize = 5 * 1024 * 1024; // 5mb
                        if( file.size > maxSize){
                            throw new Error(
                                `Imagen ${index + 1}: El tamaño maximo es de 5mb`)
                        }
                    });
                }
                return true;
            })
    ],
    categoria: [
        body('nombre')
            .notEmpty()
            .withMessage('El nombre de la categoria es obligatorio')
            .isLength({ min:4 ,max: 100})
            .withMessage('El nombre debe tener entre 4 y 100 caracteres')
            .trim(),
        body('descripcion')          
            .notEmpty()
            .withMessage('La descripcion de la categoria es obligatoria')
            .isLength({ min:10 ,max: 500})
            .withMessage('La descripciondebe tener entre 10 y 500 caracteres')
            .trim(),
    ],
    // middleware para manejar errores de validacion
    handleErrors: async (req, res,  next) => {
        const errors = validationResult(req)
        if(errors.isEmpty()){
            return next();
        }

        console.log("errores de validacion encontrados: ", errors.array());        

        if(req.file){
            fs.unlink(req.file.path, (err) => {
                if(err) console.log("Error eliminando archivo:", err);
            })
        }
        if(req.files){
            req.files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if(err) console.log("Error eliminando archivo:", err);
                })
            });
        }

        const isProducto = req.originalUrl.includes('producto');
        const isCategoria = req.originalUrl.includes("categoria");
        const isRegister = req.originalUrl.includes('register');
        const isLogin = req.originalUrl.includes('login');

        if(isRegister){
            return res.render('auth/register',{
                errors: errors.array(),
                oldData: req.body,
                title: "Registro",
                h1: "Crear cuenta"
            })
        }
        if(isLogin){
            return res.render('auth/login',{
                errors: errors.array(),
                oldData: req.body,
                title: "Login",
                h1: "Iniciar Sesion"
            })
        }

        if(isProducto){
            try {
                const usuarios = await Usuario.findAll();
                const categorias =  await Categoria.findAll();

                return res.render('productos/create', {
                    errors: errors.array(),
                    oldData: req.body,
                    title: 'Crear Producto',
                    h1: 'Nuevo Producto',
                    usuarios,
                    categorias
                })
            } catch (error) {
                console.log("error cargando datos:", error);
                return res.redirect('productos/create')                
            }
        }

        if (isCategoria) {
        return res.render("categorias/create", {
            errors: errors.array(),
            oldData: req.body,
            title: "Crear Categoría",
            h1: "Nueva Categoría"
        });
    }
    return res.status(500).send("Error de validacion no manejado");
    }
}

module.exports = validations;