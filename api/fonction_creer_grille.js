function creerGrille(grille, size, minesCount) {
    // Initialize grille object if it doesn't exist
    if (!grille) {
        grille = {};
    }
    
    // Set size and minesCount
    grille.size = size;
    grille.minesCount = minesCount;
    
    // Initialize arrays
    grille.board = [];
    grille.tileClicked = [];
    
    // Generate mine locations
    let minesLocation = [];  
    let minesLeft = minesCount;
    
    while (minesLeft > 0) { 
        let x = Math.floor(Math.random() * size);
        let y = Math.floor(Math.random() * size);
        
        // Check if this location already has a mine
        let found = false;
        for (let loc of minesLocation) {
            if (loc.x === x && loc.y === y) {
                found = true;
                break;
            }   
        }
        
        if (!found) {
             minesLocation.push({x, y});
             minesLeft--;
        }   
    }

    // Initialize the board and tileClicked arrays
    for (let y = 0; y < size; y++) {
        grille.tileClicked[y] = [];
        grille.board[y] = [];
        for (let x = 0; x < size; x++) {
            grille.tileClicked[y][x] = false;
            grille.board[y][x] = "";  // Initialize with empty string instead of 0
            
            // Check if this position has a mine
            for (let mine of minesLocation) {
                if (y === mine.y && x === mine.x) {
                    grille.board[y][x] = 'm';
                    break;
                }  
            }   
        }       
    }
    
    // Set other properties
    grille.rocketEnabled = false;
    grille.gameOver = false;
    grille.numClickedTiles = 0;
    
    return grille;
}

module.exports = creerGrille;