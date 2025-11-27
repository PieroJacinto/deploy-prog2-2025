const { log } = require('console');
const { Producto, Usuario, Categoria, ProductoImagen } = require('../database/models');
const { deleteImage } = require('../config/cloudinaryHelper');

const productoController = {

    index: async (req, res) => {
        try {
            const productos = await Producto.findAll({
                include: [
                    {
                        model: Usuario,
                        as: 'dueño'
                    },
                    {
                        model: Categoria,
                        as: 'categorias',
                        through: { attributes: [] }
                    },
                    {
                        model: ProductoImagen,
                        as: 'imagenes'
                    }
                ]
            });

            const categorias = await Categoria.findAll();

            res.render('productos/index', {
                title: 'Lista de Productos',
                productos: productos,
                categorias,
                h1: 'Productos'
            })
        } catch (error) {
            console.error('Error en index productos:', error);
            res.status(500).send('Error al cargar productos');
        }
    },

    show: async (req, res) => {
        try {
            const producto = await Producto.findByPk(req.params.id, {
                include: [
                    {
                        model: Usuario,
                        as: 'dueño'
                    },
                    {
                        model: Categoria,
                        as: 'categorias',
                        through: { attributes: [] }
                    },
                    {
                        model: ProductoImagen,
                        as: 'imagenes'
                    }
                ]
            });

            if (!producto) {
                return res.status(404).render('errors/404', {
                    title: "Producto no encontrado",
                    h1: 'Error 404',
                    mensaje: "El producto solicitado no existe",
                    url: req.url
                })
            }

            res.render('productos/show', {
                title: `Producto: ${producto.nombre}`,
                producto: producto,
                h1: producto.nombre
            })
        } catch (error) {
            console.error("Error al obtener producto:", error);
            res.redirect('/productos')
        }
    },

    create: async (req, res) => {
        try {
            const usuarios = await Usuario.findAll();
            const categorias = await Categoria.findAll();

            res.render('productos/create', {
                title: 'Crear Producto',
                h1: 'Nuevo Producto',
                usuarios: usuarios,
                categorias: categorias,
                errors: [],
                oldData: {}
            })
        } catch (error) {
            console.error("Error cargando el formulario:", error);
            res.redirect('/productos');
        }
    },

    store: async (req, res) => {
        try {
            const { nombre, precio, descripcion, usuario_id, categorias } = req.body;

            if (!req.files || req.files.length == 0) {
                throw new Error('Debe subir al menos una imagen del producto')
            }

            console.log("Imágenes recibidas:", JSON.stringify(req.files, null, 4));

            const nuevoProducto = await Producto.create({
                nombre,
                precio,
                descripcion,
                usuario_id
            })

            console.log('Producto creado con ID:', nuevoProducto.id);

            // Guardar imágenes con las URLs de Cloudinary
            for (const file of req.files) {
                console.log("Guardando imagen de Cloudinary:", file.path);

                await ProductoImagen.create({
                    producto_id: nuevoProducto.id,
                    imagen: file.path // URL completa de Cloudinary
                })
            }

            // Asociar categorías, si las hay
            if (categorias && categorias.length > 0) {
                await nuevoProducto.setCategorias(categorias)
            }

            res.redirect(`/productos/show/${nuevoProducto.id}`)
        } catch (error) {
            console.error('Error creando producto:', error);

            // Si hubo error y se subieron imágenes a Cloudinary, eliminarlas
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    await deleteImage(file.path);
                }
            }

            const usuarios = await Usuario.findAll();
            const categorias = await Categoria.findAll();

            return res.render('productos/create', {
                errors: [{ msg: error.message || "Error creando producto" }],
                oldData: req.body,
                title: 'Crear Producto',
                h1: 'Nuevo Producto',
                usuarios,
                categorias
            })
        }
    },

    edit: async (req, res) => {
        try {
            const usuarios = await Usuario.findAll();
            const categorias = await Categoria.findAll();
            const producto = await Producto.findByPk(req.params.id, {
                include: [
                    {
                        model: Usuario,
                        as: 'dueño'
                    },
                    {
                        model: Categoria,
                        as: 'categorias',
                        through: { attributes: [] }
                    },
                    {
                        model: ProductoImagen,
                        as: 'imagenes',
                    }
                ]
            });

            if (!producto) {
                return res.status(404).render('errors/404', {
                    title: "Producto no encontrado",
                    h1: 'Error 404',
                    mensaje: 'El producto solicitado no existe',
                    url: req.url
                })
            }

            res.render('productos/edit', {
                title: `Editar: ${producto.nombre}`,
                producto: producto,
                h1: producto.nombre,
                usuarios: usuarios,
                categorias: categorias
            })
        } catch (error) {
            console.error("Error al cargar el formulario de edición:", error);
            res.redirect('/productos');
        }
    },

    update: async (req, res) => {
        try {
            // Obtener los datos del formulario
            const { nombre, precio, descripcion, usuario_id, categorias, imagenes_eliminar } = req.body;

            // Obtener el producto a actualizar
            const producto = await Producto.findByPk(req.params.id, {
                include: [
                    {
                        model: Usuario,
                        as: 'dueño'
                    },
                    {
                        model: Categoria,
                        as: 'categorias',
                        through: { attributes: [] }
                    },
                    {
                        model: ProductoImagen,
                        as: 'imagenes',
                    }
                ]
            })

            console.log("Producto a editar:", JSON.stringify(producto, null, 2));

            if (!producto) {
                return res.status(404).render('errors/404', {
                    title: "Producto no encontrado",
                    h1: 'Error 404',
                    mensaje: 'El producto solicitado no existe',
                    url: req.url
                })
            }

            // Actualizar el producto con los nuevos datos
            await producto.update({
                nombre: nombre.trim(),
                precio: parseFloat(precio),
                descripcion: descripcion.trim(),
                usuario_id
            })

            // Actualizar categorías
            if (categorias && categorias.length > 0) {
                await producto.setCategorias(categorias);
            } else {
                // Si no se seleccionó ninguna categoría, eliminar todas
                await producto.setCategorias([]);
            }

            // Eliminar imágenes marcadas
            if (imagenes_eliminar) {
                const idAEliminar = Array.isArray(imagenes_eliminar) ? imagenes_eliminar : [imagenes_eliminar];
                
                for (const imgId of idAEliminar) {
                    const imagenEnDB = await ProductoImagen.findByPk(imgId);

                    if (imagenEnDB) {
                        // Eliminar de Cloudinary
                        await deleteImage(imagenEnDB.imagen);
                        
                        // Eliminar de la base de datos
                        await imagenEnDB.destroy();
                    }
                }
            }

            // Agregar nuevas imágenes
            if (req.files && req.files.length > 0) {
                const imagenesActuales = await ProductoImagen.count({ where: { producto_id: req.params.id } });
                const totalImagenes = imagenesActuales + req.files.length;

                if (totalImagenes > 5) {
                    // Si excede el límite, eliminar las imágenes recién subidas de Cloudinary
                    for (const file of req.files) {
                        await deleteImage(file.path);
                    }
                    throw new Error("El producto no puede tener más de 5 imágenes");
                }

                // Guardar nuevas imágenes con URLs de Cloudinary
                for (const file of req.files) {
                    await ProductoImagen.create({
                        producto_id: req.params.id,
                        imagen: file.path, // URL completa de Cloudinary
                    })
                }
            }

            // Redirigir al detalle del producto
            res.redirect(`/productos/show/${producto.id}`);

        } catch (error) {
            console.error('Error al actualizar producto:', error);

            // En caso de error, recargar el formulario
            const producto = await Producto.findByPk(req.params.id, {
                include: [
                    {
                        model: Usuario,
                        as: 'dueño'
                    },
                    {
                        model: Categoria,
                        as: 'categorias',
                        through: { attributes: [] }
                    },
                    {
                        model: ProductoImagen,
                        as: 'imagenes',
                    }
                ]
            })

            const usuarios = await Usuario.findAll();
            const categoriasAll = await Categoria.findAll();

            res.render('productos/edit', {
                producto,
                usuarios,
                categorias: categoriasAll,
                h1: "Editar Producto",
                title: `Editar: ${producto.nombre}`,
                old: req.body,
                error: error.message
            })
        }
    },

    destroy: async (req, res) => {
        try {
            const producto = await Producto.findByPk(req.params.id, {
                include: [
                    {
                        model: ProductoImagen,
                        as: 'imagenes'
                    }
                ]
            });

            if (!producto) {
                return res.status(404).render('errors/404', {
                    title: "Producto no encontrado",
                    h1: 'Error 404',
                    mensaje: 'El producto solicitado no existe',
                    url: req.url
                })
            }

            // Eliminar imágenes asociadas de Cloudinary y la base de datos
            if (producto.imagenes && producto.imagenes.length > 0) {
                for (const img of producto.imagenes) {
                    // Eliminar de Cloudinary
                    await deleteImage(img.imagen);
                    
                    // Eliminar de la base de datos
                    await img.destroy();
                }
            }

            // Eliminar el producto
            await producto.destroy();

            res.redirect('/productos')
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.redirect('/productos');
        }
    }
}

module.exports = productoController;