const loginButton = document.getElementById('login-button');
const instructionsButton = document.getElementById('instructions-button');
const settingsButton = document.getElementById('settings-button');
const classificationsButton = document.getElementById('classifications-button');
const playButton = document.getElementById('play-button');
const endButton = document.getElementById('end-button');
const collapsibleContent = document.getElementById('collapsible-content');
const instructionsModal = document.getElementById('instructions-modal');
const settingsModal = document.getElementById('settings-modal');
const classificationsModal = document.getElementById('classifications-modal');
const leftBox = document.getElementById('left-box');
const { rows, cols } = getBoardSize();
let player1 = '';
let player2 = '';
const selectedFirstToPlay = document.getElementById('first-to-play').value;
collapsibleContent.style.display = 'none';
instructionsModal.style.display = 'none';
settingsModal.style.display = 'none';
classificationsModal.style.display = 'none';

function openCollapsible() {
    if (collapsibleContent.style.display === 'none' || collapsibleContent.style.display === '')
        collapsibleContent.style.display = 'block';
    else 
        collapsibleContent.style.display = 'none';
}

function openModal(event) {
    event.target.id === 'instructions-button' ? instructionsModal.style.display = 'flex' : 'none';
    event.target.id === 'instructions-button' ? settingsModal.style.display = 'none' : '';
    event.target.id === 'instructions-button' ? classificationsModal.style.display = 'none' : '';
    event.target.id === 'settings-button' ? settingsModal.style.display = 'flex' : 'none';
    event.target.id === 'settings-button' ? instructionsModal.style.display = 'none' : '';
    event.target.id === 'settings-button' ? classificationsModal.style.display = 'none' : '';
    event.target.id === 'classifications-button' ? classificationsModal.style.display = 'flex' : 'none';
    event.target.id === 'classifications-button' ? instructionsModal.style.display = 'none' : '';
    event.target.id === 'classifications-button' ? settingsModal.style.display = 'none' : '';
}

function closeModal() {
    instructionsModal.style.display = 'none';
    settingsModal.style.display = 'none';
    classificationsModal.style.display = 'none';
}

window.onload = function () {
  ranking(rows, cols); 
};

function setDefault() {
  document.getElementById('board-size').value = "6x5";
  document.getElementById('opponent').value = "computer";
  document.getElementById('first-to-play').value = "blue";
  document.getElementById('difficulty').value = "easy";  
}

function getBoardSize() {
  const selectedSize = document.getElementById('board-size').value;
  let rows, cols;
  if (selectedSize === "6x5") {
    rows = 6;
    cols = 5;
  } else if (selectedSize === "6x6") {
    rows = 6;
    cols = 6;
  } else if (selectedSize === "5x6") {
    rows = 5;
    cols = 6;
  } else if (selectedSize === "7x6") {
    rows = 7;
    cols = 6;
  }
  return { rows, cols };
}

function getFirstToPlay() {
  let nick = document.getElementById('username').value;
  console.log(nick);
  if (selectedFirstToPlay === "blue") {
    player1 = nick;
    player2 = "Player2";
  } else if (selectedFirstToPlay === "green") {
    player1 = "Player1";
    player2 = nick;
  }
}

class DaraGame {
  constructor(id, rows, cols, nick1, nick2) {
    this.rows = rows;
    this.cols = cols;
    this.content = new Array(rows * cols);
    this.board = this.createBoard(id, rows, cols);
    this.turn = 'black'; 
    this.pieces = {
      black: { path: 'blue_piece.png', count: 12 }, 
      white: { path: 'green_piece.png', count: 12 },
    };
    this.currentPhase = 'drop';
    this.currentStep = 'from';
    this.move = { row: rows, column: cols };
    this.players = { nick1: nick1, nick2: nick2 };
    this.renderPieces();
    this.displayPieces();
  }

  createBoard(id, rows, cols) {
    const base = document.getElementById(id);
    base.innerHTML = ''; 
    const table = document.createElement('table');
    table.className = 'board';
    base.appendChild(table);
    for (let i = 0; i < rows; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement('td');
        cell.className = 'cell';
        cell.dataset.row = i;
        cell.dataset.col = j;
        row.appendChild(cell);
        cell.onclick = () => this.play(cell);
      }
      table.appendChild(row);
    }
    return table;
  }

  renderPieces() {
    const piecesContainer = document.createElement('div');
    piecesContainer.className = 'pieces-container';
    for (const piece in this.pieces) {
      const pieceDiv = document.createElement('div');
      pieceDiv.className = 'piece';
      const img = document.createElement('img');
      img.src = this.pieces[piece].path;
      img.style.width = '50px'; 
      img.style.height = '50px'; 
      const countSpan = document.createElement('span');
      countSpan.textContent = `x ${this.pieces[piece].count}`;
      pieceDiv.appendChild(img);
      pieceDiv.appendChild(countSpan);
      piecesContainer.appendChild(pieceDiv);
    }
    const base = document.getElementById('board');
    base.parentNode.insertBefore(piecesContainer, base);
  }

  displayPieces() {
    const pieces = document.querySelectorAll('.piece');
    pieces.forEach((piece, index) => {
        const countSpan = piece.querySelector('span');
        countSpan.textContent = ` ${this.pieces[index === 0 ? 'black' : 'white'].count}`;
    });
  }

  play(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const pos = row * this.cols + col;
    notifyMove(row, col); 
    if (!this.content[pos]) {
      if (this.pieces[this.turn].count > 0) {
        this.content[pos] = this.turn;
        const img = document.createElement('img');
        img.src = this.turn === 'black' ? this.pieces.black.path : this.pieces.white.path;
        img.style.width = '50px'; 
        img.style.height = '50px'; 
        img.style.display = 'block';
        img.style.margin = 'auto';
        cell.innerHTML = ''; 
        cell.appendChild(img);
        this.pieces[this.turn].count--;
        this.displayPieces();
        this.turn = this.turn === 'black' ? 'white' : 'black';
      }
    }
  }
}

function startGame() {
  update();
  alert("The game has started!");
  getFirstToPlay();
  console.log(player1 + " " + player2);
  const game = new DaraGame('board', rows, cols, player1, player2);
  loginButton.style.display = 'none';
  instructionsButton.style.display = 'none';
  settingsButton.style.display = 'none';
  classificationsButton.style.display = 'none';
  playButton.style.display = 'none';
  leftBox.style.display ='none';  
}

function endGame() {
  leaveGame();
}





