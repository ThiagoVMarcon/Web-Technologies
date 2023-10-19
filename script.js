const rulesButton = document.getElementById('rules-button');
const rulesModal = document.getElementById('rules-modal');
const closeButton = document.getElementById('close-button');

rulesButton.addEventListener('click', () => {
    rulesModal.style.display = 'flex';
});

closeButton.addEventListener('click', () => {
    rulesModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === rulesModal) {
        rulesModal.style.display = 'none';
    }
});

// Variável para controlar o jogador atual (0 para jogador 1, 1 para jogador 2)
let currentPlayer = 0;

// Adicione um evento de clique a todas as células
const items = document.querySelectorAll(".item");
items.forEach((item, index) => {
    item.addEventListener("click", () => {
        const pieceImage = currentPlayer === 0 ? "A.png" : "B.png";
        if (item.querySelector("img") === null) {
            const img = document.createElement("img");
            img.src = pieceImage;
            item.appendChild(img);
            currentPlayer = 1 - currentPlayer; // Alternar entre jogadores
        }
    });
});