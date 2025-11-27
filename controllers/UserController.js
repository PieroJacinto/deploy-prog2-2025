const path = require("path");
const db = require('../database/models');
const { log } = require("console");
const fs = require('fs');
const { destroy } = require("./ProductoController");

const userController = {
    index: async (req, res) => {
        try {
            const usuarios = await db.Usuario.findAll({
                order:[['created_at', 'DESC']]
            });
            res.render('usuarios/index',{
                title: 'Usuarios desde la BD',
                usuarios: usuarios,
                h1: 'Usuarios desde la BD'
            })
        } catch (error) {
            console.log("error obteniedo los usuarios de la db: ", error.message);            
        }
    },
    show: async(req, res ) => {
        try {
            const usuario = await db.Usuario.findByPk(req.params.id)
            
            if(!usuario) {
                return res.render('errors/404',{
                    title: "ERROR",
                    mensaje: "usuario no encontrado ",
                    h1: "errores",
                    url: req.url
                })           
            }
            res.render('usuarios/show',{
                title: `Usuario: ${usuario.nombre}`,
                h1: "Mi pagina de detalle de usuario",
                usuario: usuario
            })
        } catch ( e ) {
            console.log("error obteniendo el usuario:", e);
            res.render('errors/404', {
                    title: "ERROR",
                    mensaje: "error cargando usuario ",
                    h1: "errores",
                    url: req.url
            })

            
        }
    },
    create: async(req,res) => {
        res.render('usuarios/create',{
            title: 'Crear Usuario',
            h1: 'Nuevo Usuario',
            errors: [],
            oldData: {}
        })
    },
    store: async(req, res) => {
        try {
            const {nombre, email} = req.body;

            const userData = {
                nombre: nombre.trim(),
                email: email.trim()
            }

            if(req.file){
                userData.imagen = req.file.filename; // agregamos el nombre del archivo
                // Ver el req.file, y que info nos trae el archivo
                console.log('imagen subida:', {
                    originalName: req.file.originalname,
                    fileName: req.file.filename,
                    size: req.file.size,
                    path: req.file.path
                });

                const nuevoUsuario = await db.Usuario.create(userData);

                console.log("Usuario creado: ", nuevoUsuario.id);
                // Volvemos al perfil del usuario
                res.redirect(`/usuarios/${nuevoUsuario.id}`)               
            }

        } catch (error) {
            console.log('Error creando usuario:', error);

            res.render('usuarios/create',{
                errors: [{msg:'Error creando Usuario'}],
                oldData:req.body,
                title: "Crear Usuario",
                h1: "Nuevo Usuario"
            });
        }
    },
    edit: async (req, res) => {
        try {
            const usuario = await db.Usuario.findByPk(req.params.id);

            res.render("usuarios/edit", {
                title: `Editar usuario: ${usuario.nombre}`,
                h1: "Editar usuario",
                usuario,
                errors: [],
                oldData: {},
            });
        } catch (error) {
            console.log("Error cargando formulario de edición:", error);
            res.render('errors/404', {
                    title: "ERROR",
                    mensaje: "error cargando usuario ",
                    h1: "errores",
                    url: req.url
            })
        }
    },
    
    update: async (req, res) => {
        try {
            const { nombre, email } = req.body;
            const usuario = await db.Usuario.findByPk(req.params.id);

            const updateData = {
                nombre: nombre.trim(),
                email: email.trim(),
            }

            if(req.file){
                if(usuario.imagen){
                    const imagePath = path.join(__dirname,'../public/images/usuarios', usuario.imagen);

                    if(fs.existsSync(imagePath)){
                        try {
                            fs.unlinkSync(imagePath);
                            console.log('imagen anterior eliminada exitosamente');
                        } catch (error) {   
                            console.error(" elimando imagen anterior ", imagePath)
                        }
                    }                
                }
                updateData.imagen = req.file.filename
            }

            await usuario.update(updateData);

            res.redirect(`/usuarios/${usuario.id}`);
        } catch (error) {
            console.log("Error al actualizar usuario:", error);
            res.render('errors/404', {
                    title: "ERROR",
                    mensaje: "Error al actualizar usuario",
                    h1: "errores",
                    url: req.url
            })
        }
    },
    destroy: async (req, res) => {
        try {
            const usuario = await db.Usuario.findByPk(req.params.id)
            if(!usuario) {
                return res.status(404).render('errors/404',{
                    title: "usuario no encontrado",
                    h1: 'error 404',
                    mensaje: 'El usuario no existe',
                    url: req.url
                })
            }

            // si el usuario tiene imagen, eliminamos el arhcivo fisico
            if(usuario.imagen){
                //construimos la ruta completa al archivo
                const imagePath = path.join(__dirname,'../public/images/usuarios', usuario.imagen);
                console.log('intentando eliminar imagen:', imagePath);
                //verificar que el arhcivo que queremos eliminar existe, antes de eliminarlo
                if(fs.existsSync(imagePath)){
                    try {
                        fs.unlinkSync(imagePath);
                        console.log('imagen eliminada exitosamente');
                        
                    } catch (error) {   
                        console.error(" el archivo de imagen no existe en el servidor: ", imagePath)
                        
                    }
                }                
            }

            await usuario.destroy();
            res.redirect('/usuarios')
        } catch (error) {
            console.log('error al eliminar usuario: ',error);
            res.render('errors/404', {
            title: "ERROR",
            mensaje: "Error al eliminar usuario",
            h1: "errores",
            url: req.url
        });         
        }
    }
}

module.exports = userController;