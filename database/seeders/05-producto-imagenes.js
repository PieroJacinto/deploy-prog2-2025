'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('producto_imagenes', [
      {
        producto_id: 1,
        imagen: "producto1.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        producto_id: 2,
        imagen: "producto2.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        producto_id: 3,
        imagen: "producto3.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        producto_id: 4,
        imagen: "producto4.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        producto_id: 5,
        imagen: "producto5.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        producto_id: 6,
        imagen: "producto6.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        producto_id: 6,
        imagen: "producto6-2.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('producto_imagenes', null, {});
    
  }
};
