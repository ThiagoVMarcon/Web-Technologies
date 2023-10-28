const loginModal = document.getElementById('login-modal');
const instructionsModal = document.getElementById('instructions-modal');
const settingsModal = document.getElementById('settings-modal');

function getUsername() {
    let username = document.getElementById("username");
    if (username.type === "text") {
        user
    }
}


loginModal.style.display = 'none'
instructionsModal.style.display = 'none';
settingsModal.style.display = 'none';

function openModal(event) {
    event.target.id === 'login-button' ? loginModal.style.display = 'flex' : 'none';
    event.target.id === 'instructions-button' ? instructionsModal.style.display = 'flex' : 'none';
    event.target.id === 'instructions-button' ? settingsModal.style.display = 'none' : '';
    event.target.id === 'settings-button' ? settingsModal.style.display = 'flex' : 'none';
    event.target.id === 'settings-button' ? instructionsModal.style.display = 'none' : '';
}

function closeModal() {
    instructionsModal.style.display = 'none';
    settingsModal.style.display = 'none';
}

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


