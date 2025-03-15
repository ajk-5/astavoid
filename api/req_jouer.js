"use strict";

const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");
const creerGrille = require("./fonction_creer_grille.js");
// const setRocket = require("./req_setRocket.js");

// Configure Nunjucks with an absolute path to the "public" directory
nunjucks.configure(path.join(__dirname, "public"), {
    autoescape: true,
    express: null
});

const trait = function (req, res) {
    const query = req.query;

    // Ensure that query parameters are valid
    const niveau = query.niveau || "facile"; // Default to "facile" if not provided
    const size = Number(query.size) || 10; // Default to 10 if not provided

    let minesCount;
    let grille = { board: [], tileClicked: [] };

    // Set mine difficulty coefficient based on level
    let coeff;
    if (niveau === "facile") {
        coeff = 0.1;
    } else if (niveau === "intermediaire") {
        coeff = 0.15;
    } else if (niveau === "difficile") {
        coeff = 0.2;
    } else {
        coeff = 0.1; // Default to "facile" if niveau is invalid
    }

    minesCount = Math.round(size * size * coeff);
    grille.minesCount = minesCount;

    // Generate board
    grille.board = creerGrille(grille, size, minesCount);

    // Path to game page template
    const pagePath = path.join(__dirname, "public", "astavoid10x10.html");

    // Check if the file exists before reading
    if (!fs.existsSync(pagePath)) {
        res.status(500).send("Error: Game page template not found.");
        return;
    }

    // Prepare Nunjucks template markers
    const marqueurs = {
        board: grille.board,
        size: size,
        minesCount: minesCount,
        isTileClicked: grille.tileClicked,
    };

    // Render the HTML page with Nunjucks
    const page = nunjucks.render(pagePath, marqueurs);

    // Save the grid to a JSON file
    const grillePath = path.join(__dirname, "grille.json");
    fs.writeFileSync(grillePath, JSON.stringify(grille), "utf-8");

    // Send the response
    res.status(200).send(page);
};

module.exports = trait;
