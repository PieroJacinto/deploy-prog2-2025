const roleMiddleware = (rolesPermitidos)=>{
    return( req, res, next) => {
        // 1- verificar que hay sesion (por, las dudas)
        if(!req.session.userId){            
            return res.redirect('/auth/login');
        }

        //2 verificar que req.user existe
        if(!req.user){
            console.error('roleMiddleware: req.user noe sta definido: olvidaste usar authMiddleware primero?')
            return res.redirect('/auth/login');
        }
        //3- verificar si el rol de usuario esta en la lista de roles permitidos
        if(!rolesPermitidos.includes(req.user.rol)){
            console.log(`Acceso denegado: Usuario ${req.user.nombre} (rol: ${req.user.rol}) intento acceder a una ruta protegida`);
            return res.status(403).render('errors/error',{
                title: "Acceso denegado",
                mensaje: "No tienes los permisos para acceder a esta vista",
                h1: "error 403, acceso denegado"
            })
            
        }

        //4 si el usuario tiene el rol adecuado, continuar
        console.log(`Acceso concedido: Usuario ${req.user.nombre } (rol: ${req.user.rol})`);
        next();       
    }
}

module.exports = roleMiddleware;

// roleMiddleware(['admin, moderador'])