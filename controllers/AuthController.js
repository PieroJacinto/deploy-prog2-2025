const bcrypt = require("bcryptjs");
const{ Usuario } = require('../database/models');

const authController = {
    //REGISTRO

    //MOSTRAR FORM DE REGISTO
    registerForm: (req, res) => {
        res.render('auth/register', {
            title: 'Registro',
            h1: 'Crear Cuenta',
            errors: [],
            oldData: {}
        });
    },

    processRegister: async(req, res) => {
        try {

            // los errores ya fueroin validados opor el middleware handleErrors
            // si lleganmos hasta aca, los datos son validos
            const { nombre, email, password } = req.body;

            // paso 2: hashear el password
            const hashedPassword = bcrypt.hashSync(password, 10);

            // paso 3: crear el usuario en la DB
            const datosUsuario ={
                nombre,
                email, 
                password: hashedPassword
            };  
            
            if(req.file){
                console.log("imagen:", req.file)
                datosUsuario.imagen = req.file.filename;
            }
            console.log("datos usuario en create register: ", JSON.stringify(datosUsuario,null,4));
            

            const nuevoUsuario = await Usuario.create(datosUsuario);

            // paso 4: Loguear automaticamente, (guardar en sesion)
            req.session.userId = nuevoUsuario.id;
            req.session.userName = nuevoUsuario.nombre;
            // ⚠️ IMPORTANTE: Agregar await al save()
            await req.session.save();

            // paso 5 : redirigir al home
            res.redirect(`/usuarios/${nuevoUsuario.id}`)
        } catch (error) {
            console.log(' ERROR EN EL REGISTRO: ', error);
            res.render('auth/register', {
                title: 'Registro',
                h1: 'Crear Cuenta',
                errors: [{msg: 'ERROR AL CREAR USUARIO'}],
                oldData: req.body
            })            
        }
    },
    login: (req, res) =>{
        res.render('auth/login', {
            title: "Login",
            h1: 'Iniciar Sesion',
            errors: [],
            oldData: {}
        })
    },
    processlogin: async(req, res ) => {
        try {
            const { email } = req.body;
            const usuario = await Usuario.findOne(({
                where: {email}
            }))
            
            // 6 si el password, es valido, guardar en sesion
            req.session.userId = usuario.id
            req.session.userName = usuario.nombre
            req.session.userRol = usuario.rol; 
            // ⚠️ IMPORTANTE: Agregar await al save()
         await req.session.save();
            // 7-redirigo al home. 
            res.redirect('/')
        } catch (error) {
            console.error('Error en el login', error);
            return res.render('auth/login', {
                    title: "Login",
                    h1: 'Iniciar Sesion',
                    errors: [{msg: 'Error al iniciar sesion'}],
                    oldData: req.body
                })
        }
    },
    logout: async( req, res ) => {
        await req.session.destroy((err)=>{
            if(err){
                console.error("Error al cerrar sesion: ",  err)
            }
            res.redirect("/");
        })
    }
}

module.exports = authController;