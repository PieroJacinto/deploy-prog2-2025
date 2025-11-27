module.exports = ( sequelize, Datatypes ) => {
  
  const alias = "ProductoCategoria"; // Así debe estar en controladores
  const cols ={
    id: {
      type: Datatypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull:false,
    },
    producto_id:{
      type: Datatypes.INTEGER,
      allowNull: false
    },
    categoria_id:{
      type: Datatypes.INTEGER,
      allowNull: false
    }
  };
  const config = {
    tableName: "producto_categorias",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  };

  const ProductoCategoria = sequelize.define(alias, cols, config);

  ProductoCategoria.associate = (models) => {
   // las relaciones ya estan manejadas en el belongstoMany
   // no necesitamnos definir mas asociaciones aca.
   // sequelize lo hace por nosotros.
  }

  return ProductoCategoria;
}