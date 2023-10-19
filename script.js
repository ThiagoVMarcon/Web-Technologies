
const instructionsButton = document.getElementById('instructions-button');
const instructionsCloseButton = document.getElementById('instructions-close-button');
const instructionsModal = document.getElementById('instructions-modal');
const settingsButton = document.getElementById('settings-button');
const settingsCloseButton = document.getElementById('settings-close-button');
const settingsModal = document.getElementById('settings-modal');


instructionsButton.addEventListener('click', () => {
    instructionsModal.style.display = 'flex';
    settingsModal.style.display = 'none'; // Oculta o modal de settings
});

instructionsCloseButton.addEventListener('click', () => {
    instructionsModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === instructionsModal) {
        instructionsModal.style.display = 'none';
    }
});

settingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
    instructionsModal.style.display = 'none'; // Oculta o modal de settings
});

settingsCloseButton.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        settingsModal.style.display = 'none';
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


