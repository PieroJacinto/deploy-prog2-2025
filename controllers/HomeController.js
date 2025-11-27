const path = require("path");

const homeController = {
    index: (req, res) => {
        res.render('index', {
            title: "Inicio",
            h1: "Inicio"
        })
    },
    about: (req, res) => {
        res.render('about',
            // {title: "About"}
        )
    },
    infoaromas: (req, res) => {
        res.render('infoaromas',
            // {title: "About"}
        )
    },
    errors: (req, res) => {
        console.log(`404: ${req.url}`);
        res.render('errors/404', {
            title: "Error",
            h1: "Error"
        })
    }
}

module.exports = homeController;