"use strict";

const fs = require("fs");
const path = require("path");
const url = require("url");
const nunjucks = require("nunjucks");

const req_statique = function (req, res, query) {

    let page;
    let type;
    let sousType;
    // Extract the pathname from the URL, e.g. "/styles/pageInscription.css"
    let file = url.parse(req.url).pathname;

    // Construct the absolute path to the requested file
    // Instead of using string concatenation, use path.join for robustness
    file = path.join(__dirname, file);

    // Adjust the MIME type based on the file extension
    let extname = path.extname(file);
    if (extname === ".html") {
        type = 'text';
        sousType = 'html';
    } else if (extname === ".css") {
        type = 'text';
        sousType = 'css';
    } else if (extname === ".js") {
        type = 'text';
        sousType = 'javascript';
    } else if (extname === ".jpg" || extname === ".jpeg") {
        type = 'image';
        sousType = 'jpeg';
    } else if (extname === ".gif") {
        type = 'image';
        sousType = 'gif';
    } else if (extname === ".png") {
        type = 'image';
        sousType = 'png';
    } else if (extname === ".mp3") {
        type = 'audio';
        sousType = 'mpeg';
    } else {
        // If the extension is not recognized, you might want to default to a binary stream
        type = 'application';
        sousType = 'octet-stream';
    }

    // Send the header with the appropriate content-type then the file content.
    // If the file does not exist, catch the error and send a 404 response.
    try {
        page = fs.readFileSync(file);
        res.writeHead(200, { 'Content-Type': `${type}/${sousType}` });
        res.write(page);
        res.end();
    } catch (e) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('ERREUR 404 : ' + file + ' fichier non trouvé');
        res.end();
    }
};

module.exports = req_statique;
