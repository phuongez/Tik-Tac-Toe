function Gameboard() {
    const rows = 3;
    const columns = 3;
    let board = [];

    const initializeBoard = () => {
        board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    };

    initializeBoard();

    const getBoard = () => board;

    const locateChoice = (row, column, player) => {
        if (board[row][column].getValue() === '') {
            board[row][column].playerMark(player);
        } else {
            return;
        }
    };

    const checkWin = (player) => {
        // Kiểm tra hàng
        for (let i = 0; i < rows; i++) {
            if (board[i][0].getValue() === player && board[i][1].getValue() === player && board[i][2].getValue() === player) {
                return true;
            }
        }
        // Kiểm tra cột
        for (let j = 0; j < columns; j++) {
            if (board[0][j].getValue() === player && board[1][j].getValue() === player && board[2][j].getValue() === player) {
                return true;
            }
        }
        // Kiểm tra đường chéo
        if (board[0][0].getValue() === player && board[1][1].getValue() === player && board[2][2].getValue() === player) {
            return true;
        }
        if (board[0][2].getValue() === player && board[1][1].getValue() === player && board[2][0].getValue() === player) {
            return true;
        }
        return false;
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    const resetBoard = () => {
        initializeBoard();
    };

    return { getBoard, locateChoice, printBoard, checkWin, resetBoard };
}


function Cell () {
    let value = '';
    const playerMark = (player) => {
        value = player;
    }
    const getValue = () => value;
    return {
        playerMark,
        getValue
    };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();
    const players = [{name:playerOneName,mark: 'X'},{name:playerTwoName,mark: 'O'}];
    const replayButton = document.querySelector('.replay');

    let activePlayer = players[0];
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0]? players[1] : players[0]
    };
    const getActivePlayer = () => activePlayer;
    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };
    const playRound = (row,column) => {
        console.log(`${getActivePlayer().name} places mark`);
        board.locateChoice(row,column,getActivePlayer().mark);
        printNewRound();
        // Check who win
        if (board.checkWin(getActivePlayer().mark)) { 
            console.log(`${getActivePlayer().name} wins!`);
            replayButton.style.display = 'block';
            
            replayButton.addEventListener('click', () => {
                board.resetBoard();
                board.printBoard();
                // replayButton.style.display = 'none';
            });
            return; // Kết thúc trò chơi 
        }
        switchPlayerTurn();
        // printNewRound();
    };
    
    printNewRound();
    
    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const replayButton = document.querySelector('.replay');
  
    const updateScreen = () => {
        boardDiv.textContent = "";
  
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
  
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
  
        // Render board squares
        board.forEach((row, position) => {
            row.forEach((cell, index) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.column = index;
                cellButton.dataset.row = position;
                cellButton.textContent = cell.getValue(); // Hiển thị giá trị của cell
                boardDiv.appendChild(cellButton);
            })
        })
    }
  
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        if (!selectedColumn || !selectedRow) return;
        
        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
  
    // Thêm sự kiện cho nút Replay
    replayButton.addEventListener("click", () => {
        game.getBoard().forEach((row) => row.forEach((cell) => cell.playerMark(''))); // Xóa dấu cũ
        updateScreen(); // Cập nhật giao diện
        replayButton.style.display = "none"; // Ẩn nút Replay
    });
  
    updateScreen();
}

  
  ScreenController();