const tictactoeGame = (function () {
    const size = 3;
    const gameBoard = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    const resetBoard = function() {
        for (let i = 0; i < gameBoard.length; i++) { 
            for (let j = 0; j < gameBoard[i].length; j++) { 
                gameBoard[i][j] = "";
        }};
    };

    const markPosition = function(row, column, piece) {
        gameBoard[row][column] = piece;
    };

    const checkGameOver = function() {        
        //Check Rows
        for(let i = 0; i < gameBoard.length; i++) {
            let rowIsComplete = true;
            let allEqual = gameBoard[i].every(x => x === gameBoard[i][0] && gameBoard[i][0] != "");

            if (allEqual)
                return {won: true, draw: false, piece: gameBoard[i][0]};
        }
        //Check columns
        for (let columnIndex = 0; columnIndex < gameBoard.length; columnIndex++) {
            const column = [];
            for (let i = 0; i < gameBoard.length; i++) { 
                column.push(gameBoard[i][columnIndex]);
            }

            if (column.every(x => x === column[0] && column[0] != ""))
                return {won: true, draw: false, piece: column[0]};
        }



        //Check diagonals
        const iterator = 0;
        diagonal = [];
        for(let i = 0; i < gameBoard.length; i++) {
            diagonal.push(gameBoard[i][i]);
        }

        if (diagonal.every(x => x === diagonal[0] && diagonal[0] != ""))
            return {won: true, draw: false, piece: diagonal[0]};

        diagonal = [];
        let boardLength = gameBoard.length;
        for (let i = gameBoard.length - 1; i >= 0; i--) {
            diagonal.push(gameBoard[i][boardLength - 1 - i]);
        }

        if (diagonal.every(x => x === diagonal[0] && diagonal[0] != ""))
            return {won: true, draw: false, piece: diagonal[0]};

        let flatGameBoard = gameBoard.flat();
        if (flatGameBoard.every(x => x != ""))
            return {won: false, draw: true, piece: ""};

        return {won: false, draw: false, piece: ""};
    };

    const get2DCoordinates = function (oneDIndex) {
        const row = Math.floor(oneDIndex / size);
        const col = oneDIndex % size;
        return { row, col };
    };
    
    return {gameBoard, markPosition, checkGameOver, resetBoard, get2DCoordinates}
})();

const createPlayer = ({playerName, score, marker}) => ({
    playerName,
    score : score,
    marker,
    giveScore() {this.score++;},
    getScore() {return this.score; },
    getMarker() {return this.marker;},
});

const gameLoop = (function() {
    //init game, clear board
    tictactoeGame.resetBoard();

    const playerNameInput = document.getElementById("player-name");
    const startButton = document.getElementById("startButton");
    const resetButton = document.getElementById("resetButton");
    startButton.addEventListener("click", handleStartButton);
    resetButton.addEventListener("click", handleResetButton);
    let gameStarted = false;

    function handleStartButton() {
        tictactoeGame.resetBoard();
        humanPlayer.score = 0;
        computerPlayer.score = 0;
        humanPlayer.name = playerNameInput.value;
        startGame();
    }

    function handleResetButton() {
        tictactoeGame.resetBoard();
        humanPlayer.score = 0;
        computerPlayer.score = 0;
        humanPlayer.name = playerNameInput.value;
        displayController.refreshDisplay();
    }


    const startGame = function() {
        if (gameStarted)
            return;

        for(displaySquare of displayController.displaySquares) {
            displaySquare.addEventListener("click", handlePlayerClick);
        }

        gameStarted = true;
    };

    function handlePlayerClick(event) {
        const element = event.target;
        const parentElement = element.parentElement;
        const children = parentElement.children;
        const childrenArray = Array.from(children);
        const index = childrenArray.indexOf(element);

        const coordinates = tictactoeGame.get2DCoordinates(index);
        const currentSquareVal = tictactoeGame.gameBoard[coordinates.row][coordinates.col];

        if (currentSquareVal !== "")
            return;

        
        tictactoeGame.markPosition(coordinates.row, coordinates.col, "X");
        
        
        if (!CheckGameOver())
            computerSelect();
    };

    function CheckGameOver() {
        let result = tictactoeGame.checkGameOver();

        if (result.draw) {
            tictactoeGame.resetBoard();
            displayController.refreshDisplay();
            return true;
        }

        if (result.won) {
            if (result.piece == "X")
                humanPlayer.giveScore();
            else
                computerPlayer.giveScore();

            tictactoeGame.resetBoard();
            displayController.refreshDisplay();
            return true;
        }

        return false;
    }

    function computerSelect() {
        let emptyCoords = [];
        for(let i = 0; i < tictactoeGame.gameBoard.length; i++) {
            for (let j = 0; j < tictactoeGame.gameBoard[i].length; j++) {
                if (tictactoeGame.gameBoard[i][j] == "")
                    emptyCoords.push({row: i, col: j});
            }
        }

        let randomIndex = Math.floor(Math.random() * ((emptyCoords.length - 1) - 0 + 1)) + 0;
        
        tictactoeGame.markPosition(emptyCoords[randomIndex].row, emptyCoords[randomIndex].col, "O");
        displayController.refreshDisplay();

        CheckGameOver();
    };
    
    return {startGame};
}())

const displayController = (function () {
    const displaySquares = document.querySelectorAll(".gameSquare");
    const playerScore = document.querySelector(".human-score");
    const computerScore = document.querySelector(".computer-score");

    const refreshDisplay = function() {
        let flatGameSquares = tictactoeGame.gameBoard.flat();

        for (let i = 0; i < flatGameSquares.length; i++) {
            displaySquares[i].firstElementChild.textContent = flatGameSquares[i];
        }

        playerScore.textContent = `${humanPlayer.name} Score - ${humanPlayer.getScore()}`;
        computerScore.textContent = `Computer Score - ${computerPlayer.getScore()}`;
    };

    return {refreshDisplay, displaySquares};
}())


const humanPlayer = createPlayer({name: "Human", score: 0, marker: "X"});
const computerPlayer = createPlayer({name: "Computer", score: 0, marker: "X"});

gameLoop.startGame();

console.log(tictactoeGame.gameBoard);