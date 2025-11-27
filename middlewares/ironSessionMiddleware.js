// middlewares/ironSessionMiddleware.js
// Middleware para iron-session compatible con express-session

const { getIronSession } = require('iron-session');
const sessionOptions = require('../config/session');

/**
 * Middleware que integra iron-session con Express
 * Mantiene compatibilidad con la interfaz de express-session
 */
async function ironSessionMiddleware(req, res, next) {
  try {
    // Obtener la sesión de iron-session
    req.session = await getIronSession(req, res, sessionOptions);
    
    // Agregar método save() para compatibilidad con express-session
    // Iron-session guarda automáticamente, pero mantenemos el método
    // por compatibilidad con código existente
    if (!req.session.save) {
      req.session.save = async function() {
        // iron-session no necesita save explícito, pero lo mantenemos
        // para que el código existente funcione sin cambios
        return Promise.resolve();
      };
    }
    
    // Agregar método destroy() para compatibilidad con express-session
    if (!req.session.destroy) {
      req.session.destroy = async function() {
        // Limpiar todos los datos de sesión
        const keys = Object.keys(this);
        for (const key of keys) {
          if (key !== 'save' && key !== 'destroy') {
            delete this[key];
          }
        }
        // Guardar sesión vacía
        await this.save();
      };
    }
    
    next();
  } catch (error) {
    console.error('Error en iron-session middleware:', error);
    next(error);
  }
}

module.exports = ironSessionMiddleware;
