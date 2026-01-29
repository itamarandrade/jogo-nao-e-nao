// ===== CONFIGURAÇÃO DOS ÍCONES (FontAwesome) =====
const ICONS = [
    { icon: 'fa-heart', name: 'Coração' },
    { icon: 'fa-hand-paper', name: 'Pare' },
    { icon: 'fa-shield-heart', name: 'Proteção' },
    { icon: 'fa-star', name: 'Estrela' },
    { icon: 'fa-hands-holding-heart', name: 'Cuidado' },
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
];

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

// ===== QUEBRA-CABEÇA DESLIZANTE - VARIÁVEIS =====
let puzzleTiles = [];
let emptyIndex = 8;

// ===== CAÇA-PALAVRAS - VARIÁVEIS =====
const WORDS_TO_FIND = ['NAO', 'RESPEITO', 'AMOR', 'PAZ', 'FORCA', 'UNIAO'];
let wordSearchGrid = [];
let selectedCells = [];
let foundWords = [];
let isSelecting = false;

// ===== NAVEGAÇÃO ENTRE TELAS =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    setTimeout(() => {
        document.getElementById(screenId).classList.add('active');
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
    } else if (currentGame === 'wordsearch') {
        startWordSearchGame();
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
    getPlayerName();
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

    const selectedIcons = shuffleArray([...ICONS]).slice(0, TOTAL_PAIRS);
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
// QUEBRA-CABEÇA DESLIZANTE
// =====================================================
function startPuzzleGame() {
    getPlayerName();
    currentGame = 'puzzle';
    moves = 0;

    document.getElementById('puzzle-timer').textContent = '00:00';
    document.getElementById('puzzle-moves').textContent = '0';

    showScreen('screen-puzzle');
    startTimer('puzzle-timer');

    generatePuzzle();
}

function generatePuzzle() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';

    // Criar array de 0-8 (8 é o espaço vazio)
    puzzleTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    // Embaralhar até ser solucionável
    do {
        puzzleTiles = shuffleArray(puzzleTiles);
    } while (!isSolvable(puzzleTiles) || isPuzzleSolved());

    emptyIndex = puzzleTiles.indexOf(8);

    renderPuzzle();
}

function isSolvable(tiles) {
    let inversions = 0;
    for (let i = 0; i < tiles.length - 1; i++) {
        for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[i] !== 8 && tiles[j] !== 8 && tiles[i] > tiles[j]) {
                inversions++;
            }
        }
    }
    return inversions % 2 === 0;
}

function isPuzzleSolved() {
    for (let i = 0; i < puzzleTiles.length; i++) {
        if (puzzleTiles[i] !== i) return false;
    }
    return true;
}

function renderPuzzle() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';

    puzzleTiles.forEach((tile, index) => {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.index = index;

        if (tile === 8) {
            piece.classList.add('empty');
        } else {
            // Posição do background baseada no número da peça
            const row = Math.floor(tile / 3);
            const col = tile % 3;
            piece.style.backgroundPosition = `${col * 50}% ${row * 50}%`;
        }

        piece.addEventListener('click', () => movePuzzlePiece(index));
        piece.addEventListener('touchstart', (e) => {
            e.preventDefault();
            movePuzzlePiece(index);
        }, { passive: false });

        board.appendChild(piece);
    });

    highlightMovablePieces();
}

function highlightMovablePieces() {
    document.querySelectorAll('.puzzle-piece').forEach(p => p.classList.remove('movable'));

    const movable = getMovableIndices();
    movable.forEach(idx => {
        document.querySelector(`.puzzle-piece[data-index="${idx}"]`)?.classList.add('movable');
    });
}

function getMovableIndices() {
    const movable = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    if (row > 0) movable.push(emptyIndex - 3); // cima
    if (row < 2) movable.push(emptyIndex + 3); // baixo
    if (col > 0) movable.push(emptyIndex - 1); // esquerda
    if (col < 2) movable.push(emptyIndex + 1); // direita

    return movable;
}

function movePuzzlePiece(index) {
    const movable = getMovableIndices();
    if (!movable.includes(index)) return;

    // Trocar peças
    [puzzleTiles[index], puzzleTiles[emptyIndex]] = [puzzleTiles[emptyIndex], puzzleTiles[index]];
    emptyIndex = index;

    moves++;
    document.getElementById('puzzle-moves').textContent = moves;

    renderPuzzle();

    if (isPuzzleSolved()) {
        setTimeout(showVictory, 500);
    }
}

// =====================================================
// CAÇA-PALAVRAS
// =====================================================
function startWordSearchGame() {
    getPlayerName();
    currentGame = 'wordsearch';
    moves = 0;
    foundWords = [];
    selectedCells = [];

    document.getElementById('wordsearch-timer').textContent = '00:00';
    document.getElementById('wordsearch-found').textContent = `0/${WORDS_TO_FIND.length}`;

    showScreen('screen-wordsearch');
    startTimer('wordsearch-timer');

    generateWordSearch();
    renderWordsList();
}

function generateWordSearch() {
    const gridSize = 10;
    wordSearchGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Colocar palavras na grade
    WORDS_TO_FIND.forEach(word => {
        placeWordInGrid(word, gridSize);
    });

    // Preencher espaços vazios com letras aleatórias
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (wordSearchGrid[i][j] === '') {
                wordSearchGrid[i][j] = letters[Math.floor(Math.random() * letters.length)];
            }
        }
    }

    renderWordSearchGrid();
}

function placeWordInGrid(word, gridSize) {
    const directions = [
        { dr: 0, dc: 1 },  // horizontal
        { dr: 1, dc: 0 },  // vertical
        { dr: 1, dc: 1 },  // diagonal
    ];

    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 100) {
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const maxRow = gridSize - (dir.dr * word.length);
        const maxCol = gridSize - (dir.dc * word.length);

        if (maxRow <= 0 || maxCol <= 0) {
            attempts++;
            continue;
        }

        const startRow = Math.floor(Math.random() * maxRow);
        const startCol = Math.floor(Math.random() * maxCol);

        // Verificar se pode colocar
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
            const r = startRow + (dir.dr * i);
            const c = startCol + (dir.dc * i);
            if (wordSearchGrid[r][c] !== '' && wordSearchGrid[r][c] !== word[i]) {
                canPlace = false;
                break;
            }
        }

        if (canPlace) {
            for (let i = 0; i < word.length; i++) {
                const r = startRow + (dir.dr * i);
                const c = startCol + (dir.dc * i);
                wordSearchGrid[r][c] = word[i];
            }
            placed = true;
        }

        attempts++;
    }
}

function renderWordSearchGrid() {
    const grid = document.getElementById('wordsearch-grid');
    grid.innerHTML = '';

    wordSearchGrid.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
            const cell = document.createElement('div');
            cell.className = 'wordsearch-cell';
            cell.textContent = letter;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;

            cell.addEventListener('mousedown', () => startSelection(rowIndex, colIndex));
            cell.addEventListener('mouseenter', () => continueSelection(rowIndex, colIndex));
            cell.addEventListener('mouseup', endSelection);

            cell.addEventListener('touchstart', (e) => {
                e.preventDefault();
                startSelection(rowIndex, colIndex);
            }, { passive: false });
            cell.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                if (element && element.classList.contains('wordsearch-cell')) {
                    continueSelection(parseInt(element.dataset.row), parseInt(element.dataset.col));
                }
            }, { passive: false });
            cell.addEventListener('touchend', endSelection);

            grid.appendChild(cell);
        });
    });
}

function renderWordsList() {
    const list = document.getElementById('words-to-find');
    list.innerHTML = '';

    WORDS_TO_FIND.forEach(word => {
        const item = document.createElement('span');
        item.className = 'word-item';
        item.textContent = word;
        item.dataset.word = word;
        if (foundWords.includes(word)) {
            item.classList.add('found');
        }
        list.appendChild(item);
    });
}

function startSelection(row, col) {
    isSelecting = true;
    selectedCells = [{ row, col }];
    updateSelectionDisplay();
}

function continueSelection(row, col) {
    if (!isSelecting) return;

    const last = selectedCells[selectedCells.length - 1];
    if (last.row === row && last.col === col) return;

    // Verificar se está em linha reta
    if (selectedCells.length === 1) {
        selectedCells.push({ row, col });
    } else {
        const first = selectedCells[0];
        const dr = row - first.row;
        const dc = col - first.col;
        const len = Math.max(Math.abs(dr), Math.abs(dc));

        if (len > 0) {
            const stepR = dr / len;
            const stepC = dc / len;

            // Verificar se é direção válida (horizontal, vertical, diagonal)
            if ((stepR === 0 || stepR === 1 || stepR === -1) &&
                (stepC === 0 || stepC === 1 || stepC === -1)) {
                selectedCells = [];
                for (let i = 0; i <= len; i++) {
                    selectedCells.push({
                        row: first.row + Math.round(stepR * i),
                        col: first.col + Math.round(stepC * i)
                    });
                }
            }
        }
    }

    updateSelectionDisplay();
}

function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;

    // Verificar palavra selecionada
    const selectedWord = selectedCells.map(c => wordSearchGrid[c.row][c.col]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    if (WORDS_TO_FIND.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        foundWords.push(selectedWord);
        markCellsAsFound();
        moves++;
    } else if (WORDS_TO_FIND.includes(reversedWord) && !foundWords.includes(reversedWord)) {
        foundWords.push(reversedWord);
        markCellsAsFound();
        moves++;
    }

    document.getElementById('wordsearch-found').textContent = `${foundWords.length}/${WORDS_TO_FIND.length}`;
    renderWordsList();

    selectedCells = [];
    updateSelectionDisplay();

    if (foundWords.length === WORDS_TO_FIND.length) {
        setTimeout(showVictory, 500);
    }
}

function updateSelectionDisplay() {
    document.querySelectorAll('.wordsearch-cell').forEach(cell => {
        cell.classList.remove('selected');
    });

    selectedCells.forEach(c => {
        const cell = document.querySelector(`.wordsearch-cell[data-row="${c.row}"][data-col="${c.col}"]`);
        if (cell) cell.classList.add('selected');
    });
}

function markCellsAsFound() {
    selectedCells.forEach(c => {
        const cell = document.querySelector(`.wordsearch-cell[data-row="${c.row}"][data-col="${c.col}"]`);
        if (cell) cell.classList.add('found');
    });
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
    const keys = document.querySelectorAll('.key');

    keys.forEach(key => {
        const handleKey = (e) => {
            e.preventDefault();
            const keyValue = key.dataset.key;

            if (keyValue === 'BACKSPACE') {
                input.value = input.value.slice(0, -1);
            } else if (input.value.length < 20) {
                input.value += keyValue;
            }
        };

        key.addEventListener('click', handleKey);
        key.addEventListener('touchstart', handleKey, { passive: false });
    });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    showScreen('screen-start');
    initVirtualKeyboard();
});
