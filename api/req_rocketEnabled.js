
const fs=require("fs");
const nunjucks= require("nunjucks");

const trait = function (req, res, query) {

    
    let marqueurs={};
    let board;
    let rocketEnabled;
    let x;
    let y;
    
    
    function parseBool(val)
{
    if (val === 'true'){
        return true;
        }
    else{
    return false;
}
}
    
    	
    
    let contenu_grille = fs.readFileSync("grille.json", 'utf-8');
    console.log(contenu_grille);
    let grille = JSON.parse(contenu_grille);
    
    

    let page= fs.readFileSync('./public/astavoid10x10.html', 'utf-8');


    marqueurs.board = grille.board;
    let gameOver;
    marqueurs.gameOver=grille.gameOver
    marqueurs.isTileClicked = grille.tileClicked;
    marqueurs.size = grille.size;
    marqueurs.minesCount = grille.minesCount;
    
    console.log(query.rocketEnabled);
    
    grille.rocketEnabled = parseBool(query.rocketEnabled);
    let isRocketEnabled;
    marqueurs.isRocketEnabled = grille.rocketEnabled 
    let rocketBackgroundColor;
    
    //marqueurs.numofMines= numMines;
     
    page = nunjucks.renderString(page, marqueurs);
    
    contenu_grille = JSON.stringify(grille);
    fs.writeFileSync('grille.json', contenu_grille, 'utf-8');
 
    res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end(); 
 };
module.exports = trait;
