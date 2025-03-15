const fs = require("fs");
const nunjucks = require('nunjucks');
const creerGrille = require('./fonction_creer_grille.js');
const setRocket = require('./req_setRocket.js');

// Configure Nunjucks
nunjucks.configure('public', {
    autoescape: true,
    express: null
});

const trait = function(req, res) {
    // In Express, query parameters are in req.query
    const query = req.query;
    
    let niveau; 
    let size;     
    let marqueurs = {};
    let minesCount;
    
    niveau = query.niveau;
    size = Number(query.size);
    //let rocketEnabled = query.rocketEnabled;
    
    let page = fs.readFileSync('./public/astavoid10x10.html', 'UTF-8');
    
    let contenu_grille = fs.readFileSync('grille.json', 'utf-8');
    let grille = JSON.parse(contenu_grille);
    
    grille = {};
    grille.board = [];
    grille.tileClicked = [];
    
    let coeff;
    if (niveau === 'facile') {
        coeff = 0.1;
    } else if (niveau === 'intermediaire') {
        coeff = 0.15;
    } else if (niveau === 'difficile') {
        coeff = 0.2;
    }
    
    let rows, columns;
    rows = columns = size;
    minesCount = Math.round(Math.pow(size, 2) * coeff);
    grille.minesCount = minesCount;
    
    marqueurs = {};
    marqueurs.board = creerGrille(grille, size, minesCount);
    //marqueurs.setRocket = setRocket(rocketEnabled);
    marqueurs.size = size;
    marqueurs.minesCount = minesCount;
    marqueurs.isTileClicked = grille.tileClicked;
    
    page = nunjucks.renderString(page, marqueurs);
    
    contenu_grille = JSON.stringify(grille);
    fs.writeFileSync('grille.json', contenu_grille, 'utf-8');

    // Using Express's response methods
    res.status(200).send(page);
};

module.exports = trait;