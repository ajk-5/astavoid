"use strict";

const fs = require("fs");
const path = require("path"); // Import path module for resolving absolute paths
const nunjucks = require("nunjucks");
// const creerGrille = require("./fonction_creer_grille.js");
// const req_check_mine = require('./req_check_mine.js');

// Configure Nunjucks to use the "public" directory
nunjucks.configure(path.join(__dirname, "public"), {
    autoescape: true,
    express: null
});

const trait = function (req, res) {
    let marqueurs;
    let page;
    let contenu_fichier;
    let listeMembres;
    let i;
    let trouve;

    // In Express, form data comes in req.body for POST requests
    const query = req.body;

    // Read the members file (membres.json) using an absolute path
    const membresPath = path.join(__dirname, "membres.json");
    contenu_fichier = fs.readFileSync(membresPath, "utf-8");
    listeMembres = JSON.parse(contenu_fichier);

    // Verify that the pseudo and password exist
    trouve = false;
    i = 0;
    while (i < listeMembres.length && trouve === false) {
        if (listeMembres[i].pseudo === query.pseudo) {
            if (listeMembres[i].password === query.password) {
                trouve = true;
            }
        }
        i++;
    }

    // Return an HTML page
    if (trouve === false) {
        // If identification fails, re-display the login page with an error message
        const connexionPath = path.join(__dirname, "public", "pageConnexion.html");
        page = fs.readFileSync(connexionPath, "utf-8");

        marqueurs = {};
        marqueurs.erreur = "ERREUR : compte ou mot de passe incorrect";
        marqueurs.pseudo = query.pseudo;
        page = nunjucks.renderString(page, marqueurs);

    } else {
        // If identification is successful, send the member's menu page
        const menuPath = path.join(__dirname, "public", "page_menu.html");
        page = fs.readFileSync(menuPath, "utf-8");
        
        marqueurs = {};
        marqueurs.pseudo = query.pseudo;
        // Uncomment and modify the following lines as needed for additional functionality
        // marqueurs.board = creerGrille(grille);
        // marqueurs.size = 10;
        // marqueurs.minesCount = Math.round(Math.pow(marqueurs.size, 2) * coeff);
        // marqueurs.isTileClicked = grille.isTileClicked
        page = nunjucks.renderString(page, marqueurs);
    }

    // Send the rendered page back as a response
    res.status(200).send(page);
};

module.exports = trait;
