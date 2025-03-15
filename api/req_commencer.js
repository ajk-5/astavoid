// Traitement de "req_commencer"

"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");

// Configure Nunjucks
nunjucks.configure('public', {
    autoescape: true,
    express: null // We'll render manually, not using Express's built-in methods
});

const trait = function (req, res) {
    let page;

    // AFFICHAGE DE LA PAGE D'ACCUEIL
    page = fs.readFileSync('./public/pageConnexion.html', 'utf-8');

    const marqueurs = {
        erreur: "",
        pseudo: ""
    };
    
    page = nunjucks.renderString(page, marqueurs);

    // Using Express's response methods
    res.status(200).send(page);
};

module.exports = trait;