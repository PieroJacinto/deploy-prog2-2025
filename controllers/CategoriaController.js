const path = require("path");
const { Categoria } = require("../database/models");

const categoriaController = {
    index: async (req, res) => {
        try {
            const categorias = await Categoria.findAll({
                order: [["created_at", "DESC"]],
            });

            res.render("categorias/index", {
                title: "Listado de Categorías",
                h1: "Categorías disponibles",
                categorias,
            });
        } catch (error) {
            console.log("Error obteniendo las categorías:", error.message);
            res.status(500).send("Error del servidor");
        }
    },

    create: (req, res) => {
        res.render("categorias/create", {
            title: "Crear Categoría",
            h1: "Nueva Categoría",
            errors: [],
            oldData: {},
        });
    },

    store: async (req, res) => {
        try {
            const { nombre, descripcion } = req.body;

            await Categoria.create({
                nombre: nombre.trim(),
                descripcion: descripcion ? descripcion.trim() : "",
            });

            res.redirect("/categorias");
        } catch (error) {
            console.log("Error al crear la categoría:", error.message);
            res.status(500).send("Error al crear la categoría");
        }
    },

    edit: async (req, res) => {
        try {
            const categoria = await Categoria.findByPk(req.params.id);

            if (!categoria) {
                return res.status(404).render("errors/404", {
                    title: "Categoría no encontrada",
                    h1: "Error 404",
                    mensaje: "La categoría solicitada no existe",
                });
            }

            res.render("categorias/edit", {
                title: `Editar Categoría: ${categoria.nombre}`,
                h1: "Editar Categoría",
                categoria,
                errors: [],
                oldData: {},
            });
        } catch (error) {
            console.log("Error cargando formulario de edición:", error);
            res.status(500).send("Error del servidor");
        }
    },

    update: async (req, res) => {
        try {
            const { nombre, descripcion } = req.body;
            const categoria = await Categoria.findByPk(req.params.id);

            if (!categoria) {
                return res.status(404).render("errors/404", {
                    title: "Categoría no encontrada",
                    h1: "Error 404",
                    mensaje: "La categoría solicitada no existe",
                });
            }

            await categoria.update({
                nombre: nombre.trim(),
                descripcion: descripcion ? descripcion.trim() : "",
            });

            res.redirect("/categorias");
        } catch (error) {
            console.log("Error al actualizar categoría:", error);
            res.status(500).send("Error del servidor");
        }
    },

    destroy: async (req, res) => {
        try {
            const categoria = await Categoria.findByPk(req.params.id);

            if (!categoria) {
                return res.status(404).render("errors/404", {
                    title: "Categoría no encontrada",
                    h1: "Error 404",
                    mensaje: "La categoría solicitada no existe",
                });
            }

            await categoria.destroy();
            res.redirect("/categorias");
        } catch (error) {
            console.log("Error al eliminar categoría:", error);
            res.status(500).send("Error al eliminar la categoría");
        }
    },
};

module.exports = categoriaController;