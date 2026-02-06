// --- 1. ANIMATION ---
window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    reveals.forEach(el => {
        if(el.getBoundingClientRect().top < windowHeight - 100) el.classList.add('active');
    });
});
window.dispatchEvent(new Event('scroll'));

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// --- 2. JOGO REFLEXO ---
const reflexBox = document.getElementById('reflex-box');
const reflexMsg = document.getElementById('reflex-msg');
const reflexBest = document.getElementById('reflex-best');
let rState = 'idle'; 
let rTimer;
let rStart;

reflexBox.addEventListener('mousedown', reflexHandler);
reflexBox.addEventListener('touchstart', (e) => { e.preventDefault(); reflexHandler(); });

function reflexHandler() {
    if(rState === 'idle' || rState === 'done') {
        rState = 'wait';
        reflexBox.className = 'reflex-box wait';
        reflexMsg.innerText = "Aguarde...";
        reflexBox.style.background = "#2b2319"; // Tinta preta
        
        const time = Math.random() * 2000 + 2000;
        rTimer = setTimeout(() => {
            rState = 'go';
            reflexBox.className = 'reflex-box go';
            reflexMsg.innerText = "CLIQUE!";
            rStart = Date.now();
        }, time);
    } 
    else if(rState === 'wait') {
        clearTimeout(rTimer);
        rState = 'done';
        reflexBox.className = 'reflex-box';
        reflexMsg.innerText = "Falha (Cedo)";
        reflexBox.style.background = "#fff";
    }
    else if(rState === 'go') {
        const reaction = Date.now() - rStart;
        rState = 'done';
        reflexBox.className = 'reflex-box';
        reflexMsg.innerText = `${reaction} ms`;
        reflexBox.style.background = "#fff";
        
        const currentBest = parseInt(reflexBest.innerText) || 9999;
        if(reaction < currentBest) reflexBest.innerText = reaction;
    }
}

// --- 3. JOGO MEMÓRIA (ÍCONES FONT AWESOME) ---
const memoryBoard = document.getElementById('memory-board');
// Usando strings HTML para os ícones
const icons = [
    '<i class="fas fa-fire"></i>',
    '<i class="fas fa-water"></i>',
    '<i class="fas fa-wind"></i>',
    '<i class="fas fa-mountain"></i>',
    '<i class="fas fa-dragon"></i>',
    '<i class="fas fa-khanda"></i>'
];
let cards = [...icons, ...icons];
let flippedCards = [];
let matchedPairs = 0;

function initMemory() {
    memoryBoard.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    
    cards.sort(() => Math.random() - 0.5);
    
    cards.forEach((iconHtml, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.icon = iconHtml; // Guarda a string HTML
        // Verso da carta
        card.innerHTML = `<i class="fas fa-circle" style="font-size:0.8rem; opacity:0.3;"></i>`; 
        
        card.addEventListener('click', () => flipCard(card, iconHtml));
        memoryBoard.appendChild(card);
    });
}

function flipCard(card, iconHtml) {
    if(flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        card.innerHTML = iconHtml; // Mostra o ícone
        flippedCards.push(card);
        
        if(flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if(c1.dataset.icon === c2.dataset.icon) {
        matchedPairs++;
        flippedCards = [];
        if(matchedPairs === icons.length) setTimeout(() => alert("Desafio Completo!"), 500);
    } else {
        setTimeout(() => {
            c1.classList.remove('flipped');
            c1.innerHTML = `<i class="fas fa-circle" style="font-size:0.8rem; opacity:0.3;"></i>`;
            c2.classList.remove('flipped');
            c2.innerHTML = `<i class="fas fa-circle" style="font-size:0.8rem; opacity:0.3;"></i>`;
            flippedCards = [];
        }, 1000);
    }
}
initMemory();

// --- 4. HAIKU ---
const haikus = [
    "O velho lago;<br>Um sapo salta nele.<br>Som da água.",
    "Brisa de primavera;<br>Cerejeiras em flor<br>Tremem ao sol.",
    "Silêncio profundo;<br>O canto da cigarra<br>Penetra a pedra."
];
function newHaiku() {
    const display = document.getElementById('haiku-display');
    display.style.opacity = 0;
    setTimeout(() => {
        display.innerHTML = haikus[Math.floor(Math.random() * haikus.length)];
        display.style.opacity = 1;
    }, 300);
}