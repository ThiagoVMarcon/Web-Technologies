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


// ------------------------------------------------------- GAME SECTION-----------------------------------------------------------------------

class TicTacToe {
    constructor(id, rows, cols) {
      this.rows = rows;
      this.cols = cols;
      this.content = new Array(rows * cols);
      this.board = this.createBoard(id, rows, cols);
      this.current = 'X';
    }
  
    createBoard(id, rows, cols) {
      const base = document.getElementById(id);
      base.innerHTML = ''; // Limpa o conteúdo da base
  
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
  
    play(cell) {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      const pos = row * this.cols + col;
  
      if (!this.content[pos]) {
        this.content[pos] = this.current;
        cell.innerHTML = this.current;
        this.current = this.current === 'X' ? 'O' : 'X';
      }
    }
  }
  
  window.onload = function () {
    const game = new TicTacToe('board', 6, 6); // Agora o tabuleiro é único e de tamanho 6x6
  };
  

// function getUsername() {
//     let username = document.getElementById("username");
//     if (username.type === "text") {
//     }
// }


