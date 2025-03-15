const express = require("express");
const path = require("path");
const app = express();

// Import route handlers
const req_commencer = require("./req_commencer.js");
const req_afficher_formulaire_inscription = require("./req_afficher_formulaire_inscription.js");
const req_inscrire = require("./req_inscrire.js");
const req_identifier = require("./req_identifier.js");
const req_check_mine = require("./req_check_mine.js");
const req_jouer = require('./req_jouer.js');
const req_rocketEnabled = require('./req_rocketEnabled.js');
const req_quitter = require('./req_quitter.js');

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../api/public')));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Server error occurred');
});

// For Vercel serverless functions
module.exports = app;

// If running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}