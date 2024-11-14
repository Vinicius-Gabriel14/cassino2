
document.addEventListener('DOMContentLoaded', function () {
    const girarButton = document.getElementById('girar');
    const resultDisplay = document.getElementById('result');
    const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    const slot3 = document.getElementById('slot3');
    const saldoDisplay = document.getElementById('saldo-valor');
    const apostaInput = document.getElementById('valor-aposta');
    const historicoLista = document.getElementById('historico-lista');
    
    let saldo = 100;
    let historico = [];
    const simbolos = ['🍒', '🍋', '🍊', '🍉', '🍇'];

    function atualizarSaldo() {
        saldoDisplay.textContent = saldo.toFixed(2);
    }

    function adicionarAoHistorico(mensagem) {
        const li = document.createElement('li');
        li.textContent = mensagem;
        historicoLista.appendChild(li);
    }

    function girarRolos() {
        const valorAposta = parseFloat(apostaInput.value);

        if (valorAposta <= 0 || valorAposta > saldo) {
            resultDisplay.textContent = "Aposta inválida. Verifique seu saldo.";
            resultDisplay.style.color = "red";
            return;
        }

        saldo -= valorAposta;
        atualizarSaldo();

        // Adiciona a animação de giro
        slot1.classList.add('slot-animacao');
        slot2.classList.add('slot-animacao');
        slot3.classList.add('slot-animacao');

        setTimeout(() => {
            const resultado1 = simbolos[Math.floor(Math.random() * simbolos.length)];
            const resultado2 = simbolos[Math.floor(Math.random() * simbolos.length)];
            const resultado3 = simbolos[Math.floor(Math.random() * simbolos.length)];

            slot1.textContent = resultado1;
            slot2.textContent = resultado2;
            slot3.textContent = resultado3;

            slot1.classList.remove('slot-animacao');
            slot2.classList.remove('slot-animacao');
            slot3.classList.remove('slot-animacao');

            let mensagem;
            let ganho = 0;

            if (resultado1 === resultado2 && resultado2 === resultado3) {
                // Ganho maior (3 símbolos iguais)
                ganho = valorAposta * 10;
                saldo += ganho;
                mensagem = `Você ganhou R$ ${ganho.toFixed(2)} com 3 símbolos iguais! Parabéns!`;
            } else if (resultado1 === resultado2 || resultado2 === resultado3 || resultado1 === resultado3) {
                // Ganho menor (2 símbolos iguais)
                ganho = valorAposta * 2;
                saldo += ganho;
                mensagem = `Você ganhou R$ ${ganho.toFixed(2)} com 2 símbolos iguais!`;
            } else {
                // Perda
                mensagem = `Você perdeu R$ ${valorAposta.toFixed(2)}. Tente novamente!`;
            }

            atualizarSaldo();
            resultDisplay.textContent = mensagem;

            if (ganho > 0) {
                resultDisplay.style.color = "green";
            } else {
                resultDisplay.style.color = "red";
            }

            // Adicionar ao histórico
            adicionarAoHistorico(mensagem);

        }, 1000); // Tempo de animação antes de mostrar o resultado
    }

    girarButton.addEventListener('click', girarRolos);
});






// poker.js

// Definindo as cartas do baralho

// Variáveis do jogo
let saldo = 1000;  // Saldo inicial do jogador
let aposta = 0;    // Aposta atual
let playerCards = [];  // Cartas do jogador
let dealerCards = [];  // Cartas do dealer
let playerScore = 0;   // Pontuação do jogador
let dealerScore = 0;   // Pontuação do dealer

// Elementos do DOM
const saldoValor = document.getElementById('saldo-valor');
const betInput = document.getElementById('bet-input');
const confirmBetBtn = document.getElementById('confirm-bet-btn');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const restartBtn = document.getElementById('restart-btn');
const gameMessage = document.getElementById('game-message');
const playerScoreElement = document.getElementById('player-score');
const dealerScoreElement = document.getElementById('dealer-score');
const playerCardsContainer = document.getElementById('player-cards');
const dealerCardsContainer = document.getElementById('dealer-cards');
const historyList = document.getElementById('history-list');

// Função para iniciar uma nova rodada
function restartGame() {
    saldo -= aposta;  // Deduz a aposta do saldo
    saldoValor.textContent = saldo;

    // Limpar cartas
    playerCards = [];
    dealerCards = [];
    playerScore = 0;
    dealerScore = 0;
    playerCardsContainer.innerHTML = '';
    dealerCardsContainer.innerHTML = '';
    playerScoreElement.textContent = `Sua Pontuação: ${playerScore}`;
    dealerScoreElement.textContent = `Pontuação do Dealer: ${dealerScore}`;

    hitBtn.disabled = false;
    standBtn.disabled = false;
    restartBtn.disabled = true;
    gameMessage.textContent = '';

    // Iniciar o jogo
    dealCards();
}

// Função para lidar com a aposta
function confirmBet() {
    aposta = parseInt(betInput.value);
    if (isNaN(aposta) || aposta <= 0 || aposta > saldo) {
        gameMessage.textContent = 'Aposta inválida! Insira um valor válido.';
        return;
    }
    gameMessage.textContent = `Aposta confirmada: R$ ${aposta}`;
    betInput.disabled = true;
    confirmBetBtn.disabled = true;
    hitBtn.disabled = false;
    standBtn.disabled = false;
}

// Função para lidar com o pedido de carta
function hit() {
    // Adiciona uma carta ao jogador
    let newCard = getRandomCard();
    playerCards.push(newCard);
    playerScore = calculateScore(playerCards);
    playerCardsContainer.innerHTML = displayCards(playerCards);

    // Atualiza a pontuação
    playerScoreElement.textContent = `Sua Pontuação: ${playerScore}`;

    // Verifica se o jogador estourou
    if (playerScore > 21) {
        gameMessage.textContent = 'Você estourou! Perdeu a aposta.';
        endRound(false);
    }
}

// Função para o jogador parar
function stand() {
    // O dealer joga após o jogador parar
    while (dealerScore < 17) {
        let newCard = getRandomCard();
        dealerCards.push(newCard);
        dealerScore = calculateScore(dealerCards);
        dealerCardsContainer.innerHTML = displayCards(dealerCards);
        dealerScoreElement.textContent = `Pontuação do Dealer: ${dealerScore}`;
    }

    // Determina o vencedor
    if (dealerScore > 21 || playerScore > dealerScore) {
        gameMessage.textContent = 'Você ganhou!';
        saldo += aposta * 2;  // O jogador ganha o dobro da aposta
    } else if (playerScore < dealerScore) {
        gameMessage.textContent = 'Você perdeu!';
    } else {
        gameMessage.textContent = 'Empate!';
        saldo += aposta;  // Retorna a aposta em caso de empate
    }

    // Atualiza o saldo e desabilita os botões
    saldoValor.textContent = saldo;
    endRound(true);
}

// Função para finalizar a rodada
function endRound(won) {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    restartBtn.disabled = false;

    // Adiciona a mão ao histórico
    const result = won ? 'Vitória' : 'Derrota';
    const historyItem = document.createElement('li');
    historyItem.textContent = `Aposta: R$ ${aposta} - ${result} | Sua Pontuação: ${playerScore} - Dealer: ${dealerScore}`;
    historyList.appendChild(historyItem);
}

// Função para obter uma carta aleatória (simples)
function getRandomCard() {
    const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
}

// Função para calcular a pontuação de uma mão
function calculateScore(cards) {
    let score = 0;
    let aceCount = 0;

    cards.forEach(card => {
        if (['J', 'Q', 'K'].includes(card)) {
            score += 10;
        } else if (card === 'A') {
            aceCount++;
            score += 11;  // Considera o Ás como 11 inicialmente
        } else {
            score += parseInt(card);
        }
    });

    // Ajuste do valor do Ás
    while (score > 21 && aceCount > 0) {
        score -= 10;  // Conta o Ás como 1 se necessário
        aceCount--;
    }

    return score;
}

// Função para exibir as cartas no HTML
function displayCards(cards) {
    return cards.map(card => `<div class="card">${card}</div>`).join('');
}

// Inicializa o evento de confirmação da aposta
confirmBetBtn.addEventListener('click', confirmBet);

// Inicializa os eventos dos botões de ação
hitBtn.addEventListener('click', hit);
standBtn.addEventListener('click', stand);

// Inicializa o evento de reinício de jogo
restartBtn.addEventListener('click', restartGame);













