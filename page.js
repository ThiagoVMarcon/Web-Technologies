const loginButton = document.getElementById('login-button');
const collapsibleContent = document.getElementById('collapsible-content');
const instructionsModal = document.getElementById('instructions-modal');
const settingsModal = document.getElementById('settings-modal');

collapsibleContent.style.display = 'none';
instructionsModal.style.display = 'none';
settingsModal.style.display = 'none';

function openCollapsible() {
    if (collapsibleContent.style.display === 'none' || collapsibleContent.style.display === '')
        collapsibleContent.style.display = 'block';
    else 
        collapsibleContent.style.display = 'none';
}

function openModal(event) {
    event.target.id === 'instructions-button' ? instructionsModal.style.display = 'flex' : 'none';
    event.target.id === 'instructions-button' ? settingsModal.style.display = 'none' : '';
    event.target.id === 'settings-button' ? settingsModal.style.display = 'flex' : 'none';
    event.target.id === 'settings-button' ? instructionsModal.style.display = 'none' : '';
}

function closeModal() {
    instructionsModal.style.display = 'none';
    settingsModal.style.display = 'none';
}


// ------------------------------------------------------- GAME SECTION-----------------------------------------------------------------------//

class DaraGame {
  constructor(id, rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.content = new Array(rows * cols);
    this.board = this.createBoard(id, rows, cols);
    this.current = 'X'; // 'X' is the starting player
    this.pieces = {
      X: { path: 'blue_piece.png', count: 12 }, 
      O: { path: 'green_piece.png', count: 12 },
    };
    // creates HTML elements to display the pieces
    this.renderPieces();

    // Display the pieces beside the board
    this.displayPieces();
  }

  createBoard(id, rows, cols) {
    const base = document.getElementById(id);
    base.innerHTML = ''; // Clear the content of the base

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
    // Create HTML elements for displaying the pieces beside the board
    const piecesContainer = document.createElement('div');
    piecesContainer.className = 'pieces-container';

    for (const piece in this.pieces) {
      const pieceDiv = document.createElement('div');
      pieceDiv.className = 'piece';
      const img = document.createElement('img');
      img.src = this.pieces[piece].path;
      img.style.width = '50px'; // Adjust the width as needed
      img.style.height = '50px'; // Adjust the height as needed
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
      countSpan.textContent = ` ${this.pieces[index === 0 ? 'X' : 'O'].count}`;
    });
  }

  play(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const pos = row * this.cols + col;

    if (!this.content[pos]) {
      if (this.pieces[this.current].count > 0) {
        this.content[pos] = this.current;
        const img = document.createElement('img');
        img.src = this.current === 'X' ? this.pieces.X.path : this.pieces.O.path;
        img.style.width = '50px'; 
        img.style.height = '50px'; 
        img.style.display = 'block';
        img.style.margin = 'auto';
        cell.innerHTML = ''; // Clear the cell content before adding the image
        cell.appendChild(img);

        this.pieces[this.current].count--; // Decrement the piece count
        this.displayPieces(); // Update the displayed count
        this.current = this.current === 'X' ? 'O' : 'X'; // Switch players
      }
    }
    
  }
//-----------------------------------------------------------------------------------------------------

}

     

//-----------------------------------------------------------------------------------------------------


window.onload = function () {
  const game = new DaraGame('board', 6, 5); // The board is now a single 6x6 grid
};

window.onload = function () {
  const game = new DaraGame('board', 6, 5); 
};

const base = "http://twserver.alunos.dcc.fc.up.pt:8008";

function register() {
    const data = {
      nick: "zp",
      password: "zp!!"
    };

    fetch(`${base}/register`,{
      method: 'POST',
      body: JSON.stringify(data)
    })
    .then(r => r.json())
    .then(j => console.log(j))
}

register()
