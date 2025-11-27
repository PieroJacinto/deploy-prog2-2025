module.exports = ( sequelize, Datatypes ) => {
  
  const alias = "Producto"; // Así debe estar en controladores
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
      type: Datatypes.STRING(255),
      allowNull: false,
    },
    precio:{
      type: Datatypes.DECIMAL(10,2),
      allowNull:false
    },
    usuario_id: {
      type:Datatypes.INTEGER,
      allowNull:false,
    },
  };
  const config = {
    tableName: "productos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  };

  const Producto = sequelize.define(alias, cols, config);

  Producto.associate = (models) => {
    //un producto PERTENECE a un usuario
    Producto.belongsTo(models.Usuario, {
      foreignKey:'usuario_id',
      as: "dueño"
    });

    Producto.belongsToMany(models.Categoria, {
      through:'producto_categorias',
      foreignKey: 'producto_id',
      otherKey: 'categoria_id',
      as: 'categorias'
    });

    Producto.hasMany(models.ProductoImagen,{
      foreignKey: 'producto_id',
      as: 'imagenes'
    })
  }

  return Producto;
}