let board = [];
let rows = 10;
let columns = 10;
let minesCount = 18;
let minesLocation = []; // "2x2", "3x4", "1x2"
let tilesClicked = 0; //avoid 
let rocketEnabled = false;
let gameOver = false;

window.onload = function() {
    startGame();
}

function setMines(){

    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let x = Math.floor(Math.random() * rows);
        let y = Math.floor(Math.random() * columns);
        let id = x.toString() + "x" + y.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}


function startGame() {
   
    document.getElementById("rocket").addEventListener("click", setFlag);
    setMines();

    //populate our board
    for (let x = 0; x < rows; x++) {
        let row = [];
        for (let y= 0; y < columns; y++) {
            //<div id="0x0"></div>
            let tile = document.createElement("div");
            tile.id = x.toString() + "x" + y.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
let rocketBackgroundColor;
    if (rocketEnabled==true) {
        rocketBackgroundColor = "lightgray";
    }
    else {
        rocketBackgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        
        return;
    }

    let tile = this;
    if (rocketEnabled) {
        if (tile.innerText == "") {
            tile.innerHTML = '<img src = "./assets/ajk.png" height="50"  width= "50"alt="Image" > ';
        }
        else if (tile.innerHTML = '<img src = "./assets/ajk.png" height="50" width="50" alt="Image" >') {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
       // alert("GAME OVER");
        gameOver = true;
         revealMines();
       return;
    }


    let coords = tile.id.split("x"); // "0x0" -> ["0", "0"]
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);
    checkMine(x, y);

}

function revealMines() {
 let tileHTML="";
 let tilebackgroundColor="";
    for (let x= 0; x < rows; x++) {
        for (let y = 0; y < columns; y++) {
            let tile = board[x][y];
            if (minesLocation.includes(tile.id)) {
                grille.board[y][x] = '<div><img src = "./assets/asteroid.png" height="50" width="50" alt="Image" ></div>'
                
                             
            }
        }
    }
    window.location.href="pageGagne.html";
}

function checkMine(x, y) {
    if (x < 0 || x >= rows || y < 0 || y >= columns) {
        return;
    }
    if (board[x][y].classList.includes("tile-clicked")) {
        return;
    }

    board[x][y].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    
    minesFound += checkTile(x-1, y-1);      //top left
    minesFound += checkTile(x-1, y);        //top 
    minesFound += checkTile(x-1, y+1);      //top  rightt
    minesFound += checkTile(x, y-1);        //left
    minesFound += checkTile(x, y+1);        //right
    minesFound += checkTile(x+1, y-1);      //bottom left
    minesFound += checkTile(x+1, y);        //bottom 
    minesFound += checkTile(x+1, y+1);      //bottom right

    if (minesFound > 0) {
        board[y][x].innerText = minesFound;
        board[y][x].classList.add("numOfMines" + minesFound.toString());
    }
    else {
        checkMine(x-1, y-1);    //top left
        checkMine(x-1, y);      //top
        checkMine(x-1, y+1);    //top right
        checkMine(x, y-1);      //left
        checkMine(x, y+1);      //right
        checkMine(x+1, y-1);    //bottom left
        checkMine(x+1, y);      //bottom
        checkMine(x+1, y+1);    //bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        minesCount = "Cleared";
        gameOver = true;
    }

}


function checkTile(x, y) {
    if (x< 0 || x >= rows || y < 0 || y >= columns) {
        return 0;
    }
    if (minesLocation.includes(x.toString() + "x" + y.toString())) {
        return 1;
    }
    return 0;
}
