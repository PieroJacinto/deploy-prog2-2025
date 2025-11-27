'use strict';
const bcrypt = require("bcryptjs");
const { query } = require('express-validator');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('usuarios',[
          {
            nombre: "Diego Comisso",
            email: "diego@gmail.com",
            password: bcrypt.hashSync("123456", 10),
            rol: "admin",
            imagen: "perfil1.jpg",
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            nombre: "Juan Gomez",
            email: "juan@gmail.com",
            password: bcrypt.hashSync("123456", 10),
            rol: "user",
            imagen: "perfil2.jpg",
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            nombre: "Pedro Martinez",
            email: "pedro@gmail.com",
            password: bcrypt.hashSync("123456", 10),
            rol: "user",
            imagen: "perfil3.jpg",
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            nombre: "Araceli Gonzalez",
            email: "Araceli@gmal.com",
            password: bcrypt.hashSync("123456", 10),
            rol: "user",
            imagen: "perfil4.jpg",
            created_at: new Date(),
            updated_at: new Date()
          },
        ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {})
  }
};
