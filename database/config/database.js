require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'dev_user',
    password: process.env.DB_PASS || '123456',
    database: process.env.DB_NAME || 'programacion2_dev',
    host: process.env.DB_HOST || 'localhost',
    dialect: "mysql",
    logging: console.log,
  },
  
  production: {
    username: process.env.DB_USER_PROD,
    password: process.env.DB_PASS_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    port: process.env.DB_PORT_PROD,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,              // ← DEBE estar
        rejectUnauthorized: false   // ← DEBE estar
      }
    },
    pool: {
      max: 3,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};