const { Usuario, Producto } = require('../database/models');
const adminController = {

    // 1 DASHBOARD
    // MUESTRA ESTADISTICAS GENERALES DEL SISTEMA
    dashboard: async ( req, res) => {
        try {
            // paso 1: Contar el total de usuarios
            const totalUsuarios = await Usuario.count();
            // SERIA COMO HACER UN SELECT COUNT(*) FROM usuarios   en sql

            // paso 2: Contar usuarios admin
            const adminCount = await Usuario.count({
                where: {rol: 'admin'}
            });

            // PASO 3: CONTAR USUARIOS NORMALES
             const userCount = await Usuario.count({
                where: {rol: 'user'}
            });

            // PASO 4: CONTAR TOTAL DE PRODUCTOS
            const totalProductos = await Producto.count();

            // PASO 5 : MOSDTRAMOS PARA DEBUG
            console.log(('Dashboard  - Estadisaticas cargadas:'));
            console.log("  total usuarios: ", totalUsuarios);
            console.log("  Admins:", adminCount);
            console.log("  Users:", userCount);
            console.log("  Total Productos:", totalProductos);

            // paso 6: RENDERIZAMOS LA VISTA

            res.render('admin/dashboard', {
                title: 'Panel de Administracion',
                h1: 'Dashboard Admin',

                // objeto con todas las estadisticas
                stats: {
                    totalUsuarios,
                    adminCount,
                    userCount,
                    totalProductos
                }
            })         
        } catch (error) {
            console.error(' ERROR EN DASHBOARD', error);

            res.status(500).render('errors/error',{
                title: "Error",
                h1: "Error en el dashboard",
                mensaje: "No se pudieron cargar las estadisticas"
            })
        }
    },

    listarUsuarios: async(req, res ) => {
       try {
            const usuarios = await Usuario.findAll({
                 attributes: ['id', 'nombre', 'email', 'rol', 'imagen', 'created_at'],
                 order: [['created_at', 'DESC']]
            })
            res.render('admin/usuarios', {
                title: 'Gestion de Usuarios',
                h1: 'Usuarios del Sistema',
                usuarios
            })
       } catch (error) {
            console.error(' Error al listar usuarios"', error);

            res.status(500).render('errors/error',{
                title: "Error",
                h1: "Error al cargar usuarios",
                mensaje: "No se pudieron cargar los usuarios"
            })
       }
    },
    cambiarRol: async(req, res ) => {
        try {
            //paso 1= obtener datops de req
            const { id } = req.params;
            const { nuevoRol } = req.body;
            console.log(`intentando cambiar el rol del usuario ${id} a ${nuevoRol} `);

            //paso 2: buscamos el usuario en la db
            const usuario = await Usuario.findByPk(id);
            if(!usuario){
                console.log("usuario no encontrado", id);
                return res.status(404).send('usuario no encontrado');                
            }
            const rolAnterior = usuario.rol;
            //paso 3: actualizamos el rol y duardamos en la db
            usuario.rol = nuevoRol;

            await usuario.save();

            console.log("rol cambiadfo exitosamente");
            console.log(` Usuario: ${usuario.nombre}`);
            console.log(` de: ${rolAnterior} a ${nuevoRol}`);            

            res.redirect('/admin/usuarios')
            

            
        } catch (error) {
            
        }
    },
    eliminarUsuario: (req, res ) => {
        res.send("Eliminar usuario en construccion")
    },
}

module.exports = adminController;