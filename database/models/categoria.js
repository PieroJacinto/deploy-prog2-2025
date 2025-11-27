module.exports = ( sequelize, Datatypes ) => {
  
  const alias = "Categoria"; // Así debe estar en controladores
  const cols ={
    id: {
      type: Datatypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull:false,
    },
    nombre: {
      type: Datatypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: Datatypes.TEXT,
      allowNull: false,
    },
  };
  const config = {
    tableName: "categorias",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  };

  const Categoria = sequelize.define(alias, cols, config);

  Categoria.associate = (models) => {
    //un producto PERTENECE a un usuario
    Categoria.belongsToMany(models.Producto, {
      through: 'producto_categorias',
      foreignKey:'categoria_id',
      otherKey: 'producto_id',
      as: "productos"
    })
  }

  return Categoria;
}