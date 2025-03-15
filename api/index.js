const express = require("express");
const app = express();
const port = 5001;

// Import route handlers
const req_commencer = require("./req_commencer.js");
const req_afficher_formulaire_inscription = require("./req_afficher_formulaire_inscription.js");
const req_inscrire = require("./req_inscrire.js");
const req_identifier = require("./req_identifier.js");
const req_check_mine = require("./req_check_mine.js");
const req_jouer = require('./req_jouer.js');
const req_rocketEnabled = require('./req_rocketEnabled.js');
const req_quitter = require('./req_quitter.js');
const req_erreur = require("./req_erreur.js");

// Middleware for parsing URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing JSON bodies
app.use(express.json());

// Serve static files from a 'public' directory
app.use(express.static('public'));

// Set up error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    req_erreur(req, res, {});
});

// Routes
app.get('/', req_commencer);
app.get('/req_commencer', req_commencer);
app.get('/req_afficher_formulaire_inscription', req_afficher_formulaire_inscription);
app.post('/req_inscrire', req_inscrire);
app.post('/req_identifier', req_identifier);
app.get('/req_check_mine', req_check_mine);
app.get('/req_jouer', req_jouer);
app.get('/req_quitter', req_quitter);
app.get('/req_rocketEnabled', req_rocketEnabled);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});