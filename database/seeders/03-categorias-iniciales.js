'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categorias', [
      {
        nombre: 'Combo',
        descripcion: 'Combo de Vela más esencias',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Vela',
        descripcion: 'Una pieza de combustible sólido (cera, parafina, etc.) con una mecha en el centro',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Esencia',
        descripcion: 'Un compuesto químico concentrado diseñado específicamente para añadir fragancia a las velas',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Citrica',
        descripcion: 'Fragancia para crear ambiente o relajación (naranja, limón, pomelo)',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Dulce',
        descripcion: 'Fragancia para crear ambiente o relajación (vainilla, coco, caramelo)',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'Decorativa',
        descripcion: 'Color o diseño artístico es su atractivo principal',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categorias', null, {});
  }
};