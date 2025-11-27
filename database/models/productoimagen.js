module.exports = ( sequelize, Datatypes ) => {
  
  const alias = "ProductoImagen"; // asi lo llamaremos en los controladores
  const cols ={
    id: {
      type: Datatypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull:false,
    },
    producto_id:{
      type: Datatypes.INTEGER,
      allowNull: false,
      references: {
        model: 'productos',
        key: 'id'
      },
      comment: 'FK hacia tabla productos'
    },
    imagen: {
      type: Datatypes.STRING(255),
      allowNull: false,
      comment: "Nombre del archivo imagen"
    }
  };
  const config = {
    tableName: "producto_imagenes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  };

  // ahora definimos y creamos la tabla
  const ProductoImagen  = sequelize.define(alias, cols, config);

  // cuando tengasmos relaciones entre tablas, las agregamos aca
  ProductoImagen.associate = (models) => {
    ProductoImagen.belongsTo(models.Producto, {
      foreignKey: 'producto_id',
      as: 'producto' // alias para includes
    })
  }
  return ProductoImagen;

}