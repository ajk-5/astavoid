"use strict";
let fs = require('fs');
let nunjucks= require('nunjucks');

const treat=function(req,res,query){
   let page=fs.readFileSync('./public/tic_tac_tole.html','utf-8')
   let board_content=fs.readFileSync('TTTboard.json','utf-8')

   let board=JSON.parse(board_content);
   
   
   let marker={};
   let player1;
   let player2;

   let gameboard=board.board;
   let turn=board.turn;
   let boardSize=board.size;
   //creating a board
   boardSize=query.size

   for(let y=0; y<size; y++){
        for(let x=0; x<size; x++){
          gameboard[y][x]='0'
        }
   }
   if (player1=="computer" || player2=="computer" ){
    


    

   }
}