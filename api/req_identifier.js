// Traitement de "req_identifier"

"use strict";

const fs = require("fs");
const nunjucks = require("nunjucks");
//const creerGrille = require("./fonction_creer_grille.js");
//const req_check_mine=require('./req_check_mine.js');

// Configure Nunjucks
nunjucks.configure('public', {
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

    // ON LIT LES COMPTES EXISTANTS
    contenu_fichier = fs.readFileSync("membres.json", 'utf-8');
    listeMembres = JSON.parse(contenu_fichier);

    // ON VERIFIE QUE LE PSEUDO/PASSWORD EXISTE
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

    // ON RENVOIT UNE PAGE HTML 
    if (trouve === false) {
        // SI IDENTIFICATION INCORRECTE, ON REAFFICHE PAGE ACCUEIL AVEC ERREUR
        page = fs.readFileSync('./public/pageConnexion.html', 'utf-8');

        marqueurs = {};
        marqueurs.erreur = "ERREUR : compte ou mot de passe incorrect";
        marqueurs.pseudo = query.pseudo;
        page = nunjucks.renderString(page, marqueurs);

    } else {
        // SI IDENTIFICATION OK, ON ENVOIE PAGE ACCUEIL MEMBRE
        page = fs.readFileSync('./public/page_menu.html', 'UTF-8');
        
        //let contenu_grille = fs.readFileSync('grille.json', 'utf-8')
        //let grille = JSON.parse(contenu_grille);

        //let niveau = 'intermediaire';
        
        //let coeff;
        //if (niveau === 'facile') {
            //coeff = 0.1;
        //} else if (niveau === 'intermediaire') {
            //coeff = 0.15;
        //} else if (niveau === 'dificile') {
            //coeff = 0.2;
        //}
        
        marqueurs = {};
        marqueurs.pseudo = query.pseudo;
        //marqueurs.board = creerGrille(grille);
        //marqueurs.size = 10;
        //marqueurs.minesCount = Math.round(Math.pow(marqueurs.size, 2) * coeff);
        //marqueurs.isTileClicked = grille.isTileClicked
        page = nunjucks.renderString(page, marqueurs);
        
        //contenu_grille = JSON.stringify(grille);
        //fs.writeFileSync('grille.json', contenu_grille, 'utf-8');
    }

    // Using Express's response methods
    res.status(200).send(page);
};

module.exports = trait;