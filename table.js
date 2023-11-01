class GameBoard {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.board = [];
        this.initBoard();
    }

    initBoard() {
        const boardElement = document.getElementById('board');
        boardElement.style.gridTemplateColumns = repeat('${this.cols}, 65px'); // Definindo o tamanho das colunas
        boardElement.style.gridTemplateRows = repeat('${this.rows}, 70px'); // Definindo o tamanho das linhas

        for (let i = 0; i < this.rows; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = 0; // 0 representa uma célula vazia
            }
        }

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                boardElement.appendChild(cell);
            }
        }
    }
}
const board = new GameBoard(6, 5);
