"use strict";

const fs = require("fs");
const path = require("path"); // Import path module for resolving absolute paths
const nunjucks = require("nunjucks");

// Configure Nunjucks using an absolute path to the "public" directory
nunjucks.configure(path.join(__dirname, "public"), {
    autoescape: true,
    express: null // We'll render manually, not using Express's built-in methods
});

const trait = function (req, res) {
    let page;

    // AFFICHAGE DE LA PAGE D'ACCUEIL
    // Use an absolute path to read pageConnexion.html
    const pagePath = path.join(__dirname, "public", "pageConnexion.html");
    page = fs.readFileSync(pagePath, "utf-8");

    const marqueurs = {
        erreur: "",
        pseudo: ""
    };
    
    // Render the page with Nunjucks using the provided markers
    page = nunjucks.renderString(page, marqueurs);

    // Send the rendered page as a response
    res.status(200).send(page);
};

module.exports = trait;
