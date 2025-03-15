const fs = require('fs');
const nunjucks=require('nunjucks');
const trait =function(req, res, query){
    let marqueurs={};  
    
    let page = fs.readFileSync('./public/pagePerdu.html', 'UTF-8');
	arreter=`<a href="localhost:5001/"> </a>`

    marqueurs.arreter= arreter;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end(); 
	
};
module.exports = trait;
