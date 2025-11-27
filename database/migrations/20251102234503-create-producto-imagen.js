'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('producto_imagenes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      producto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {  //FOREIGN HEY
          model:'productos', // TABLA A LA QUE HAGO REFERNECIA
          key: 'id' // CAMPO AL QUE HAGO REFERENCIA DE ESA TABLA
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      imagen: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('producto_imagenes');
  }
};