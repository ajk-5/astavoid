"use strict";

const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");

const trait = function (req, res, query) {

    let marqueurs;
    let page;

    // Construction du chemin absolu pour la page d'inscription
    const pageInscriptionPath = path.join(__dirname, "public", "pageInscription.html");

    // Lecture du fichier HTML
    page = fs.readFileSync(pageInscriptionPath, "utf-8");

    // Préparer les marqueurs pour Nunjucks
    marqueurs = {};
    marqueurs.erreur = "";
    marqueurs.pseudo = "";

    // Utilisation de Nunjucks pour injecter les marqueurs dans la page
    page = nunjucks.renderString(page, marqueurs);

    // Envoi de la réponse HTML
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = trait;
