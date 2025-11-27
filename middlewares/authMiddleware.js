const { Usuario } = require("../database/models");

const authMiddleware = async( req, res, next) => {
    // 1- verificar si hay sesion activa
    if(!req.session.userId){
        console.log(('authMiddleware: no hay sesion activa'));        
        return res.redirect('/auth/login');
    }

    try {
        // 2- Buscar el usuarioo completo en la base de datos
        const usuario = await Usuario.findByPk(req.session.userId,{
            attributes: ['id', 'nombre', 'email', 'rol', 'imagen', 'created_at']
        });

        // 3- Verificar uqe el usuario existe en la DB
        if(!usuario){
            console.log(('authMiddleware: Usuario no encontrado en la DB, destruyendo sesion')); 
            req.session.destroy(); 
            return res.redirect('/auth/login');
        }

        // 4- Hacer el usuario disponible GLOBALMENTE
        req.user = usuario  // para CONTROLLERS
        res.locals.user = usuario   // para VIEWS

        // 5- sincronizar datos de sesion
        req.session.userName = usuario.nombre;
        req.session.userRol = usuario.rol
        console.log(`authMiddleware: Usuario autenticado - ${usuario.nombre} (${usuario.rol}) `);
        
        // 6- continuar al siguiente middleware o controller 
        next();
    } catch (error) {
        console.error('Error en authMiddleware: ', error)
        return res.redirect('auth/login')
    }
    
}

module.exports = authMiddleware;

//1- usuario que intenta a acceder a admin/usuarios.

//2- authMiddleweware. estas logueado? (AUTENTICACION) 
// NO => NO TENES PERMISOS, ERRROR 403
// SI => CONTINUIAMOS AL CONTROLLER

// 3- roleMiddleware
// es admin? (autorizacion)
// NO => NO TENES PERMISOS, ERRROR 403
// SI => CONTINUIAMOS AL CONTROLLER

// 4 -* CONTROLLER, EJECUTA LA ACCION Q QUEREMOS EJECUTAR