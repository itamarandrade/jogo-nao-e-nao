// ===== SISTEMA DE MÚSICA E EFEITOS SONOROS =====
let bgMusic = null;
let isMusicPlaying = false;
let musicInitialized = false;
let currentVolume = 0.4;
let audioContext = null;

function initMusic() {
    bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeControl = document.getElementById('volume-control');

    if (!bgMusic || !musicToggle) return;

    // Load volume from localStorage
    const savedVolume = localStorage.getItem('gameVolume');
    if (savedVolume !== null) {
        currentVolume = parseFloat(savedVolume);
    }

    bgMusic.volume = currentVolume;

    if (volumeSlider) {
        volumeSlider.value = currentVolume * 100;
        updateVolumeSliderBackground(volumeSlider, currentVolume * 100);

        // Volume slider event
        volumeSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            currentVolume = value / 100;
            bgMusic.volume = currentVolume;
            localStorage.setItem('gameVolume', currentVolume.toString());
            updateVolumeSliderBackground(e.target, value);
            updateVolumeIcon();

            // If slider moved and music not playing, start it
            if (value > 0 && !isMusicPlaying && musicInitialized) {
                playMusic();
            }
            // If slider at 0, mute
            if (value === 0 && isMusicPlaying) {
                pauseMusic();
            }
        });
    }

    // Load music preference from localStorage
    const musicPreference = localStorage.getItem('musicEnabled');
    const shouldPlay = musicPreference !== 'false';

    // Click handler for toggle button
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
    });

    // Mobile: expand on touch, collapse when touching outside
    if (volumeControl) {
        volumeControl.addEventListener('touchstart', (e) => {
            volumeControl.classList.add('expanded');
        });

        document.addEventListener('touchstart', (e) => {
            if (!volumeControl.contains(e.target)) {
                volumeControl.classList.remove('expanded');
            }
        });
    }

    // Start music on first user interaction
    const startMusicOnInteraction = () => {
        if (!musicInitialized) {
            musicInitialized = true;
            if (shouldPlay && currentVolume > 0) {
                playMusic();
            }
        }
        document.removeEventListener('click', startMusicOnInteraction);
        document.removeEventListener('touchstart', startMusicOnInteraction);
    };

    document.addEventListener('click', startMusicOnInteraction);
    document.addEventListener('touchstart', startMusicOnInteraction);

    // Initialize Web Audio API for sound effects
    initAudioContext();
}

function initAudioContext() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function updateVolumeSliderBackground(slider, value) {
    slider.style.setProperty('--volume-percent', value + '%');
    slider.style.background = `linear-gradient(to right, var(--cor-amarelo) 0%, var(--cor-amarelo) ${value}%, rgba(255,255,255,0.3) ${value}%, rgba(255,255,255,0.3) 100%)`;

    const volumeControl = document.getElementById('volume-control');
    if (volumeControl && isMusicPlaying) {
        slider.style.background = `linear-gradient(to right, #4ade80 0%, #4ade80 ${value}%, rgba(255,255,255,0.3) ${value}%, rgba(255,255,255,0.3) 100%)`;
    }
}

function playMusic() {
    if (!bgMusic) return;

    bgMusic.play().then(() => {
        isMusicPlaying = true;
        updateMusicButton();
        localStorage.setItem('musicEnabled', 'true');
    }).catch(err => {
        console.log('Autoplay blocked, waiting for user interaction');
    });
}

function pauseMusic() {
    if (!bgMusic) return;

    bgMusic.pause();
    isMusicPlaying = false;
    updateMusicButton();
    localStorage.setItem('musicEnabled', 'false');
}

function toggleMusic() {
    if (isMusicPlaying) {
        pauseMusic();
    } else {
        // Restore volume if it was at 0
        if (currentVolume === 0) {
            currentVolume = 0.4;
            bgMusic.volume = currentVolume;
            const volumeSlider = document.getElementById('volume-slider');
            if (volumeSlider) {
                volumeSlider.value = 40;
                updateVolumeSliderBackground(volumeSlider, 40);
            }
            localStorage.setItem('gameVolume', currentVolume.toString());
        }
        playMusic();
    }
}

function updateVolumeIcon() {
    const musicToggle = document.getElementById('music-toggle');
    if (!musicToggle) return;

    const volumeSlider = document.getElementById('volume-slider');
    const value = volumeSlider ? parseInt(volumeSlider.value) : currentVolume * 100;

    let icon;
    if (value === 0 || !isMusicPlaying) {
        icon = 'fa-volume-xmark';
    } else if (value < 33) {
        icon = 'fa-volume-off';
    } else if (value < 66) {
        icon = 'fa-volume-low';
    } else {
        icon = 'fa-volume-high';
    }

    musicToggle.innerHTML = `<i class="fas ${icon}"></i>`;
}

function updateMusicButton() {
    const musicToggle = document.getElementById('music-toggle');
    const volumeControl = document.getElementById('volume-control');
    const volumeSlider = document.getElementById('volume-slider');

    if (!musicToggle) return;

    if (isMusicPlaying) {
        musicToggle.title = 'Desligar música';
        if (volumeControl) volumeControl.classList.add('playing');
        if (volumeSlider) {
            const value = parseInt(volumeSlider.value);
            updateVolumeSliderBackground(volumeSlider, value);
        }
    } else {
        musicToggle.title = 'Ligar música';
        if (volumeControl) volumeControl.classList.remove('playing');
        if (volumeSlider) {
            const value = parseInt(volumeSlider.value);
            volumeSlider.style.background = `linear-gradient(to right, var(--cor-amarelo) 0%, var(--cor-amarelo) ${value}%, rgba(255,255,255,0.3) ${value}%, rgba(255,255,255,0.3) 100%)`;
        }
    }
    updateVolumeIcon();
}

// ===== CONTROLE DE VOLUME DURANTE JOGOS =====
let isInGame = false;
let originalVolume = 0.4;

function enterGameMode() {
    if (!bgMusic) return;
    isInGame = true;
    originalVolume = currentVolume;
    // Diminui música de fundo para 15% do volume original durante o jogo
    bgMusic.volume = currentVolume * 0.15;
}

function exitGameMode() {
    if (!bgMusic) return;
    isInGame = false;
    // Restaura volume original
    bgMusic.volume = currentVolume;
}

// ===== SISTEMA DE EFEITOS SONOROS =====
function playSoundEffect(type) {
    if (!audioContext) {
        initAudioContext();
    }
    if (!audioContext) return;

    // Resume context if suspended (required for user interaction policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Efeitos sonoros usam volume cheio (baseado no volume original, não no diminuído)
    const baseVolume = isInGame ? originalVolume : currentVolume;
    const effectVolume = baseVolume * 1.2; // Efeitos 20% mais altos que a música normal

    switch(type) {
        case 'click':
            playClickSound(effectVolume);
            break;
        case 'flip':
            playFlipSound(effectVolume);
            break;
        case 'match':
            playMatchSound(effectVolume);
            break;
        case 'wrong':
            playWrongSound(effectVolume);
            break;
        case 'victory':
            playVictorySound(effectVolume);
            break;
        case 'correct':
            playCorrectSound(effectVolume);
            break;
        case 'place':
            playPlaceSound(effectVolume);
            break;
    }
}

function playClickSound(volume) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playFlipSound(volume) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.08);

    gainNode.gain.setValueAtTime(volume * 0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playMatchSound(volume) {
    // Play a pleasant chord
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major)

    frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

        const startTime = audioContext.currentTime + i * 0.05;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.5);
    });
}

function playWrongSound(volume) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(volume * 0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.25);
}

function playVictorySound(volume) {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

        const startTime = audioContext.currentTime + i * 0.15;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume * 0.25, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.6);
    });
}

function playCorrectSound(volume) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.15);

    gainNode.gain.setValueAtTime(volume * 0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.25);
}

function playPlaceSound(volume) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(volume * 0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// ===== TEMAS DISPONÍVEIS =====
const THEMES = {
    patrao: {
        name: 'Casa do Patrão',
        icon: 'fa-crown',
        primaryColor: '#d4a017',
        secondaryColor: '#c0392b',
        bgGradient: 'linear-gradient(145deg, #0a0a0a 0%, #1a0a00 40%, #2c1200 70%, #0f0f0f 100%)',
        decorations: 'carnaval'
    },
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
    theme: 'patrao',
    primaryColor: '#d4a017',
    secondaryColor: '#c0392b',
    logo: null, // null = usar assets/casa-do-patrao.jpg
    puzzleImage: null, // null = usar assets/casa-do-patrao.jpg
    registrationEnabled: false, // true = formulário completo, false = só nome
    gamesEnabled: {
        memory: true,
        puzzle: true,
        quiz: true
    },
    quizQuestions: [
        // 🟢 NÍVEL FÁCIL (10 perguntas)
        { question: "\"Não\" significa \"não\", mesmo que a pessoa esteja sorrindo?", answer: true, level: "easy", awareness: "Sorriso não é consentimento." },
        { question: "Insistir depois de ouvir \"não\" é errado?", answer: true, level: "easy", awareness: "Insistência é desrespeito." },
        { question: "Silêncio significa consentimento?", answer: false, level: "easy", awareness: "Consentimento precisa ser claro." },
        { question: "Uma pessoa pode mudar de ideia depois de dizer \"sim\"?", answer: true, level: "easy", awareness: "Consentimento pode ser retirado." },
        { question: "Beijo sem permissão é violência?", answer: true, level: "easy", awareness: "Qualquer contato sem consentimento é violência." },
        { question: "Segurar alguém pelo braço sem autorização é errado?", answer: true, level: "easy", awareness: "Tocar sem permissão é violência." },
        { question: "Se alguém disser \"para\", a outra pessoa deve parar imediatamente?", answer: true, level: "easy", awareness: "Parar é obrigatório." },
        { question: "Roupas curtas significam que a pessoa quer contato?", answer: false, level: "easy", awareness: "Roupa não é convite." },
        { question: "Em situação de perigo imediato, ligar 190 é correto?", answer: true, level: "easy", awareness: "190 aciona a Polícia Militar." },
        { question: "Pedir ajuda à equipe do evento é um direito da vítima?", answer: true, level: "easy", awareness: "A vítima não está sozinha." },

        // 🟡 NÍVEL MÉDIO (10 perguntas)
        { question: "Flertar dá direito a tocar sem permissão?", answer: false, level: "medium", awareness: "Flertar não é autorização." },
        { question: "Se a pessoa estiver bêbada, o consentimento é válido?", answer: false, level: "medium", awareness: "Sem consciência, não há consentimento." },
        { question: "A Lei Maria da Penha protege apenas mulheres casadas?", answer: false, level: "medium", awareness: "Vale para namoro, ex e outras relações." },
        { question: "A Lei Maria da Penha só se aplica em agressão física?", answer: false, level: "medium", awareness: "Vale também para violência psicológica, moral e sexual." },
        { question: "Divulgar foto íntima sem autorização é crime? (Lei Carolina Dieckmann)", answer: true, level: "medium", awareness: "Expor intimidade sem consentimento é crime." },
        { question: "Comentários de cunho sexual podem ser assédio?", answer: true, level: "medium", awareness: "Palavras também ferem." },
        { question: "Seguir alguém de forma insistente pode ser assédio?", answer: true, level: "medium", awareness: "Intimidação também é violência." },
        { question: "A vítima pode procurar ajuda mesmo sem denunciar?", answer: true, level: "medium", awareness: "Apoio independe de denúncia." },
        { question: "O telefone 180 orienta e encaminha mulheres para a rede de apoio?", answer: true, level: "medium", awareness: "180 é gratuito e funciona 24h." },
        { question: "Culpar a vítima pela violência é correto?", answer: false, level: "medium", awareness: "A culpa nunca é da vítima." },

        // 🔴 NÍVEL DIFÍCIL (10 perguntas)
        { question: "Importunação sexual é crime no Brasil?", answer: true, level: "hard", awareness: "Lei nº 13.718/2018." },
        { question: "Beijo forçado pode ser enquadrado como crime?", answer: true, level: "hard", awareness: "Pode configurar importunação sexual." },
        { question: "Estar alcoolizado isenta alguém de responsabilidade criminal?", answer: false, level: "hard", awareness: "Álcool não justifica crime." },
        { question: "A palavra da vítima tem valor legal?", answer: true, level: "hard", awareness: "A Justiça reconhece seu valor." },
        { question: "O Protocolo \"Não é Não\" é previsto em lei?", answer: true, level: "hard", awareness: "Lei nº 14.786/2023." },
        { question: "O protocolo determina acolhimento humanizado e sem julgamento?", answer: true, level: "hard", awareness: "A vítima deve ser respeitada." },
        { question: "A vítima deve ser afastada do agressor e colocada em local seguro?", answer: true, level: "hard", awareness: "Segurança vem primeiro." },
        { question: "Em caso de violência sexual ou risco imediato, ligar 190 é correto?", answer: true, level: "hard", awareness: "Polícia Militar garante proteção imediata." },
        { question: "Em necessidade de atendimento médico urgente, o número correto é 192?", answer: true, level: "hard", awareness: "192 aciona o SAMU." },
        { question: "A vítima pode denunciar mesmo sem testemunhas?", answer: true, level: "hard", awareness: "A denúncia é um direito." }
    ],
    memoryIcons: [
        { icon: 'fa-crown', name: 'Patrão' },
        { icon: 'fa-house', name: 'Casa' },
        { icon: 'fa-key', name: 'Chave' },
        { icon: 'fa-trophy', name: 'Troféu' },
        { icon: 'fa-eye', name: 'Vigilância' },
        { icon: 'fa-suitcase', name: 'Mala' },
        { icon: 'fa-users', name: 'Participantes' },
        { icon: 'fa-champagne-glasses', name: 'Festa' }
    ]
};

// Lista completa de imagens disponíveis para seleção no Dashboard
const AVAILABLE_ICONS = [
    { icon: 'fa-crown', name: 'Patrão' },
    { icon: 'fa-house', name: 'Casa' },
    { icon: 'fa-key', name: 'Chave' },
    { icon: 'fa-trophy', name: 'Troféu' },
    { icon: 'fa-eye', name: 'Vigilância' },
    { icon: 'fa-suitcase', name: 'Mala' },
    { icon: 'fa-users', name: 'Participantes' },
    { icon: 'fa-champagne-glasses', name: 'Festa' },
    { icon: 'fa-lock', name: 'Confinamento' },
    { icon: 'fa-tv', name: 'TV' },
    { icon: 'fa-camera', name: 'Câmera' },
    { icon: 'fa-fire', name: 'Drama' },
    { icon: 'fa-star', name: 'Destaque' },
    { icon: 'fa-gavel', name: 'Julgamento' },
    { icon: 'fa-shield-halved', name: 'Imunidade' },
    { icon: 'fa-door-open', name: 'Eliminação' }
];

// ===== FUNÇÕES DE CONFIGURAÇÃO (localStorage) =====
function loadConfig() {
    try {
        const saved = localStorage.getItem('gameConfig');
        if (saved) {
            const config = JSON.parse(saved);
            // Mesclar com padrão para garantir que todas as propriedades existam
            const merged = { ...DEFAULT_CONFIG, ...config };

            // Se as perguntas salvas não têm level/awareness, usar as padrão
            if (config.quizQuestions && config.quizQuestions.length > 0) {
                const hasLevels = config.quizQuestions.some(q => q.level);
                if (!hasLevels) {
                    merged.quizQuestions = DEFAULT_CONFIG.quizQuestions;
                }
            }

            return merged;
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
    const logoSrc = config.logo || '/assets/casa-do-patrao.jpg';
    document.querySelectorAll('.splash-logo, .logo-image').forEach(img => {
        img.src = logoSrc;
    });

    // Aplicar marca d'água nas telas de jogo
    applyWatermark(logoSrc);

    // Aplicar imagem do puzzle (será usado quando o puzzle for gerado)
    window.puzzleImageSrc = config.puzzleImage || '/assets/casa-do-patrao.jpg';

    // Aplicar jogos habilitados
    const gamesEnabled = config.gamesEnabled || { memory: true, puzzle: true, quiz: true };

    const memoryBtn = document.getElementById('btn-memory');
    const puzzleBtn = document.getElementById('btn-puzzle');
    const quizBtn = document.getElementById('btn-quiz');

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
    exitGameMode();
    currentGame = null;
    showScreen('screen-start');
}

function quitGame() {
    stopTimer();
    exitGameMode();
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
    exitGameMode();
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
    playSoundEffect('click');
    enterGameMode();
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

        const cardBack = card.image
            ? `<img src="${card.image}" alt="${card.name}" style="width:100%;height:100%;object-fit:contain;padding:8px;box-sizing:border-box;">`
            : `<i class="fas ${card.icon}"></i>`;
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-front"></div>
                <div class="card-face card-back">${cardBack}</div>
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

    playSoundEffect('flip');
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
        playSoundEffect('match');
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            document.getElementById('memory-pairs').textContent = `${matchedPairs}/${TOTAL_PAIRS}`;
            flippedCards = [];
            isLocked = false;

            if (matchedPairs === TOTAL_PAIRS) {
                playSoundEffect('victory');
                setTimeout(showVictory, 500);
            }
        }, 300);
    } else {
        playSoundEffect('wrong');
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
    playSoundEffect('click');
    enterGameMode();
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
    const puzzleImage = gameConfig.puzzleImage || '/assets/casa-do-patrao.jpg';

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
    const puzzleImage = gameConfig.puzzleImage || '/assets/casa-do-patrao.jpg';
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

    playSoundEffect('place');
    moves++;
    document.getElementById('puzzle-moves').textContent = moves;

    // Verificar vitória
    if (isPuzzleSolved()) {
        playSoundEffect('victory');
        setTimeout(showVictory, 500);
    }
}

// ===== RETURN PIECE TO POOL =====
function returnPieceToPool() {
    if (dragSourceSlot === null) return;

    const puzzleImage = gameConfig.puzzleImage || '/assets/casa-do-patrao.jpg';
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
    playSoundEffect('click');
    enterGameMode();
    currentGame = 'quiz';
    moves = 0;
    currentQuestionIndex = 0;
    correctAnswers = 0;
    quizAnswered = false;

    // Selecionar perguntas por nível: 2 fáceis, 3 médias, 5 difíceis
    const allQuestions = gameConfig.quizQuestions;

    const easyQuestions = shuffleArray(allQuestions.filter(q => q.level === 'easy'));
    const mediumQuestions = shuffleArray(allQuestions.filter(q => q.level === 'medium'));
    const hardQuestions = shuffleArray(allQuestions.filter(q => q.level === 'hard'));
    const otherQuestions = shuffleArray(allQuestions.filter(q => !q.level)); // Perguntas sem nível definido

    // Selecionar a quantidade desejada de cada nível
    let selectedQuestions = [
        ...easyQuestions.slice(0, 2),
        ...mediumQuestions.slice(0, 3),
        ...hardQuestions.slice(0, 5)
    ];

    // Se não tiver perguntas suficientes com níveis, completar com perguntas sem nível ou repetir
    if (selectedQuestions.length < 10 && otherQuestions.length > 0) {
        const remaining = 10 - selectedQuestions.length;
        selectedQuestions = [...selectedQuestions, ...otherQuestions.slice(0, remaining)];
    }

    // Embaralhar as perguntas selecionadas
    quizQuestions = shuffleArray(selectedQuestions);

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
        playSoundEffect('victory');
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
        playSoundEffect('correct');
        if (answer) {
            btnTrue.classList.add('correct');
        } else {
            btnFalse.classList.add('correct');
        }
        correctAnswers++;
    } else {
        playSoundEffect('wrong');
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

    // Mostrar feedback com mensagem de conscientização (sempre aparece)
    feedback.classList.remove('correct', 'wrong');
    feedback.classList.add('show', isCorrect ? 'correct' : 'wrong');
    feedback.querySelector('.feedback-icon').innerHTML = isCorrect
        ? '<i class="fas fa-check-circle"></i>'
        : '<i class="fas fa-times-circle"></i>';

    // Sempre mostrar a mensagem de conscientização
    let feedbackText = isCorrect ? 'Correto! ' : 'Incorreto! ';
    if (question.awareness) {
        feedbackText += question.awareness;
    }
    feedback.querySelector('.feedback-text').textContent = feedbackText;

    // Próxima pergunta após delay (aumentado para dar tempo de ler a conscientização)
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 3000);
}

// ===== PREVENIR ZOOM EM TOUCH =====
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

// ===== DADOS DOS JOGADORES (CSV) =====
const PLAYERS_STORAGE_KEY = 'game_players_data';

function getPlayersData() {
    const data = localStorage.getItem(PLAYERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function savePlayerData(playerData) {
    const players = getPlayersData();
    players.push({
        ...playerData,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR')
    });
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
}

function exportPlayersCSV() {
    const players = getPlayersData();
    if (players.length === 0) {
        alert('Nenhum dado para exportar!');
        return;
    }

    const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Consentimento', 'Data', 'Hora'];
    const rows = players.map(p => [
        p.id,
        p.name || '',
        p.email || '',
        p.phone || '',
        p.consent ? 'Sim' : 'Não',
        p.date || '',
        p.time || ''
    ]);

    const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `jogadores_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

function clearPlayersData() {
    if (confirm('Tem certeza que deseja limpar TODOS os dados dos jogadores? Esta ação não pode ser desfeita!')) {
        localStorage.removeItem(PLAYERS_STORAGE_KEY);
        alert('Dados limpos com sucesso!');
        if (typeof renderPlayersTable === 'function') {
            renderPlayersTable();
        }
        if (typeof updateStats === 'function') {
            updateStats();
        }
    }
}

function getPlayersStats() {
    const players = getPlayersData();
    const today = new Date().toLocaleDateString('pt-BR');
    const todayPlayers = players.filter(p => p.date === today);
    const withEmail = players.filter(p => p.email && p.email.trim() !== '');

    return {
        total: players.length,
        today: todayPlayers.length,
        withRegistration: withEmail.length,
        onlyName: players.length - withEmail.length
    };
}

// ===== FORMULÁRIO DE CADASTRO =====
function isRegistrationEnabled() {
    return gameConfig.registrationEnabled === true;
}

function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
        value = `(${value}`;
    }

    input.value = value;
}

function submitRegistration() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const consent = document.getElementById('reg-consent').checked;

    if (!name) {
        alert('Por favor, informe seu nome!');
        return;
    }

    if (!email) {
        alert('Por favor, informe seu e-mail!');
        return;
    }

    if (!consent) {
        alert('Você precisa autorizar o uso dos seus dados para continuar!');
        return;
    }

    // Salvar dados
    savePlayerData({
        name: name,
        email: email,
        phone: phone,
        consent: consent,
        registered: true
    });

    // Definir nome do jogador
    playerName = name.split(' ')[0]; // Primeiro nome
    document.getElementById('welcome-name').textContent = playerName;

    // Limpar formulário
    document.getElementById('register-form').reset();

    // Ir para seleção de jogos
    showScreen('screen-start');
}

// ===== IR PARA SELEÇÃO DE JOGOS =====
function goToGameSelection() {
    playSoundEffect('click');
    getPlayerName();

    // Salvar dados mesmo no modo simples (só nome)
    if (!isRegistrationEnabled()) {
        savePlayerData({
            name: playerName,
            email: '',
            phone: '',
            consent: false,
            registered: false
        });
    }

    document.getElementById('welcome-name').textContent = playerName;
    showScreen('screen-start');
}

// ===== SPLASH SCREEN =====
function initSplashScreen() {
    createSplashParticles();

    // Adiciona evento de clique na splash screen
    const splashScreen = document.getElementById('screen-splash');
    splashScreen.addEventListener('click', handleSplashClick);
    splashScreen.addEventListener('touchend', handleSplashClick);
}

function handleSplashClick(e) {
    e.preventDefault();
    const splashScreen = document.getElementById('screen-splash');

    // Remove os listeners para evitar múltiplos cliques
    splashScreen.removeEventListener('click', handleSplashClick);
    splashScreen.removeEventListener('touchend', handleSplashClick);

    // Vai para a tela apropriada
    if (isRegistrationEnabled()) {
        showScreen('screen-register');
    } else {
        showScreen('screen-name');
    }
}

// Inicializar máscara de telefone
function initPhoneMask() {
    const phoneInput = document.getElementById('reg-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', () => formatPhone(phoneInput));
    }
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
let newQuestionLevel = 'medium';

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
        document.getElementById('logo-preview').src = '/assets/casa-do-patrao.jpg';
    }

    // Puzzle preview
    if (tempConfig.puzzleImage) {
        document.getElementById('puzzle-preview').src = tempConfig.puzzleImage;
    } else {
        document.getElementById('puzzle-preview').src = '/assets/casa-do-patrao.jpg';
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
    document.getElementById('logo-preview').src = '/assets/casa-do-patrao.jpg';
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
    document.getElementById('puzzle-preview').src = '/assets/casa-do-patrao.jpg';
    document.getElementById('config-puzzle').value = '';
}

function renderQuizQuestions() {
    const list = document.getElementById('quiz-questions-list');
    list.innerHTML = '';

    const levelLabels = { easy: '🟢', medium: '🟡', hard: '🔴' };
    const levelNames = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };

    tempConfig.quizQuestions.forEach((q, index) => {
        const item = document.createElement('div');
        item.className = 'question-item';
        const levelEmoji = levelLabels[q.level] || '⚪';
        const levelName = levelNames[q.level] || 'Sem nível';
        item.innerHTML = `
            <span class="q-level" title="${levelName}">${levelEmoji}</span>
            <span class="q-text">${q.question}</span>
            <span class="q-answer ${q.answer ? 'true' : 'false'}">${q.answer ? 'V' : 'F'}</span>
            <button class="btn-delete-q" onclick="deleteQuestion(${index})"><i class="fas fa-trash"></i></button>
        `;
        list.appendChild(item);
    });

    // Mostrar contagem por nível
    const easyCount = tempConfig.quizQuestions.filter(q => q.level === 'easy').length;
    const mediumCount = tempConfig.quizQuestions.filter(q => q.level === 'medium').length;
    const hardCount = tempConfig.quizQuestions.filter(q => q.level === 'hard').length;

    const countInfo = document.getElementById('quiz-level-count');
    if (countInfo) {
        countInfo.innerHTML = `🟢 Fácil: ${easyCount} | 🟡 Médio: ${mediumCount} | 🔴 Difícil: ${hardCount}`;
    }
}

function setNewAnswer(value) {
    newQuestionAnswer = value;
    document.getElementById('answer-true').classList.toggle('active', value);
    document.getElementById('answer-false').classList.toggle('active', !value);
}

function setNewLevel(level) {
    newQuestionLevel = level;
    document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.level-btn[data-level="${level}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

function addQuizQuestion() {
    const textarea = document.getElementById('new-question');
    const awarenessInput = document.getElementById('new-awareness');
    const question = textarea.value.trim();
    const awareness = awarenessInput ? awarenessInput.value.trim() : '';

    if (!question) {
        alert('Digite uma pergunta!');
        return;
    }

    if (!awareness) {
        alert('Digite a mensagem de conscientização!');
        return;
    }

    tempConfig.quizQuestions.push({
        question: question,
        answer: newQuestionAnswer,
        level: newQuestionLevel,
        awareness: awareness
    });

    textarea.value = '';
    if (awarenessInput) awarenessInput.value = '';
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

    const selectedNames = tempConfig.memoryIcons.map(i => i.name);

    AVAILABLE_ICONS.forEach(iconData => {
        const item = document.createElement('div');
        item.className = 'icon-item' + (selectedNames.includes(iconData.name) ? ' selected' : '');
        item.innerHTML = iconData.image
            ? `<img src="${iconData.image}" alt="${iconData.name}" style="width:48px;height:48px;object-fit:contain;">`
            : `<i class="fas ${iconData.icon}"></i>`;
        item.title = iconData.name;
        item.onclick = () => toggleIcon(iconData, item);
        grid.appendChild(item);
    });

    updateIconsCount();
}

function toggleIcon(iconData, element) {
    const index = tempConfig.memoryIcons.findIndex(i => i.name === iconData.name);

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
function initGame() {
    // Aplicar configurações salvas
    applyConfig(gameConfig);

    // Inicializar sistema de música
    // initMusic();

    showScreen('screen-splash');
    initSplashScreen();
    initPhoneMask();
}

// Suporta tanto carregamento normal (DOMContentLoaded) quanto Next.js (DOM já pronto)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
