const balanceElement = document.getElementById('balance');
const betAmountElement = document.getElementById('bet-amount');
const playerCardsElement = document.getElementById('player-cards');
const communityCardsElement = document.getElementById('community-cards');
const gameMessageElement = document.getElementById('game-message');

// Definir saldo e aposta inicial
let balance = 1000;
let betAmount = 0;
let playerCards = [];
let communityCards = [];
let gameInProgress = false;

// Função para embaralhar as cartas
function shuffleDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];
    
    for (let suit of suits) {
        for (let value of values) {
            deck.push(value + suit);
        }
    }
    
    // Embaralha o deck
    return deck.sort(() => Math.random() - 0.5);
}

// Função para iniciar um novo jogo
function startNewGame() {
    if (balance <= 0) {
        alert('Você não tem saldo suficiente para jogar!');
        return;
    }
    
    gameInProgress = true;
    playerCards = [];
    communityCards = [];
    betAmount = 0;
    gameMessageElement.textContent = 'Jogo iniciado. Faça sua aposta!';
    betAmountElement.textContent = `Aposta: R$ ${betAmount}`;
    
    const deck = shuffleDeck();
    
    // Distribuindo as cartas do jogador
    playerCards.push(deck.pop(), deck.pop());
    
    // Distribuindo as cartas comunitárias (flop, turn, river)
    communityCards.push(deck.pop(), deck.pop(), deck.pop());
    
    updateGameUI();
}

// Atualiza a interface com as cartas do jogador e comunidade
function updateGameUI() {
    playerCardsElement.innerHTML = playerCards.map(card => `<div class="card">${card}</div>`).join('');
    communityCardsElement.innerHTML = communityCards.map(card => `<div class="card">${card}</div>`).join('');
    balanceElement.textContent = `Saldo: R$ ${balance}`;
    betAmountElement.textContent = `Aposta: R$ ${betAmount}`;
}

// Função para apostar
function bet(amount) {
    if (!gameInProgress || amount > balance) {
        gameMessageElement.textContent = 'Aposta inválida!';
        return;
    }
    
    betAmount = amount;
    balance -= betAmount;
    gameMessageElement.textContent = `Aposta de R$ ${betAmount} feita!`;
    
    // Inicia o jogo após a aposta
    startNewGame();
}

// Função para verificar o vencedor
function checkWinner() {
    // Aqui você pode adicionar a lógica para avaliar as mãos de poker e determinar o vencedor
    gameMessageElement.textContent = 'A rodada terminou!';
    gameInProgress = false;
}

// Função para avaliar a mão do jogador (muito simplificada para exemplo)
function evaluateHand(cards) {
    const values = cards.map(card => card.slice(0, -1)); // Pega apenas o valor das cartas
    const uniqueValues = [...new Set(values)];
    
    if (uniqueValues.length === 5) {
        return "Mão Normal";
    } else if (uniqueValues.length === 4) {
        return "Um Par";
    } else if (uniqueValues.length === 3) {
        return "Dois Pares";
    } else if (uniqueValues.length === 2) {
        return "Trinca ou Full House";
    } else {
        return "Quatro iguais";
    }
}

// Inicializar ações dos botões
document.getElementById('bet-button').addEventListener('click', () => {
    const betAmountInput = prompt('Digite o valor da aposta:');
    const amount = parseInt(betAmountInput, 10);
    if (amount && amount > 0) bet(amount);
});

document.getElementById('fold-button').addEventListener('click', () => {
    gameMessageElement.textContent = 'Você desistiu da rodada.';
    gameInProgress = false;
});

document.getElementById('call-button').addEventListener('click', () => {
    // Aqui você pode adicionar a lógica de "chamar" (seguir a aposta do adversário)
    gameMessageElement.textContent = 'Você chamou a aposta.';
});

document.getElementById('raise-button').addEventListener('click', () => {
    const raiseAmountInput = prompt('Digite o valor para aumentar a aposta:');
    const amount = parseInt(raiseAmountInput, 10);
    if (amount && amount > 0) bet(betAmount + amount);
});


