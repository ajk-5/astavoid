const fs = require("fs");
const nunjucks = require("nunjucks");

// Utility function to parse boolean from string
const parseBool = (val) => val === 'true';

// Reveals all mines when game ends
const revealMines = (grille) => {
    for (let y = 0; y < grille.size; y++) {
        for (let x = 0; x < grille.size; x++) {
            if (grille.board[y][x] === "m") {
                grille.tileClicked[y][x] = true;
            }
        }
    }
    return grille;
};

// Checks if a position contains a mine
const checkBoard = (x, y, grille) => {
    if (x < 0 || x >= grille.size || y < 0 || y >= grille.size) return 0;
    return grille.board[y][x] === 'm' ? 1 : 0;
};

// Handles tile revealing logic with flood-fill
const checkMine = (x, y, grille) => {
    // Early returns for invalid cases
    if (grille.gameOver || 
        x < 0 || x >= grille.size || 
        y < 0 || y >= grille.size || 
        grille.tileClicked[y][x]) {
        return 0;
    }

    if (grille.board[y][x] === 'm') return 0;

    grille.tileClicked[y][x] = true;
    grille.numClickedTiles = (grille.numClickedTiles || 0) + 1;

    let minesFound = 0;
    // Check all adjacent tiles
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            minesFound += checkBoard(x + dx, y + dy, grille);
        }
    }

    if (minesFound > 0) {
        grille.board[y][x] = minesFound;
    } else {
        grille.board[y][x] = '';
        // Recursively check surrounding tiles
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                checkMine(x + dx, y + dy, grille);
            }
        }
    }

    return minesFound;
};

// Main request handler
const trait = (req, res, query) => {
    try {
        // Validate coordinates
        const x = Number(query.x);
        const y = Number(query.y);
        if (isNaN(x) || isNaN(y)) {
            res.status(400).send("Invalid coordinates");
            return;
        }

        // Load game state
        const grilleData = fs.readFileSync("grille.json", 'utf-8');
        const grille = JSON.parse(grilleData);
        
        // Validate board boundaries
        if (x >= grille.size || y >= grille.size || x < 0 || y < 0) {
            res.status(400).send("Coordinates out of bounds");
            return;
        }

        // Load appropriate page
        let page = fs.readFileSync('./public/astavoid10x10.html', 'utf-8');
        const marqueurs = {};

        // Handle rocket feature
        grille.rocketEnabled = parseBool(query.rocketEnabled);
        
        if (grille.rocketEnabled && !grille.tileClicked[y][x]) {
            if (grille.board[y][x] === 0 || grille.board[y][x] === '') {
                grille.board[y][x] = '<img src="./assets/ajk.png">';
            } else if (grille.board[y][x].includes('ajk.png')) {
                grille.board[y][x] = '';
            }
        } else {
            // Normal game logic
            if (grille.board[y][x] === 'm') {
                grille.tileClicked[y][x] = true;
                revealMines(grille);
                grille.gameOver = true;
            } else {
                checkMine(x, y, grille);
            }
        }

        // Calculate remaining tiles and check win condition
        const totalTiles = Math.pow(grille.size, 2);
        const tilesLeft = totalTiles - grille.minesCount - (grille.numClickedTiles || 0);
        
        if (tilesLeft === 0 && !grille.gameOver) {
            page = fs.readFileSync('./public/pageGagne.html', 'utf-8');
            grille.gameOver = true;
        }

        // Prepare template markers
        marqueurs.remainingTiles = tilesLeft;
        marqueurs.board = grille.board;
        marqueurs.gameOver = grille.gameOver;
        marqueurs.isTileClicked = grille.tileClicked;
        marqueurs.size = grille.size;
        marqueurs.minesCount = grille.minesCount;
        marqueurs.isRocketEnabled = grille.rocketEnabled;

        // Render page and save state
        page = nunjucks.renderString(page, marqueurs);
        fs.writeFileSync('grille.json', JSON.stringify(grille), 'utf-8');

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(page);

    } catch (error) {
        console.error('Error in trait:', error);
        res.status(500).send(`Server error: ${error.message}`);
    }
};

// Example initial grille structure (for reference)
/*
{
    size: 10,
    minesCount: 10,
    board: [[]], // 2D array with 'm' for mines, numbers, or ''
    tileClicked: [[]], // 2D boolean array
    numClickedTiles: 0,
    gameOver: false,
    rocketEnabled: false
}
*/

module.exports = trait;