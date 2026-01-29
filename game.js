// ===== TEMAS DISPONÍVEIS =====
const THEMES = {
    carnaval: {
        name: 'Carnaval',
        icon: 'fa-masks-theater',
        primaryColor: '#ffb800',
        secondaryColor: '#868fc6',
        bgGradient: 'linear-gradient(135deg, #851595 0%, #2d1f3d 50%, #1a1a2e 100%)',
        decorations: 'carnaval'
    },
    natureza: {
        name: 'Natureza',
        icon: 'fa-leaf',
        primaryColor: '#4ade80',
        secondaryColor: '#a3e635',
        bgGradient: 'linear-gradient(135deg, #14532d 0%, #1a2e1a 50%, #0f1a0f 100%)',
        decorations: 'natureza'
    },
    oceano: {
        name: 'Oceano',
        icon: 'fa-water',
        primaryColor: '#38bdf8',
        secondaryColor: '#818cf8',
        bgGradient: 'linear-gradient(135deg, #0c4a6e 0%, #1e3a5f 50%, #0f172a 100%)',
        decorations: 'oceano'
    },
    sunset: {
        name: 'Pôr do Sol',
        icon: 'fa-sun',
        primaryColor: '#fb923c',
        secondaryColor: '#f472b6',
        bgGradient: 'linear-gradient(135deg, #9a3412 0%, #581c87 50%, #1e1b4b 100%)',
        decorations: 'sunset'
    }
};

// ===== DECORAÇÕES DOS TEMAS =====
function createThemeDecorations(themeName) {
    const container = document.getElementById('theme-decorations');
    if (!container) return;

    container.innerHTML = '';

    switch(themeName) {
        case 'carnaval':
            createCarnavalDecorations(container);
            break;
        case 'natureza':
            createNaturezaDecorations(container);
            break;
        case 'oceano':
            createOceanoDecorations(container);
            break;
        case 'sunset':
            createSunsetDecorations(container);
            break;
    }
}

function createCarnavalDecorations(container) {
    const colors = ['#ffb800', '#ff6b9d', '#868fc6', '#4ade80', '#f472b6', '#38bdf8'];

    // Paetês caindo
    for (let i = 0; i < 30; i++) {
        const paete = document.createElement('div');
        paete.className = 'paete';
        paete.style.left = Math.random() * 100 + '%';
        paete.style.width = (Math.random() * 8 + 4) + 'px';
        paete.style.height = paete.style.width;
        paete.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        paete.style.animationDuration = (Math.random() * 4 + 3) + 's';
        paete.style.animationDelay = (Math.random() * 5) + 's';
        paete.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px ${paete.style.backgroundColor}`;
        container.appendChild(paete);
    }

    // Serpentinas
    for (let i = 0; i < 8; i++) {
        const serpentina = document.createElement('div');
        serpentina.className = 'serpentina';
        serpentina.style.left = Math.random() * 100 + '%';
        serpentina.style.animationDuration = (Math.random() * 5 + 4) + 's';
        serpentina.style.animationDelay = (Math.random() * 3) + 's';
        container.appendChild(serpentina);
    }

    // Plumas
    for (let i = 0; i < 6; i++) {
        const pluma = document.createElement('div');
        pluma.className = 'pluma';
        pluma.style.left = Math.random() * 100 + '%';
        pluma.style.top = Math.random() * 100 + '%';
        pluma.style.color = colors[Math.floor(Math.random() * colors.length)];
        pluma.style.animationDuration = (Math.random() * 4 + 3) + 's';
        pluma.style.animationDelay = (Math.random() * 2) + 's';
        pluma.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(pluma);
    }

    // Máscaras
    const mascaras = ['🎭', '🎪', '✨', '💃', '🎉'];
    for (let i = 0; i < 5; i++) {
        const mascara = document.createElement('div');
        mascara.className = 'mascara';
        mascara.textContent = mascaras[i % mascaras.length];
        mascara.style.left = Math.random() * 90 + 5 + '%';
        mascara.style.top = Math.random() * 90 + 5 + '%';
        mascara.style.animationDuration = (Math.random() * 3 + 2) + 's';
        mascara.style.animationDelay = (Math.random() * 2) + 's';
        container.appendChild(mascara);
    }

    // Estrelas brilhantes
    for (let i = 0; i < 10; i++) {
        const estrela = document.createElement('div');
        estrela.className = 'estrela';
        estrela.style.left = Math.random() * 100 + '%';
        estrela.style.top = Math.random() * 100 + '%';
        estrela.style.animationDuration = (Math.random() * 2 + 1) + 's';
        estrela.style.animationDelay = (Math.random() * 2) + 's';
        container.appendChild(estrela);
    }
}

function createNaturezaDecorations(container) {
    const folhas = ['🍃', '🌿', '🌱', '☘️', '🍀'];
    for (let i = 0; i < 15; i++) {
        const folha = document.createElement('div');
        folha.className = 'mascara';
        folha.textContent = folhas[Math.floor(Math.random() * folhas.length)];
        folha.style.left = Math.random() * 100 + '%';
        folha.style.top = Math.random() * 100 + '%';
        folha.style.animationDuration = (Math.random() * 4 + 3) + 's';
        folha.style.opacity = '0.4';
        container.appendChild(folha);
    }
}

function createOceanoDecorations(container) {
    const oceano = ['🐚', '🌊', '⭐', '🐠', '🦋'];
    for (let i = 0; i < 12; i++) {
        const item = document.createElement('div');
        item.className = 'mascara';
        item.textContent = oceano[Math.floor(Math.random() * oceano.length)];
        item.style.left = Math.random() * 100 + '%';
        item.style.top = Math.random() * 100 + '%';
        item.style.animationDuration = (Math.random() * 4 + 3) + 's';
        item.style.opacity = '0.3';
        container.appendChild(item);
    }
}

function createSunsetDecorations(container) {
    const sunset = ['☀️', '🌅', '🦅', '✨', '🌸'];
    for (let i = 0; i < 10; i++) {
        const item = document.createElement('div');
        item.className = 'mascara';
        item.textContent = sunset[Math.floor(Math.random() * sunset.length)];
        item.style.left = Math.random() * 100 + '%';
        item.style.top = Math.random() * 100 + '%';
        item.style.animationDuration = (Math.random() * 4 + 3) + 's';
        item.style.opacity = '0.3';
        container.appendChild(item);
    }
}

// ===== CONFIGURAÇÕES PADRÃO =====
const DEFAULT_CONFIG = {
    theme: 'carnaval',
    primaryColor: '#ffb800',
    secondaryColor: '#868fc6',
    logo: null, // null = usar assets/logo-png.png
    puzzleImage: null, // null = usar assets/logo-png.png
    gamesEnabled: {
        memory: true,
        puzzle: true,
        quiz: true
    },
    quizQuestions: [
        { question: "Beijo ou toque sem consentimento pode ser crime, mesmo em festas? (Lei nº 13.718/2018)", answer: true },
        { question: "Uma pessoa precisa dizer 'não' em voz alta para a lei reconhecer o assédio?", answer: false },
        { question: "O 180 serve apenas para denúncia?", answer: false, hint: "Também orienta e acolhe" },
        { question: "A Lei Maria da Penha nasceu da história real de uma mulher que lutou por justiça e mudou a lei no Brasil?", answer: true },
        { question: "Toda pessoa tem o direito de dizer NÃO a qualquer momento.", answer: true },
        { question: "Se alguém não responde, significa que está concordando.", answer: false },
        { question: "Respeitar o NÃO é uma forma de demonstrar amor e cuidado.", answer: true },
        { question: "Insistir após ouvir um NÃO é uma forma aceitável de convencimento.", answer: false },
        { question: "O consentimento deve ser dado de forma livre e consciente.", answer: true },
        { question: "Respeitar limites é fundamental em qualquer tipo de relacionamento.", answer: true }
    ],
    memoryIcons: [
        { icon: 'fa-heart', name: 'Coração' },
        { icon: 'fa-hand', name: 'Pare' },
        { icon: 'fa-shield-halved', name: 'Proteção' },
        { icon: 'fa-star', name: 'Estrela' },
        { icon: 'fa-handshake', name: 'Cuidado' },
        { icon: 'fa-user-shield', name: 'Segurança' },
        { icon: 'fa-dove', name: 'Paz' },
        { icon: 'fa-hand-holding-heart', name: 'Apoio' },
        { icon: 'fa-people-group', name: 'União' },
        { icon: 'fa-ribbon', name: 'Consciência' },
        { icon: 'fa-circle-check', name: 'Respeito' },
        { icon: 'fa-face-smile', name: 'Alegria' },
        { icon: 'fa-sun', name: 'Luz' },
        { icon: 'fa-gem', name: 'Valor' },
        { icon: 'fa-crown', name: 'Dignidade' },
        { icon: 'fa-bolt', name: 'Força' }
    ]
};

// Lista completa de ícones disponíveis para seleção no Dashboard
const AVAILABLE_ICONS = [
    { icon: 'fa-heart', name: 'Coração' },
    { icon: 'fa-hand', name: 'Pare' },
    { icon: 'fa-shield-halved', name: 'Proteção' },
    { icon: 'fa-star', name: 'Estrela' },
    { icon: 'fa-handshake', name: 'Cuidado' },
    { icon: 'fa-user-shield', name: 'Segurança' },
    { icon: 'fa-dove', name: 'Paz' },
    { icon: 'fa-hand-holding-heart', name: 'Apoio' },
    { icon: 'fa-people-group', name: 'União' },
    { icon: 'fa-ribbon', name: 'Consciência' },
    { icon: 'fa-circle-check', name: 'Respeito' },
    { icon: 'fa-face-smile', name: 'Alegria' },
    { icon: 'fa-sun', name: 'Luz' },
    { icon: 'fa-gem', name: 'Valor' },
    { icon: 'fa-crown', name: 'Dignidade' },
    { icon: 'fa-bolt', name: 'Força' },
    { icon: 'fa-bell', name: 'Sino' },
    { icon: 'fa-book', name: 'Livro' },
    { icon: 'fa-camera', name: 'Câmera' },
    { icon: 'fa-car', name: 'Carro' },
    { icon: 'fa-cloud', name: 'Nuvem' },
    { icon: 'fa-coffee', name: 'Café' },
    { icon: 'fa-flag', name: 'Bandeira' },
    { icon: 'fa-gift', name: 'Presente' },
    { icon: 'fa-globe', name: 'Globo' },
    { icon: 'fa-home', name: 'Casa' },
    { icon: 'fa-key', name: 'Chave' },
    { icon: 'fa-leaf', name: 'Folha' },
    { icon: 'fa-lightbulb', name: 'Lâmpada' },
    { icon: 'fa-music', name: 'Música' },
    { icon: 'fa-palette', name: 'Paleta' },
    { icon: 'fa-plane', name: 'Avião' }
];

// ===== FUNÇÕES DE CONFIGURAÇÃO (localStorage) =====
function loadConfig() {
    try {
        const saved = localStorage.getItem('gameConfig');
        if (saved) {
            const config = JSON.parse(saved);
            // Mesclar com padrão para garantir que todas as propriedades existam
            return { ...DEFAULT_CONFIG, ...config };
        }
    } catch (e) {
        console.error('Erro ao carregar configurações:', e);
    }
    return { ...DEFAULT_CONFIG };
}

function saveConfig(config) {
    try {
        localStorage.setItem('gameConfig', JSON.stringify(config));
        applyConfig(config);
        return true;
    } catch (e) {
        console.error('Erro ao salvar configurações:', e);
        return false;
    }
}

function resetConfig() {
    localStorage.removeItem('gameConfig');
    applyConfig(DEFAULT_CONFIG);
    return { ...DEFAULT_CONFIG };
}

function applyConfig(config) {
    // Aplicar tema
    const themeName = config.theme || 'carnaval';
    const theme = THEMES[themeName] || THEMES.carnaval;

    // Aplicar cor principal (usa do config ou do tema)
    const primaryColor = config.primaryColor || theme.primaryColor;
    document.documentElement.style.setProperty('--cor-amarelo', primaryColor);

    // Aplicar cor secundária (usa do config ou do tema)
    const secondaryColor = config.secondaryColor || theme.secondaryColor;
    document.documentElement.style.setProperty('--cor-roxo', secondaryColor);

    // Aplicar gradiente de fundo do tema
    document.documentElement.style.setProperty('--bg-gradient', theme.bgGradient);
    document.body.style.background = theme.bgGradient;

    // Aplicar nas telas também (todas, incluindo splash e start)
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.background = 'transparent';
    });

    // Criar decorações do tema
    createThemeDecorations(themeName);

    // Aplicar logo
    const logoSrc = config.logo || 'assets/logo-png.png';
    document.querySelectorAll('.splash-logo, .logo-image').forEach(img => {
        img.src = logoSrc;
    });

    // Aplicar marca d'água nas telas de jogo
    applyWatermark(logoSrc);

    // Aplicar imagem do puzzle (será usado quando o puzzle for gerado)
    window.puzzleImageSrc = config.puzzleImage || 'assets/logo-png.png';

    // Aplicar jogos habilitados
    const gamesEnabled = config.gamesEnabled || { memory: true, puzzle: true, quiz: true };

    const memoryBtn = document.querySelector('[onclick="startMemoryGame()"]');
    const puzzleBtn = document.querySelector('[onclick="startPuzzleGame()"]');
    const quizBtn = document.querySelector('[onclick="startQuizGame()"]');

    if (memoryBtn) memoryBtn.style.display = gamesEnabled.memory ? 'flex' : 'none';
    if (puzzleBtn) puzzleBtn.style.display = gamesEnabled.puzzle ? 'flex' : 'none';
    if (quizBtn) quizBtn.style.display = gamesEnabled.quiz ? 'flex' : 'none';
}

function applyWatermark(logoSrc) {
    // Remover marcas d'água existentes
    document.querySelectorAll('.watermark').forEach(w => w.remove());

    // Adicionar marca d'água nas telas de jogo
    const gameScreens = ['screen-memory', 'screen-puzzle', 'screen-quiz'];

    gameScreens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) {
            const watermark = document.createElement('div');
            watermark.className = 'watermark';
            watermark.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 70%;
                height: 70%;
                background-image: url('${logoSrc}');
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                opacity: 0.08;
                pointer-events: none;
                z-index: 0;
            `;
            screen.insertBefore(watermark, screen.firstChild);
        }
    });
}

// Variável global para configurações
let gameConfig = loadConfig();

// ===== CONFIGURAÇÃO DOS ÍCONES (usa config) =====
// ICONS agora é uma função que retorna os ícones configurados
function getIcons() {
    return gameConfig.memoryIcons || DEFAULT_CONFIG.memoryIcons;
}

// Manter compatibilidade com código antigo
const ICONS = DEFAULT_CONFIG.memoryIcons;

// ===== VARIÁVEIS GLOBAIS =====
let currentGame = null;
let timer = null;
let seconds = 0;
let moves = 0;
let playerName = '';

// ===== JOGO DA MEMÓRIA - VARIÁVEIS =====
const TOTAL_PAIRS = 8;
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let isLocked = false;

// ===== QUEBRA-CABEÇA ENCAIXE - VARIÁVEIS =====
let puzzlePieces = [];
let placedPieces = [null, null, null, null, null, null, null, null, null];
let draggedPiece = null;
let draggedTile = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// ===== QUIZ - VARIÁVEIS =====
let quizQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let quizAnswered = false;

// ===== NAVEGAÇÃO ENTRE TELAS =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    setTimeout(() => {
        document.getElementById(screenId).classList.add('active');

        // Inicializar dashboard quando abrir
        if (screenId === 'screen-dashboard') {
            initDashboard();
        }
    }, 100);
}

function goToStart() {
    stopTimer();
    currentGame = null;
    showScreen('screen-start');
}

function quitGame() {
    stopTimer();
    goToStart();
}

// ===== TIMER =====
function startTimer(timerElementId) {
    stopTimer();
    seconds = 0;
    const timerElement = document.getElementById(timerElementId);
    timer = setInterval(() => {
        seconds++;
        timerElement.textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

// ===== NOME DO JOGADOR =====
function getPlayerName() {
    const input = document.getElementById('player-name');
    playerName = input.value.trim() || 'Jogador';
    return playerName;
}

// ===== VITÓRIA =====
function showVictory() {
    stopTimer();
    document.getElementById('final-time').textContent = formatTime(seconds);
    document.getElementById('final-moves').textContent = moves;
    document.getElementById('winner-name').textContent = playerName || 'Jogador';
    showScreen('screen-victory');
    createConfetti();
}

function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.innerHTML = '';
    const colors = ['#ffb800', '#868fc6', '#851595', '#ff6b9d', '#4ade80'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confettiContainer.appendChild(confetti);
    }
}

function playAgain() {
    if (currentGame === 'memory') {
        startMemoryGame();
    } else if (currentGame === 'puzzle') {
        startPuzzleGame();
    } else if (currentGame === 'quiz') {
        startQuizGame();
    }
}

// ===== UTILITÁRIOS =====
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// =====================================================
// JOGO DA MEMÓRIA
// =====================================================
function startMemoryGame() {
    currentGame = 'memory';
    matchedPairs = 0;
    moves = 0;
    flippedCards = [];
    isLocked = false;

    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-timer').textContent = '00:00';
    document.getElementById('memory-pairs').textContent = `0/${TOTAL_PAIRS}`;

    generateMemoryCards();
    showScreen('screen-memory');
    startTimer('memory-timer');
}

function generateMemoryCards() {
    const board = document.getElementById('memory-board');
    board.innerHTML = '';

    const selectedIcons = shuffleArray([...getIcons()]).slice(0, TOTAL_PAIRS);
    memoryCards = [];

    selectedIcons.forEach((iconData, index) => {
        memoryCards.push({ id: index, ...iconData });
        memoryCards.push({ id: index, ...iconData });
    });

    memoryCards = shuffleArray(memoryCards);

    memoryCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card flipped'; // Começa virada
        cardElement.dataset.index = index;
        cardElement.dataset.id = card.id;

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front"></div>
                <div class="card-face card-back"><i class="fas ${card.icon}"></i></div>
            </div>
        `;

        cardElement.addEventListener('click', () => flipCard(cardElement));
        cardElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            flipCard(cardElement);
        }, { passive: false });

        board.appendChild(cardElement);
    });

    // Bloqueia interação durante a visualização
    isLocked = true;

    // Após 3 segundos, vira todas as cartas de volta
    setTimeout(() => {
        document.querySelectorAll('.card.flipped').forEach(card => {
            if (!card.classList.contains('matched')) {
                card.classList.remove('flipped');
            }
        });
        isLocked = false;
    }, 3000);
}

function flipCard(cardElement) {
    if (isLocked) return;
    if (cardElement.classList.contains('flipped')) return;
    if (cardElement.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    cardElement.classList.add('flipped');
    flippedCards.push(cardElement);

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('memory-moves').textContent = moves;
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    isLocked = true;
    const [card1, card2] = flippedCards;
    const id1 = card1.dataset.id;
    const id2 = card2.dataset.id;

    if (id1 === id2) {
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            document.getElementById('memory-pairs').textContent = `${matchedPairs}/${TOTAL_PAIRS}`;
            flippedCards = [];
            isLocked = false;

            if (matchedPairs === TOTAL_PAIRS) {
                setTimeout(showVictory, 500);
            }
        }, 300);
    } else {
        card1.classList.add('wrong');
        card2.classList.add('wrong');
        setTimeout(() => {
            card1.classList.remove('flipped', 'wrong');
            card2.classList.remove('flipped', 'wrong');
            flippedCards = [];
            isLocked = false;
        }, 1000);
    }
}

// =====================================================
// QUEBRA-CABEÇA ENCAIXE
// =====================================================
let dragSourceSlot = null; // Slot de onde a peça está sendo arrastada

function startPuzzleGame() {
    currentGame = 'puzzle';
    moves = 0;
    placedPieces = [null, null, null, null, null, null, null, null, null];

    document.getElementById('puzzle-timer').textContent = '00:00';
    document.getElementById('puzzle-moves').textContent = '0';

    showScreen('screen-puzzle');
    startTimer('puzzle-timer');

    generatePuzzle();
}

function generatePuzzle() {
    const board = document.getElementById('puzzle-board');
    const piecesContainer = document.getElementById('puzzle-pieces');
    board.innerHTML = '';
    piecesContainer.innerHTML = '';

    // Criar slots vazios no tabuleiro
    for (let i = 0; i < 9; i++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.dataset.slot = i;
        board.appendChild(slot);
    }

    // Criar peças embaralhadas
    puzzlePieces = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    const puzzleImage = gameConfig.puzzleImage || 'assets/logo-png.png';

    puzzlePieces.forEach(tile => {
        const piece = createPuzzlePiece(tile, puzzleImage);
        piecesContainer.appendChild(piece);
    });
}

function createPuzzlePiece(tile, puzzleImage, isPlaced = false) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece' + (isPlaced ? ' placed' : '');
    piece.dataset.tile = tile;

    const row = Math.floor(tile / 3);
    const col = tile % 3;
    piece.style.backgroundImage = `url('${puzzleImage}')`;
    piece.style.backgroundPosition = `${col * 50}% ${row * 50}%`;

    // Mouse events
    piece.addEventListener('mousedown', handlePieceMouseDown);

    // Touch events
    piece.addEventListener('touchstart', handlePieceTouchStart, { passive: false });

    return piece;
}

function isPuzzleSolved() {
    for (let i = 0; i < 9; i++) {
        if (placedPieces[i] !== i) return false;
    }
    return true;
}

// ===== MOUSE EVENTS =====
function handlePieceMouseDown(e) {
    e.preventDefault();

    draggedPiece = e.target;
    draggedTile = parseInt(e.target.dataset.tile);

    // Verificar se a peça está em um slot
    const parentSlot = draggedPiece.closest('.puzzle-slot');
    dragSourceSlot = parentSlot ? parseInt(parentSlot.dataset.slot) : null;

    const rect = draggedPiece.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    // Clonar para arrastar
    const clone = draggedPiece.cloneNode(true);
    clone.id = 'dragging-piece';
    clone.className = 'puzzle-piece';
    clone.style.position = 'fixed';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.left = (e.clientX - dragOffsetX) + 'px';
    clone.style.top = (e.clientY - dragOffsetY) + 'px';
    clone.style.opacity = '0.9';
    clone.style.transform = 'scale(1.1)';
    clone.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    clone.style.borderColor = 'var(--cor-amarelo)';
    document.body.appendChild(clone);

    draggedPiece.style.opacity = '0.3';

    document.addEventListener('mousemove', handlePieceMouseMove);
    document.addEventListener('mouseup', handlePieceMouseUp);
}

function handlePieceMouseMove(e) {
    const clone = document.getElementById('dragging-piece');
    if (!clone) return;

    clone.style.left = (e.clientX - dragOffsetX) + 'px';
    clone.style.top = (e.clientY - dragOffsetY) + 'px';

    // Highlight slot ou área de peças
    document.querySelectorAll('.puzzle-slot').forEach(s => s.classList.remove('drag-over'));
    document.getElementById('puzzle-pieces')?.classList.remove('drag-over');

    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    const slot = elementBelow?.closest('.puzzle-slot');
    const piecesArea = elementBelow?.closest('.puzzle-pieces');

    if (slot) {
        slot.classList.add('drag-over');
    } else if (piecesArea) {
        piecesArea.classList.add('drag-over');
    }
}

function handlePieceMouseUp(e) {
    document.removeEventListener('mousemove', handlePieceMouseMove);
    document.removeEventListener('mouseup', handlePieceMouseUp);

    const clone = document.getElementById('dragging-piece');
    if (clone) clone.remove();

    if (!draggedPiece) return;
    draggedPiece.style.opacity = '1';

    document.querySelectorAll('.puzzle-slot').forEach(s => s.classList.remove('drag-over'));
    document.getElementById('puzzle-pieces')?.classList.remove('drag-over');

    const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
    const slot = elementBelow?.closest('.puzzle-slot');
    const piecesArea = elementBelow?.closest('.puzzle-pieces');

    if (slot) {
        const slotIndex = parseInt(slot.dataset.slot);
        handlePieceDrop(slot, slotIndex);
    } else if (piecesArea && dragSourceSlot !== null) {
        // Devolver peça para área de escolha
        returnPieceToPool();
    }

    draggedPiece = null;
    draggedTile = null;
    dragSourceSlot = null;
}

// ===== TOUCH EVENTS =====
function handlePieceTouchStart(e) {
    e.preventDefault();

    const touch = e.touches[0];
    draggedPiece = e.target;
    draggedTile = parseInt(e.target.dataset.tile);

    // Verificar se a peça está em um slot
    const parentSlot = draggedPiece.closest('.puzzle-slot');
    dragSourceSlot = parentSlot ? parseInt(parentSlot.dataset.slot) : null;

    const rect = draggedPiece.getBoundingClientRect();
    dragOffsetX = touch.clientX - rect.left;
    dragOffsetY = touch.clientY - rect.top;

    // Clonar para arrastar
    const clone = draggedPiece.cloneNode(true);
    clone.id = 'dragging-piece';
    clone.className = 'puzzle-piece';
    clone.style.position = 'fixed';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.left = (touch.clientX - dragOffsetX) + 'px';
    clone.style.top = (touch.clientY - dragOffsetY) + 'px';
    clone.style.opacity = '0.9';
    clone.style.transform = 'scale(1.1)';
    clone.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    clone.style.borderColor = 'var(--cor-amarelo)';
    document.body.appendChild(clone);

    draggedPiece.style.opacity = '0.3';

    document.addEventListener('touchmove', handlePieceTouchMove, { passive: false });
    document.addEventListener('touchend', handlePieceTouchEnd);
}

function handlePieceTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const clone = document.getElementById('dragging-piece');
    if (!clone) return;

    clone.style.left = (touch.clientX - dragOffsetX) + 'px';
    clone.style.top = (touch.clientY - dragOffsetY) + 'px';

    // Highlight slot ou área de peças
    document.querySelectorAll('.puzzle-slot').forEach(s => s.classList.remove('drag-over'));
    document.getElementById('puzzle-pieces')?.classList.remove('drag-over');

    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const slot = elementBelow?.closest('.puzzle-slot');
    const piecesArea = elementBelow?.closest('.puzzle-pieces');

    if (slot) {
        slot.classList.add('drag-over');
    } else if (piecesArea) {
        piecesArea.classList.add('drag-over');
    }
}

function handlePieceTouchEnd(e) {
    document.removeEventListener('touchmove', handlePieceTouchMove);
    document.removeEventListener('touchend', handlePieceTouchEnd);

    const clone = document.getElementById('dragging-piece');
    if (clone) clone.remove();

    if (!draggedPiece) return;
    draggedPiece.style.opacity = '1';

    const touch = e.changedTouches[0];
    document.querySelectorAll('.puzzle-slot').forEach(s => s.classList.remove('drag-over'));
    document.getElementById('puzzle-pieces')?.classList.remove('drag-over');

    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const slot = elementBelow?.closest('.puzzle-slot');
    const piecesArea = elementBelow?.closest('.puzzle-pieces');

    if (slot) {
        const slotIndex = parseInt(slot.dataset.slot);
        handlePieceDrop(slot, slotIndex);
    } else if (piecesArea && dragSourceSlot !== null) {
        // Devolver peça para área de escolha
        returnPieceToPool();
    }

    draggedPiece = null;
    draggedTile = null;
    dragSourceSlot = null;
}

// ===== HANDLE DROP =====
function handlePieceDrop(targetSlot, targetSlotIndex) {
    const puzzleImage = gameConfig.puzzleImage || 'assets/logo-png.png';
    const isTargetFilled = targetSlot.classList.contains('filled');

    // Se soltar no mesmo slot de origem, cancelar
    if (dragSourceSlot !== null && dragSourceSlot === targetSlotIndex) {
        return;
    }

    // Se veio de um slot
    if (dragSourceSlot !== null) {
        const sourceSlot = document.querySelector(`.puzzle-slot[data-slot="${dragSourceSlot}"]`);

        if (isTargetFilled) {
            // Trocar peças entre slots
            const targetPiece = targetSlot.querySelector('.puzzle-piece');
            const targetTile = parseInt(targetPiece.dataset.tile);

            // Mover peça do target para o source
            targetPiece.remove();
            const newSourcePiece = createPuzzlePiece(targetTile, puzzleImage, true);
            if (targetTile === dragSourceSlot) newSourcePiece.classList.add('correct');
            else newSourcePiece.classList.remove('correct');
            sourceSlot.appendChild(newSourcePiece);
            placedPieces[dragSourceSlot] = targetTile;

            // Mover peça arrastada para o target
            draggedPiece.remove();
            const newTargetPiece = createPuzzlePiece(draggedTile, puzzleImage, true);
            if (draggedTile === targetSlotIndex) newTargetPiece.classList.add('correct');
            targetSlot.appendChild(newTargetPiece);
            placedPieces[targetSlotIndex] = draggedTile;

        } else {
            // Mover para slot vazio
            draggedPiece.remove();
            sourceSlot.classList.remove('filled');
            placedPieces[dragSourceSlot] = null;

            const newPiece = createPuzzlePiece(draggedTile, puzzleImage, true);
            if (draggedTile === targetSlotIndex) newPiece.classList.add('correct');
            targetSlot.appendChild(newPiece);
            targetSlot.classList.add('filled');
            placedPieces[targetSlotIndex] = draggedTile;
        }
    } else {
        // Veio da área de peças
        if (isTargetFilled) {
            // Trocar: peça do slot vai para área, peça arrastada vai para slot
            const targetPiece = targetSlot.querySelector('.puzzle-piece');
            const targetTile = parseInt(targetPiece.dataset.tile);

            // Mover peça do slot para área
            targetPiece.remove();
            const returnedPiece = createPuzzlePiece(targetTile, puzzleImage, false);
            document.getElementById('puzzle-pieces').appendChild(returnedPiece);

            // Colocar peça arrastada no slot
            draggedPiece.remove();
            const newPiece = createPuzzlePiece(draggedTile, puzzleImage, true);
            if (draggedTile === targetSlotIndex) newPiece.classList.add('correct');
            targetSlot.appendChild(newPiece);
            placedPieces[targetSlotIndex] = draggedTile;
        } else {
            // Colocar em slot vazio
            draggedPiece.remove();
            const newPiece = createPuzzlePiece(draggedTile, puzzleImage, true);
            if (draggedTile === targetSlotIndex) newPiece.classList.add('correct');
            targetSlot.appendChild(newPiece);
            targetSlot.classList.add('filled');
            placedPieces[targetSlotIndex] = draggedTile;
        }
    }

    moves++;
    document.getElementById('puzzle-moves').textContent = moves;

    // Verificar vitória
    if (isPuzzleSolved()) {
        setTimeout(showVictory, 500);
    }
}

// ===== RETURN PIECE TO POOL =====
function returnPieceToPool() {
    if (dragSourceSlot === null) return;

    const puzzleImage = gameConfig.puzzleImage || 'assets/logo-png.png';
    const sourceSlot = document.querySelector(`.puzzle-slot[data-slot="${dragSourceSlot}"]`);

    // Remover do slot
    draggedPiece.remove();
    sourceSlot.classList.remove('filled');
    placedPieces[dragSourceSlot] = null;

    // Adicionar na área de peças
    const returnedPiece = createPuzzlePiece(draggedTile, puzzleImage, false);
    document.getElementById('puzzle-pieces').appendChild(returnedPiece);

    moves++;
    document.getElementById('puzzle-moves').textContent = moves;
}

// =====================================================
// QUIZ (Verdadeiro ou Falso)
// =====================================================
function startQuizGame() {
    currentGame = 'quiz';
    moves = 0;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    quizAnswered = false;

    // Carregar perguntas das configurações
    quizQuestions = shuffleArray([...gameConfig.quizQuestions]);

    document.getElementById('quiz-timer').textContent = '00:00';
    document.getElementById('quiz-total').textContent = quizQuestions.length;
    document.getElementById('quiz-score').textContent = `0/${quizQuestions.length}`;

    showScreen('screen-quiz');
    startTimer('quiz-timer');

    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        moves = correctAnswers;
        setTimeout(showVictory, 500);
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    quizAnswered = false;

    // Atualizar UI
    document.getElementById('quiz-current').textContent = currentQuestionIndex + 1;
    document.getElementById('quiz-question').textContent = question.question;

    // Atualizar barra de progresso
    const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
    document.getElementById('quiz-progress-bar').style.width = progress + '%';

    // Resetar botões
    const btnTrue = document.getElementById('btn-true');
    const btnFalse = document.getElementById('btn-false');
    btnTrue.disabled = false;
    btnFalse.disabled = false;
    btnTrue.classList.remove('correct', 'wrong');
    btnFalse.classList.remove('correct', 'wrong');

    // Esconder feedback
    document.getElementById('quiz-feedback').classList.remove('show', 'correct', 'wrong');
}

function answerQuiz(answer) {
    if (quizAnswered) return;
    quizAnswered = true;

    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = answer === question.answer;

    const btnTrue = document.getElementById('btn-true');
    const btnFalse = document.getElementById('btn-false');
    const feedback = document.getElementById('quiz-feedback');

    // Desabilitar botões
    btnTrue.disabled = true;
    btnFalse.disabled = true;

    // Mostrar resultado visual nos botões
    if (isCorrect) {
        if (answer) {
            btnTrue.classList.add('correct');
        } else {
            btnFalse.classList.add('correct');
        }
        correctAnswers++;
    } else {
        if (answer) {
            btnTrue.classList.add('wrong');
            btnFalse.classList.add('correct');
        } else {
            btnFalse.classList.add('wrong');
            btnTrue.classList.add('correct');
        }
    }

    // Atualizar placar
    document.getElementById('quiz-score').textContent = `${correctAnswers}/${quizQuestions.length}`;

    // Mostrar feedback
    feedback.classList.remove('correct', 'wrong');
    feedback.classList.add('show', isCorrect ? 'correct' : 'wrong');
    feedback.querySelector('.feedback-icon').innerHTML = isCorrect
        ? '<i class="fas fa-check-circle"></i>'
        : '<i class="fas fa-times-circle"></i>';

    let feedbackText = isCorrect ? 'Correto!' : 'Incorreto!';
    if (question.hint && !isCorrect) {
        feedbackText += ' ' + question.hint;
    }
    feedback.querySelector('.feedback-text').textContent = feedbackText;

    // Próxima pergunta após delay
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

// ===== PREVENIR ZOOM EM TOUCH =====
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// ===== TECLADO VIRTUAL =====
function initVirtualKeyboard() {
    const input = document.getElementById('player-name');
    const display = document.getElementById('player-name-display');
    const keys = document.querySelectorAll('.kbd-key');

    const updateDisplay = () => {
        display.textContent = input.value || '_';
    };

    keys.forEach(key => {
        const handleKey = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const keyValue = key.dataset.key;

            if (keyValue === 'BACKSPACE') {
                input.value = input.value.slice(0, -1);
            } else if (keyValue === 'CLEAR') {
                input.value = '';
            } else if (input.value.length < 15) {
                input.value += keyValue;
            }
            updateDisplay();
        };

        key.addEventListener('click', handleKey);
        key.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleKey(e);
        }, { passive: false });
    });
}

// ===== IR PARA SELEÇÃO DE JOGOS =====
function goToGameSelection() {
    getPlayerName();
    document.getElementById('welcome-name').textContent = playerName;
    showScreen('screen-start');
}

// ===== SPLASH SCREEN =====
function initSplashScreen() {
    createSplashParticles();

    // Após 3 segundos, ir para tela de nome
    setTimeout(() => {
        showScreen('screen-name');
    }, 3000);
}

function createSplashParticles() {
    const container = document.getElementById('splash-particles');
    const colors = ['#ffb800', '#868fc6', '#851595', '#ff6b9d', '#4ade80'];

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'splash-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 10 + 5) + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(particle);
    }
}

// =====================================================
// DASHBOARD
// =====================================================
let tempConfig = {};
let newQuestionAnswer = true;

function initDashboard() {
    tempConfig = { ...gameConfig };

    // Cor principal
    document.getElementById('config-color').value = tempConfig.primaryColor;
    document.getElementById('color-preview').textContent = tempConfig.primaryColor;

    // Remover listeners antigos clonando elementos
    const colorInput = document.getElementById('config-color');
    const newColorInput = colorInput.cloneNode(true);
    colorInput.parentNode.replaceChild(newColorInput, colorInput);

    newColorInput.addEventListener('input', (e) => {
        tempConfig.primaryColor = e.target.value;
        document.getElementById('color-preview').textContent = e.target.value;
        document.documentElement.style.setProperty('--cor-amarelo', e.target.value);
    });

    // Cor secundária
    const secondaryColor = tempConfig.secondaryColor || '#868fc6';
    document.getElementById('config-color-secondary').value = secondaryColor;
    document.getElementById('color-secondary-preview').textContent = secondaryColor;

    const colorSecondaryInput = document.getElementById('config-color-secondary');
    const newColorSecondaryInput = colorSecondaryInput.cloneNode(true);
    colorSecondaryInput.parentNode.replaceChild(newColorSecondaryInput, colorSecondaryInput);

    newColorSecondaryInput.addEventListener('input', (e) => {
        tempConfig.secondaryColor = e.target.value;
        document.getElementById('color-secondary-preview').textContent = e.target.value;
        document.documentElement.style.setProperty('--cor-roxo', e.target.value);
    });

    // Logo preview
    if (tempConfig.logo) {
        document.getElementById('logo-preview').src = tempConfig.logo;
    } else {
        document.getElementById('logo-preview').src = 'assets/logo-png.png';
    }

    // Puzzle preview
    if (tempConfig.puzzleImage) {
        document.getElementById('puzzle-preview').src = tempConfig.puzzleImage;
    } else {
        document.getElementById('puzzle-preview').src = 'assets/logo-png.png';
    }

    renderQuizQuestions();
    renderIconsGrid();
}

function switchDashTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

function previewLogo(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            tempConfig.logo = e.target.result;
            document.getElementById('logo-preview').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function resetLogo() {
    tempConfig.logo = null;
    document.getElementById('logo-preview').src = 'assets/logo-png.png';
    document.getElementById('config-logo').value = '';
}

function previewPuzzle(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            tempConfig.puzzleImage = e.target.result;
            document.getElementById('puzzle-preview').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function resetPuzzleImage() {
    tempConfig.puzzleImage = null;
    document.getElementById('puzzle-preview').src = 'assets/logo-png.png';
    document.getElementById('config-puzzle').value = '';
}

function renderQuizQuestions() {
    const list = document.getElementById('quiz-questions-list');
    list.innerHTML = '';

    tempConfig.quizQuestions.forEach((q, index) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        item.innerHTML = `
            <span class="q-text">${q.question}</span>
            <span class="q-answer ${q.answer ? 'true' : 'false'}">${q.answer ? 'V' : 'F'}</span>
            <button class="btn-delete-q" onclick="deleteQuestion(${index})"><i class="fas fa-trash"></i></button>
        `;
        list.appendChild(item);
    });
}

function setNewAnswer(value) {
    newQuestionAnswer = value;
    document.getElementById('answer-true').classList.toggle('active', value);
    document.getElementById('answer-false').classList.toggle('active', !value);
}

function addQuizQuestion() {
    const textarea = document.getElementById('new-question');
    const question = textarea.value.trim();

    if (!question) {
        alert('Digite uma pergunta!');
        return;
    }

    tempConfig.quizQuestions.push({
        question: question,
        answer: newQuestionAnswer
    });

    textarea.value = '';
    renderQuizQuestions();
}

function deleteQuestion(index) {
    if (tempConfig.quizQuestions.length <= 3) {
        alert('O quiz precisa ter pelo menos 3 perguntas!');
        return;
    }
    tempConfig.quizQuestions.splice(index, 1);
    renderQuizQuestions();
}

function renderIconsGrid() {
    const grid = document.getElementById('icons-grid');
    grid.innerHTML = '';

    const selectedIcons = tempConfig.memoryIcons.map(i => i.icon);

    AVAILABLE_ICONS.forEach(iconData => {
        const item = document.createElement('div');
        item.className = 'icon-item' + (selectedIcons.includes(iconData.icon) ? ' selected' : '');
        item.innerHTML = `<i class="fas ${iconData.icon}"></i>`;
        item.title = iconData.name;
        item.onclick = () => toggleIcon(iconData, item);
        grid.appendChild(item);
    });

    updateIconsCount();
}

function toggleIcon(iconData, element) {
    const index = tempConfig.memoryIcons.findIndex(i => i.icon === iconData.icon);

    if (index >= 0) {
        tempConfig.memoryIcons.splice(index, 1);
        element.classList.remove('selected');
    } else {
        tempConfig.memoryIcons.push(iconData);
        element.classList.add('selected');
    }

    updateIconsCount();
}

function updateIconsCount() {
    const count = tempConfig.memoryIcons.length;
    document.getElementById('selected-count').textContent = count;
    document.getElementById('selected-count').style.color = count >= 8 ? '#4ade80' : '#ff6b6b';
}

function saveAllConfig() {
    if (tempConfig.memoryIcons.length < 8) {
        alert('Selecione pelo menos 8 ícones para o jogo da memória!');
        return;
    }

    if (tempConfig.quizQuestions.length < 3) {
        alert('Adicione pelo menos 3 perguntas para o quiz!');
        return;
    }

    gameConfig = { ...tempConfig };
    saveConfig(gameConfig);

    alert('Configurações salvas com sucesso!');
    goToStart();
}

function resetAllConfig() {
    if (confirm('Deseja restaurar todas as configurações para o padrão?')) {
        tempConfig = resetConfig();
        gameConfig = { ...DEFAULT_CONFIG };
        initDashboard();
        alert('Configurações restauradas!');
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Aplicar configurações salvas
    applyConfig(gameConfig);

    showScreen('screen-splash');
    initSplashScreen();
    initVirtualKeyboard();
});
