"use strict";

const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");

const trait = function (req, res, query) {

    let marqueurs;
    let page;
    let nouveauMembre;
    let contenu_fichier;
    let listeMembres;
    let i;
    let trouve;

    // LIT LES COMPTES EXISTANTS
    const membresPath = path.join(__dirname, "membres.json");
    contenu_fichier = fs.readFileSync(membresPath, "utf-8");
    listeMembres = JSON.parse(contenu_fichier);

    // VÉRIFIE QUE LE COMPTE N'EXISTE PAS DÉJÀ
    trouve = false;
    i = 0;
    while (i < listeMembres.length && trouve === false) {
        if (listeMembres[i].pseudo === query.pseudo) {
            trouve = true;
        }
        i++;
    }

    // SI LE COMPTE N'EXISTE PAS, ON AJOUTE LE NOUVEAU COMPTE
    if (trouve === false) {
        nouveauMembre = {
            pseudo: query.pseudo,
            password: query.password
        };
        listeMembres.push(nouveauMembre);

        contenu_fichier = JSON.stringify(listeMembres);
        fs.writeFileSync(membresPath, contenu_fichier, "utf-8");
    }

    // ENVOIE D'UNE PAGE HTML EN FONCTION DU RÉSULTAT
    if (trouve === true) {
        // SI LE COMPTE EXISTE DÉJÀ, ON RENVOIE LA PAGE D'INSCRIPTION AVEC UNE ERREUR
        const pageInscriptionPath = path.join(__dirname, "public", "pageInscription.html");
        page = fs.readFileSync(pageInscriptionPath, "utf-8");

        marqueurs = {
            erreur: "<strong>ERREUR</strong> : ce compte existe déjà",
            pseudo: query.pseudo
        };
        page = nunjucks.renderString(page, marqueurs);
    } else {
        // SI LE COMPTE EST CRÉÉ, ON RENVOIE LA PAGE DE CONFIRMATION
        const pageConfirmationPath = path.join(__dirname, "public", "pageConfirmation.html");
        page = fs.readFileSync(pageConfirmationPath, "utf-8");

        marqueurs = {
            pseudo: query.pseudo,
            password: query.password
        };
        page = nunjucks.renderString(page, marqueurs);
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(page);
    res.end();
};

module.exports = trait;

