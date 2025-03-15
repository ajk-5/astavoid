"use strict";

const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");

// Configure Nunjucks
nunjucks.configure(path.join(__dirname, "public"), {
    autoescape: true,
    express: null
});

// Utility function to parse boolean from string
const parseBool = (val) => val === "true";

// Reveals all mines when the game ends
const revealMines = (grille) => {
    for (let y = 0; y < grille.size; y++) {
        for (let x = 0; x < grille.size; x++) {
            if (grille.board[y][x] === "m") {
                grille.tileClicked[y][x] = true;
            }
        }
    }
};

// Checks if a position contains a mine
const checkBoard = (x, y, grille) => {
    if (x < 0 || x >= grille.size || y < 0 || y >= grille.size) return 0;
    return grille.board[y][x] === "m" ? 1 : 0;
};

// Optimized function to reveal safe tiles (BFS instead of recursion)
const checkMine = (x, y, grille) => {
    if (grille.gameOver || grille.tileClicked[y][x] || grille.board[y][x] === "m") return;

    const queue = [[x, y]];
    while (queue.length > 0) {
        const [cx, cy] = queue.shift();

        if (cx < 0 || cx >= grille.size || cy < 0 || cy >= grille.size || grille.tileClicked[cy][cx]) continue;

        grille.tileClicked[cy][cx] = true;
        grille.numClickedTiles = (grille.numClickedTiles || 0) + 1;

        let minesFound = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                minesFound += checkBoard(cx + dx, cy + dy, grille);
            }
        }

        grille.board[cy][cx] = minesFound > 0 ? minesFound : "";

        if (minesFound === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    queue.push([cx + dx, cy + dy]);
                }
            }
        }
    }
};

// Main request handler
const trait = (req, res) => {
    try {
        const query = req.query;

        // Validate and parse query parameters
        const x = Number(query.x);
        const y = Number(query.y);
        if (isNaN(x) || isNaN(y)) {
            return res.status(400).send("Invalid coordinates");
        }

        // Load game state
        const grillePath = path.join(__dirname, "grille.json");
        let grille;
        
        try {
            // Check if file exists
            if (fs.existsSync(grillePath)) {
                grille = JSON.parse(fs.readFileSync(grillePath, "utf-8"));
            } else {
                // Initialize a new grille if file doesn't exist
                grille = {
                    size: 10,
                    minesCount: 10,
                    board: [],
                    tileClicked: [],
                    gameOver: false,
                    rocketEnabled: false,
                    numClickedTiles: 0
                };
                
                // Initialize arrays
                for (let y = 0; y < grille.size; y++) {
                    grille.board[y] = [];
                    grille.tileClicked[y] = [];
                    for (let x = 0; x < grille.size; x++) {
                        grille.board[y][x] = "";
                        grille.tileClicked[y][x] = false;
                    }
                }
                
                // Save the new grille
                fs.writeFileSync(grillePath, JSON.stringify(grille), "utf-8");
            }
            
            // Validate grille structure
            if (!grille || !Array.isArray(grille.board) || grille.board.length === 0) {
                throw new Error("Invalid grille structure");
            }
            
            // Initialize missing properties if needed
            grille.numClickedTiles = grille.numClickedTiles || 0;
            grille.gameOver = grille.gameOver || false;
            
            // Ensure tileClicked array exists and has correct dimensions
            if (!Array.isArray(grille.tileClicked) || grille.tileClicked.length !== grille.size) {
                grille.tileClicked = Array(grille.size).fill().map(() => Array(grille.size).fill(false));
            }
            
            // Make sure board has correct dimensions
            if (grille.board.length !== grille.size) {
                throw new Error("Board size mismatch");
            }
            
            // Make sure each row has the correct length
            for (let y = 0; y < grille.size; y++) {
                if (!Array.isArray(grille.board[y]) || grille.board[y].length !== grille.size) {
                    throw new Error(`Invalid board row at index ${y}`);
                }
            }
            
        } catch (err) {
            console.error("Error loading grille:", err);
            return res.status(500).send("Error loading game state");
        }

        if (x >= grille.size || y >= grille.size || x < 0 || y < 0) {
            return res.status(400).send("Coordinates out of bounds");
        }

        let pagePath = path.join(__dirname, "public", "astavoid10x10.html");

        // Handle rocket feature
        grille.rocketEnabled = parseBool(query.rocketEnabled || "false");
        
        if (grille.rocketEnabled && !grille.tileClicked[y][x]) {
            grille.board[y][x] = grille.board[y][x] === "" ? '<img src="./assets/ajk.png">' : "";
        } else {
            // Normal game logic
            if (grille.board[y][x] === "m") {
                grille.tileClicked[y][x] = true;
                revealMines(grille);
                grille.gameOver = true;
            } else {
                checkMine(x, y, grille);
            }
        }

        // Check win condition
        const totalTiles = grille.size * grille.size;
        const tilesLeft = totalTiles - grille.minesCount - (grille.numClickedTiles || 0);
        if (tilesLeft === 0 && !grille.gameOver) {
            pagePath = path.join(__dirname, "public", "pageGagne.html");
            grille.gameOver = true;
        }

        // Prepare template markers
        const marqueurs = {
            remainingTiles: tilesLeft,
            board: grille.board,
            gameOver: grille.gameOver,
            isTileClicked: grille.tileClicked,
            size: grille.size,
            minesCount: grille.minesCount,
            isRocketEnabled: grille.rocketEnabled,
        };

        // Render the page
        const page = nunjucks.render(pagePath, marqueurs);

        // Save updated game state
        fs.writeFileSync(grillePath, JSON.stringify(grille), "utf-8");

        return res.status(200).send(page);

    } catch (error) {
        console.error("Error in trait:", error);
        return res.status(500).send(`Server error: ${error.message}`);
    }
};

module.exports = trait;