export class Board {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.cells = Array.from(
            { length: rows },
            () => Array(cols).fill(null)
        );
    }
}

export class Piece {
    constructor(actual_position, last_position) {
        this.actual_position = actual_position;
        this.last_position = last_position;
        this.quantity = 12;
    }
}

export class Player {
    constructor(name, Piece, isBot = false) {
        this.name = name;
        this.piece = Piece;
        this.isBot = isBot;
    }
}

export class DaraGame {
    constructor(Board, Player1, Player2, difficulty, firsPlayer) {
        this.board = Board;
        this.players = [Player1, Player2];
        this.difficulty = difficulty; // easy, medium or hard
        this.currentPlayer = firsPlayer;
        this.phase = "drop"; // drop or move
    }

    // placePiece(cellIndex, symbol) {
    //     // Coloque a peça do jogador atual na célula.
    // }

    // switchPlayer() {
    //     this.currentPlayer = this.currentPlayer === Player1 ? Player2 : Player1;
    // }

    // isValidMove(cellIndex, symbol) {
    //     // Verifique se o movimento é válido de acordo com as regras do Dara.
    //     // Por exemplo, se a célula está vazia e pertence ao jogador atual.
    // }

    // isWinningMove(cellIndex, symbol) {
    //     // Verifique se o movimento resultou em uma vitória de acordo com as regras do Dara.
    // }

    // isFull() {
    //     return this.cells.every(cell => cell !== null);
    // }

        // makeMove(cellIndex) {
    //     if (!this.gameOver && this.board.isValidMove(cellIndex, this.currentPlayer.symbol)) {
    //         this.board.placePiece(cellIndex, this.currentPlayer.symbol);

    //         if (this.board.isWinningMove(cellIndex, this.currentPlayer.symbol)) {
    //             console.log(`${this.currentPlayer.name} ganhou!`);
    //             this.gameOver = true;
    //         } else if (this.board.isFull()) {
    //             console.log('Jogo empatado!');
    //             this.gameOver = true;
    //         } else {
    //             this.switchPlayer();
    //         }
    //     }
    // }
}
