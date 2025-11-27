'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('producto_categorias', [
      // BOMBÉ está en Citrica y Decorativa
      {
        producto_id: 1, // BOMBÉ
        categoria_id: 1, // Vela
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        producto_id: 2, // BOMBÉ
        categoria_id: 1, // Vela
        created_at: new Date(),
        updated_at: new Date()
      },
      // LOLA está en Dulce y Decorativa
      {
        producto_id: 1, // LOLA
        categoria_id: 3, // Decorativa
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        producto_id: 2, // LOLA
        categoria_id: 5, // Decorativa
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        producto_id: 3,
        categoria_id: 5, // Decorativa
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        producto_id: 4,
        categoria_id: 5, // Decorativa
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        producto_id: 5,
        categoria_id: 5, // Decorativa
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        producto_id: 6,
        categoria_id: 5, // Decorativa
        created_at: new Date(),
        updated_at: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('producto_categorias', null, {});
  }
};