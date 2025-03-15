const fs = require("fs");	
const nunjucks= require('nunjucks')	;
const creerGrille = require('./fonction_creer_grille.js');
const setRocket = require('./req_setRocket.js');

const trait =function(req, res, query){
    let niveau; 
    let size;     
    let marqueurs={};
    let minesCount;
    
    niveau = query.niveau;
    size = Number(query.size);
    //let rocketEnabled=query.rocketEnabled;
    
    let page = fs.readFileSync('./public/astavoid10x10.html', 'UTF-8');
	
	let contenu_grille = fs.readFileSync('grille.json', 'utf-8')
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
	//marqueurs.setRocket=setRocket(rocketEnabled);
	marqueurs.size = size;
	marqueurs.minesCount = minesCount;
	marqueurs.isTileClicked = grille.tileClicked;
	page = nunjucks.renderString(page, marqueurs);
	
	
	contenu_grille = JSON.stringify(grille);
	fs.writeFileSync('grille.json', contenu_grille, 'utf-8');

    // Easy = 10% ; Medium = 15%; Hard = 20%
    //let size = 10;
    
        
    
    //let tilesClicked;
    
    
    //let contenu_grille = fs.readFileSync("grille.json", 'utf-8');
    //console.log(contenu_grille);
    //let grille = JSON.parse(contenu_grille);

    
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end(); 
	
};
module.exports = trait;
