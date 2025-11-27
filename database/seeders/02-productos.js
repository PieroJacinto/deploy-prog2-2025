"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "productos",
      [
        {
          nombre: "BOMBÉ",
          precio: 8000,
          descripcion: "aca va la description",
          usuario_id: 1, 
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nombre: "LOLA",
          precio: 8000,
          descripcion: "aca va la description",
          usuario_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nombre: "IRIS",
          precio: 7200,
          descripcion: "aca va la description",
          usuario_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nombre: "OLIVIA",
          precio: 12000,
          descripcion: "aca va la description",
          usuario_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nombre: "GRECIA",
          precio: 8000,
          descripcion: "aca va la description",
          usuario_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          nombre: "MADERA",
          precio: 7000,
          descripcion: "aca va la description",
          usuario_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {   
     await queryInterface.bulkDelete('productos', null, {});     
  },
};
