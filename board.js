class GameBoard {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.board = this.createBoard();
    }

    createBoard() {
        const board = [];
        for (let i = 0; i < this.rows; i++) {
            board[i] = [];
            for (let j = 0; j < this.cols; j++) {
                // Crie uma célula vazia, você pode personalizá-la de acordo com o jogo
                board[i][j] = {};
            }
        }
        return board;
    }

    renderBoard() {
        const boardContainer = document.getElementById('game-board');
        boardContainer.style.gridTemplateColumns = `repeat(${this.cols}, 80px)`;
        boardContainer.innerHTML = ''; // Limpe o conteúdo anterior

        this.board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                // Personalize o estilo da célula e o conteúdo conforme necessário
                cellElement.textContent = cell.value;
                boardContainer.appendChild(cellElement);
            });
        });
    }
}

const gameBoard = new GameBoard(6, 5);
gameBoard.renderBoard();
