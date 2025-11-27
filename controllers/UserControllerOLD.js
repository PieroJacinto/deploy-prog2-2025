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
    }
}

module.exports = userController;