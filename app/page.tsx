'use client'

import Script from 'next/script'

export default function GamePage() {
  return (
    <>
      {/* MÚSICA DE FUNDO */}
      <audio id="bg-music" loop preload="auto">
        <source src="/audio/arcade-game.mp3" type="audio/mpeg" />
      </audio>

      {/* CONTROLE DE VOLUME */}
      <div id="volume-control" className="volume-control">
        <button id="music-toggle" className="volume-btn" title="Ligar/Desligar música">
          <i className="fas fa-volume-xmark"></i>
        </button>
        <div className="volume-slider-container">
          <input
            type="range"
            id="volume-slider"
            className="volume-slider"
            min={0}
            max={100}
            defaultValue={40}
          />
        </div>
      </div>

      {/* DECORAÇÕES DO TEMA */}
      <div id="theme-decorations" className="theme-decorations"></div>

      {/* SPLASH SCREEN */}
      <div id="screen-splash" className="screen active">
        <div className="splash-content">
          <div className="splash-logo-container">
            <img src="/assets/casa-do-patrao.jpg" alt="A Casa do Patrão" className="splash-logo" />
            <div className="splash-glow"></div>
          </div>
          <p className="splash-tap-hint">
            <i className="fas fa-hand-pointer"></i> Toque para iniciar
          </p>
        </div>
        <div className="splash-particles" id="splash-particles"></div>
      </div>

      {/* TELA INICIAL - NOME SIMPLES */}
      <div id="screen-name" className="screen">
        <div className="name-screen-content">
          <div className="logo-container">
            <img src="/assets/casa-do-patrao.jpg" alt="A Casa do Patrão" className="logo-image" />
          </div>

          <div className="name-section">
            <h2 className="name-title">Qual é o seu nome?</h2>
            <input
              type="text"
              id="player-name"
              className="input-name"
              placeholder="Digite seu nome..."
              maxLength={30}
              autoComplete="off"
              inputMode="text"
              enterKeyHint="go"
            />
          </div>

          <button
            className="btn-continue"
            onClick={() => (window as any).goToGameSelection()}
          >
            CONTINUAR <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      {/* TELA DE CADASTRO COMPLETO */}
      <div id="screen-register" className="screen">
        <div className="register-screen-content">
          <div className="logo-container">
            <img src="/assets/casa-do-patrao.jpg" alt="A Casa do Patrão" className="logo-image" />
          </div>

          <div className="register-section">
            <h2 className="register-title">Faça seu cadastro</h2>
            <p className="register-subtitle">Preencha seus dados para participar</p>

            <form id="register-form" className="register-form">
              <div className="form-group">
                <label htmlFor="reg-name">
                  <i className="fas fa-user"></i> Nome
                </label>
                <input
                  type="text"
                  id="reg-name"
                  className="form-input"
                  placeholder="Seu nome completo"
                  maxLength={50}
                  required
                  autoComplete="off"
                  inputMode="text"
                  enterKeyHint="next"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">
                  <i className="fas fa-envelope"></i> E-mail
                </label>
                <input
                  type="email"
                  id="reg-email"
                  className="form-input"
                  placeholder="seu@email.com"
                  required
                  autoComplete="off"
                  inputMode="email"
                  enterKeyHint="next"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-phone">
                  <i className="fas fa-phone"></i> Telefone
                </label>
                <input
                  type="tel"
                  id="reg-phone"
                  className="form-input"
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  autoComplete="off"
                  inputMode="tel"
                  enterKeyHint="done"
                />
              </div>

              <div className="form-group form-checkbox">
                <label className="checkbox-container">
                  <input type="checkbox" id="reg-consent" required />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">
                    Autorizo o uso dos meus dados para contato e comunicações relacionadas a esta campanha.
                  </span>
                </label>
              </div>
            </form>
          </div>

          <button
            className="btn-continue"
            onClick={() => (window as any).submitRegistration()}
          >
            JOGAR <i className="fas fa-gamepad"></i>
          </button>
        </div>
      </div>

      {/* TELA DE SELEÇÃO DE JOGOS */}
      <div id="screen-start" className="screen">
        <div className="start-content">
          <div className="welcome-header">
            <span className="welcome-text">
              Olá, <span id="welcome-name">Jogador</span>!
            </span>
            <p className="choose-text">Escolha um jogo:</p>
          </div>
          <div className="game-selection">
            <button
              id="btn-memory"
              className="btn-game-select"
              onClick={() => (window as any).startMemoryGame()}
            >
              <span className="game-icon">
                <i className="fas fa-brain"></i>
              </span>
              <div className="game-info">
                <span className="game-name">MEMÓRIA</span>
                <span className="game-desc">Encontre os pares</span>
              </div>
            </button>
            <button
              id="btn-puzzle"
              className="btn-game-select"
              onClick={() => (window as any).startPuzzleGame()}
            >
              <span className="game-icon">
                <i className="fas fa-puzzle-piece"></i>
              </span>
              <div className="game-info">
                <span className="game-name">QUEBRA-CABEÇA</span>
                <span className="game-desc">Deslize as peças</span>
              </div>
            </button>
            <button
              id="btn-quiz"
              className="btn-game-select"
              onClick={() => (window as any).startQuizGame()}
            >
              <span className="game-icon">
                <i className="fas fa-question-circle"></i>
              </span>
              <div className="game-info">
                <span className="game-name">QUIZ</span>
                <span className="game-desc">Verdadeiro ou Falso</span>
              </div>
            </button>
          </div>
          <button
            className="btn-change-name"
            onClick={() => (window as any).showScreen('screen-name')}
          >
            <i className="fas fa-user-edit"></i> Trocar nome
          </button>
          <a href="/dashboard" className="btn-dashboard" title="Configurações">
            <i className="fas fa-cog"></i>
          </a>
        </div>
        <div className="decorations">
          <span className="deco deco-1">
            <i className="fas fa-heart"></i>
          </span>
          <span className="deco deco-2">
            <i className="fas fa-hand-paper"></i>
          </span>
          <span className="deco deco-3">
            <i className="fas fa-star"></i>
          </span>
          <span className="deco deco-4">
            <i className="fas fa-shield-heart"></i>
          </span>
        </div>
      </div>

      {/* TELA DO JOGO DA MEMÓRIA */}
      <div id="screen-memory" className="screen">
        <div className="game-header">
          <div className="stat">
            <span className="stat-icon">
              <i className="fas fa-clock"></i>
            </span>
            <span className="stat-label">TEMPO</span>
            <span id="memory-timer" className="stat-value">00:00</span>
          </div>
          <div className="stat">
            <span className="stat-icon">
              <i className="fas fa-hand-pointer"></i>
            </span>
            <span className="stat-label">JOGADAS</span>
            <span id="memory-moves" className="stat-value">0</span>
          </div>
          <div className="stat">
            <span className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </span>
            <span className="stat-label">PARES</span>
            <span id="memory-pairs" className="stat-value">0/8</span>
          </div>
        </div>

        <div id="memory-board" className="game-board grid-4x4"></div>

        <button
          className="btn-quit"
          onClick={() => (window as any).quitGame()}
        >
          <i className="fas fa-times"></i> SAIR
        </button>
      </div>

      {/* TELA DO QUEBRA-CABEÇA DESLIZANTE */}
      <div id="screen-puzzle" className="screen">
        <div className="game-header">
          <div className="stat">
            <span className="stat-icon">
              <i className="fas fa-clock"></i>
            </span>
            <span className="stat-label">TEMPO</span>
            <span id="puzzle-timer" className="stat-value">00:00</span>
          </div>
          <div className="stat">
            <span className="stat-icon">
              <i className="fas fa-hand-pointer"></i>
            </span>
            <span className="stat-label">MOVIMENTOS</span>
            <span id="puzzle-moves" className="stat-value">0</span>
          </div>
        </div>

        <div className="puzzle-container">
          <div className="puzzle-area">
            <div id="puzzle-board" className="puzzle-board"></div>
            <div id="puzzle-pieces" className="puzzle-pieces"></div>
          </div>
        </div>

        <p className="puzzle-hint">Arraste as peças para encaixar no quadro</p>

        <button
          className="btn-quit"
          onClick={() => (window as any).quitGame()}
        >
          <i className="fas fa-times"></i> SAIR
        </button>
      </div>

      {/* TELA DO QUIZ */}
      <div id="screen-quiz" className="screen">
        <div className="game-header">
          <div className="stat">
            <span className="stat-icon">
              <i className="fas fa-clock"></i>
            </span>
            <span className="stat-label">TEMPO</span>
            <span id="quiz-timer" className="stat-value">00:00</span>
          </div>
          <div className="stat">
            <span className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </span>
            <span className="stat-label">ACERTOS</span>
            <span id="quiz-score" className="stat-value">0/0</span>
          </div>
        </div>

        <div className="quiz-container">
          <div className="quiz-progress">
            <div id="quiz-progress-bar" className="quiz-progress-bar"></div>
          </div>

          <div className="quiz-question-box">
            <span className="quiz-number">
              Pergunta <span id="quiz-current">1</span> de{' '}
              <span id="quiz-total">10</span>
            </span>
            <p id="quiz-question" className="quiz-question-text">
              Carregando pergunta...
            </p>
          </div>

          <div className="quiz-answers">
            <button
              id="btn-true"
              className="btn-quiz-answer btn-true"
              onClick={() => (window as any).answerQuiz(true)}
            >
              <i className="fas fa-check"></i> SIM
            </button>
            <button
              id="btn-false"
              className="btn-quiz-answer btn-false"
              onClick={() => (window as any).answerQuiz(false)}
            >
              <i className="fas fa-times"></i> NÃO
            </button>
          </div>

          <div id="quiz-feedback" className="quiz-feedback">
            <span className="feedback-icon"></span>
            <span className="feedback-text"></span>
          </div>
        </div>

        <button
          className="btn-quit"
          onClick={() => (window as any).quitGame()}
        >
          <i className="fas fa-times"></i> SAIR
        </button>
      </div>

      {/* TELA DE VITÓRIA */}
      <div id="screen-victory" className="screen">
        <div className="victory-content">
          <div className="victory-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <h2>
            PARABÉNS, <span id="winner-name">Jogador</span>!
          </h2>
          <p className="victory-text">Você completou o jogo!</p>

          <div className="victory-stats">
            <div className="victory-stat">
              <span className="vs-icon">
                <i className="fas fa-clock"></i>
              </span>
              <span className="vs-label">Tempo</span>
              <span id="final-time" className="vs-value">00:00</span>
            </div>
            <div className="victory-stat">
              <span className="vs-icon">
                <i className="fas fa-hand-pointer"></i>
              </span>
              <span className="vs-label">Movimentos</span>
              <span id="final-moves" className="vs-value">0</span>
            </div>
          </div>

          <div className="victory-buttons">
            <button
              className="btn-play-again"
              onClick={() => (window as any).playAgain()}
            >
              <i className="fas fa-redo"></i> JOGAR NOVAMENTE
            </button>
            <button
              className="btn-home"
              onClick={() => (window as any).goToStart()}
            >
              <i className="fas fa-home"></i> INÍCIO
            </button>
          </div>
        </div>
        <div className="confetti" id="confetti"></div>
      </div>

      <Script src="/game.js" strategy="afterInteractive" />
    </>
  )
}
