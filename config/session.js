// config/session.js
// Configuración de iron-session para Vercel

const sessionOptions = {
  // Password debe tener mínimo 32 caracteres
  password: process.env.SECRET,
  
  // Nombre de la cookie
  cookieName: "prog2_session",
  
  // Opciones de la cookie
  cookieOptions: {
    // Solo HTTPS en producción
    secure: process.env.NODE_ENV === "production",
    
    // 1 día en segundos (iron-session usa segundos, no milisegundos)
    maxAge: 24 * 60 * 60,
    
    // No accesible desde JavaScript del cliente
    httpOnly: true,
    
    // Lax = cookie se envía en navegación normal pero no en requests cross-site
    sameSite: "lax",
    
    // Path donde la cookie es válida
    path: "/",
  },
};

module.exports = sessionOptions;
