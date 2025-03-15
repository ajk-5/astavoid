const fs = require('fs');
let board={};
let table=[];
Gameboard=board.table

board.table=11;
Gameboard=7;

page=JSON.stringify(board);
fs.writeFileSync('abc.json',page,'utf-8')