module.exports = ( sequelize, Datatypes ) => {
  
  const alias = "Usuario"; // Así debe estar en controladores
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
    email: {
      type: Datatypes.STRING(255),
      allowNull: false,
      unique: true, 
    },
    password: {
      type: Datatypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: Datatypes.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false,
      comment: "Rol de usuario: user (usuario normal) o admin (administrador)"
    },
    imagen: {
      type: Datatypes.STRING(255),
      allowNull: true,
      comment: "Imagen de perfil"
    }
  };
  const config = {
    tableName: "usuarios",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  };

  const Usuario = sequelize.define(alias, cols, config);

  Usuario.associate = (models) => {
    // usuario tiene muchos productos
    Usuario.hasMany(models.Producto,{
      foreignKey: 'usuario_id',
      as: 'productos'
    })
  }

  return Usuario;
}