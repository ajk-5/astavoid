
function creerGrille(grille, size, minesCount) {
    
        
    let istileClicked;
    let minesLocation = [];  
    let minesLeft = minesCount;
    
    grille.size = size;
    
    
    while (minesLeft > 0) { 
        let x = Math.floor(Math.random() * size);
        let y = Math.floor(Math.random() * size);
        let location = {x: x, y: y};

        let found = false;
        for (let loc of minesLocation) {
            if (loc.x === x && loc.y === y){
                found = true;
                break;
            }   
        }
        
        if (!found) {
             minesLocation.push(location);
             minesLeft--;
        }   
    }

    

    
    for (let y = 0; y < size; y++) {
        grille.tileClicked[y] = [];
        grille.board[y] = [];
        for (let x = 0; x < size; x++) {
            grille.tileClicked[y][x] = false;
            grille.board[y][x] = 0;
            grille.rocketEnabled= false;
            grille.gameOver= false;
            grille.numClickedTiles=0;
            for (let mine of minesLocation) {
                if (y === mine.y && x === mine.x) {
                    grille.board[y][x] = 'm';
                }  
            }   
        }       
    }   
    
       
 
 };
    module.exports = creerGrille;
    
