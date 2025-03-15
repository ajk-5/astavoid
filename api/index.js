const express = require("express");
const app = express();

// Importing route handlers
const req_commencer = require("./req_commencer.js");
const req_afficher_formulaire_inscription = require("./req_afficher_formulaire_inscription.js");
const req_inscrire = require("./req_inscrire.js");
const req_identifier = require("./req_identifier.js");
const req_check_mine = require("./req_check_mine.js");
const req_jouer = require("./req_jouer.js");
const req_rocketEnabled = require("./req_rocketEnabled.js");
const req_quitter = require("./req_quitter.js");
const req_statique = require("./req_statique.js");
const req_erreur = require("./req_erreur.js");

// Routes
app.get("/", req_commencer);
app.get("/req_commencer", req_commencer);
app.get("/req_afficher_formulaire_inscription", req_afficher_formulaire_inscription);
app.get("/req_inscrire", req_inscrire);
app.get("/req_identifier", req_identifier);
app.get("/req_check_mine", req_check_mine);
app.get("/req_jouer", req_jouer);
app.get("/req_rocketEnabled", req_rocketEnabled);
app.get("/req_quitter", req_quitter);

// Handle static files
app.use(express.static("public"));

// Catch-all for errors
app.use((req, res) => {
    req_erreur(req, res);
});

// Export the app as a serverless function
module.exports = app;
