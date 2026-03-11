'use client'

import Script from 'next/script'

export default function DashboardPage() {
  return (
    <>
      <style>{`
        body { display: block; }
        #screen-dashboard {
          position: relative;
          display: flex !important;
          opacity: 1;
          height: 100vh;
        }
        .dashboard-content { height: 100%; }

        @media (orientation: portrait) {
          .dashboard-main { flex-direction: column; }
          .dashboard-tabs {
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
            padding: 8px;
            border-right: none;
            border-bottom: 2px solid rgba(255,255,255,0.1);
            gap: 5px;
          }
          .tab-btn {
            flex: 0 0 auto;
            padding: 8px 12px;
            flex-direction: row;
            gap: 6px;
            font-size: 9px;
          }
          .tab-btn i { font-size: 14px; }
          .dashboard-body { padding: 15px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .stat-card { padding: 12px; }
          .stat-icon { width: 40px; height: 40px; font-size: 18px; }
          .stat-number { font-size: 22px; }
          .stat-label { font-size: 10px; }
          .players-table-container { max-height: 200px; }
          .players-table { font-size: 12px; }
          .players-table th, .players-table td { padding: 8px 10px; }
          .players-actions { flex-wrap: wrap; }
          .btn-export, .btn-clear-data { padding: 8px 15px; font-size: 12px; }
          .config-section { padding: 12px; margin-bottom: 12px; }
          .themes-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .theme-card { padding: 12px; }
          .icons-grid { height: calc(100vh - 380px); min-height: 150px; }
          .icon-item { width: 50px; height: 50px; font-size: 20px; }
          .dashboard-footer { padding: 12px 15px; }
          .btn-reset-all, .btn-save-config { padding: 10px; font-size: 12px; }
        }

        @media (orientation: landscape) {
          .dashboard-tabs { width: 80px; }
          .tab-btn { padding: 10px 6px; font-size: 9px; }
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
          .stat-card { flex-direction: column; text-align: center; padding: 12px 8px; gap: 8px; }
          .stat-icon { width: 45px; height: 45px; }
          .players-table-container { max-height: 300px; }
          .themes-grid { grid-template-columns: repeat(4, 1fr); }
          .icons-grid { height: calc(100vh - 230px); }
          .icon-item { width: 55px; height: 55px; }
        }

        @media (orientation: landscape) and (max-height: 500px) {
          .dashboard-header { padding: 10px 15px; }
          .dashboard-header h2 { font-size: 16px; }
          .dashboard-tabs { width: 65px; padding: 5px; }
          .tab-btn { padding: 8px 5px; font-size: 8px; }
          .tab-btn i { font-size: 16px; }
          .dashboard-body { padding: 10px 15px; }
          .stats-grid { gap: 8px; }
          .stat-card { padding: 10px 5px; }
          .stat-icon { width: 35px; height: 35px; font-size: 16px; }
          .stat-number { font-size: 20px; }
          .config-section { padding: 10px; margin-bottom: 10px; }
          .config-label { font-size: 12px; margin-bottom: 8px; }
          .icons-grid { height: calc(100vh - 200px); }
          .icon-item { width: 45px; height: 45px; font-size: 18px; }
          .dashboard-footer { padding: 8px 15px; }
        }

        .quiz-info {
          font-size: 14px;
          color: var(--cor-amarelo);
          margin-bottom: 5px;
          text-align: center;
        }
        .quiz-distribution-hint {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 15px;
          text-align: center;
          font-style: italic;
        }
        .question-item .q-level { font-size: 16px; flex-shrink: 0; margin-right: 8px; }
        .level-toggle { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; flex-wrap: wrap; }
        .level-toggle span { font-size: 12px; color: rgba(255, 255, 255, 0.7); }
        .level-btn {
          padding: 6px 12px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .level-btn:hover { background: rgba(255, 255, 255, 0.2); }
        .level-btn.active { border-color: var(--cor-amarelo); background: rgba(255, 184, 0, 0.2); }
        #new-awareness {
          width: 100%;
          padding: 10px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 13px;
          resize: vertical;
          min-height: 50px;
          margin-bottom: 10px;
          font-family: inherit;
        }
        #new-awareness::placeholder { color: rgba(255, 255, 255, 0.5); }
        #new-awareness:focus { outline: none; border-color: var(--cor-amarelo); }
      `}</style>

      {/* TELA DO DASHBOARD */}
      <div id="screen-dashboard" className="screen active">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <h2>
              <i className="fas fa-cog"></i> Painel de Configurações
            </h2>
            <a href="/" className="btn-close-dash" title="Voltar ao Jogo">
              <i className="fas fa-gamepad"></i>
            </a>
          </div>

          <div className="dashboard-main">
            <div className="dashboard-tabs">
              <button
                className="tab-btn active"
                data-tab="tab-stats"
                onClick={() => (window as any).switchDashTab('tab-stats')}
              >
                <i className="fas fa-chart-bar"></i> Estatísticas
              </button>
              <button
                className="tab-btn"
                data-tab="tab-players"
                onClick={() => (window as any).switchDashTab('tab-players')}
              >
                <i className="fas fa-users"></i> Cadastros
              </button>
              <button
                className="tab-btn"
                data-tab="tab-visual"
                onClick={() => (window as any).switchDashTab('tab-visual')}
              >
                <i className="fas fa-palette"></i> Visual
              </button>
              <button
                className="tab-btn"
                data-tab="tab-quiz"
                onClick={() => (window as any).switchDashTab('tab-quiz')}
              >
                <i className="fas fa-question-circle"></i> Quiz
              </button>
              <button
                className="tab-btn"
                data-tab="tab-memory"
                onClick={() => (window as any).switchDashTab('tab-memory')}
              >
                <i className="fas fa-brain"></i> Memória
              </button>
              <button
                className="tab-btn"
                data-tab="tab-puzzle"
                onClick={() => (window as any).switchDashTab('tab-puzzle')}
              >
                <i className="fas fa-puzzle-piece"></i> Puzzle
              </button>
            </div>

            <div className="dashboard-body">
              {/* ABA ESTATÍSTICAS */}
              <div id="tab-stats" className="tab-content active">
                <div className="stats-grid">
                  <div className="stat-card stat-total">
                    <div className="stat-icon">
                      <i className="fas fa-gamepad"></i>
                    </div>
                    <div className="stat-info">
                      <span className="stat-number" id="stat-total">0</span>
                      <span className="stat-label">Total de Jogadores</span>
                    </div>
                  </div>
                  <div className="stat-card stat-today">
                    <div className="stat-icon">
                      <i className="fas fa-calendar-day"></i>
                    </div>
                    <div className="stat-info">
                      <span className="stat-number" id="stat-today">0</span>
                      <span className="stat-label">Jogaram Hoje</span>
                    </div>
                  </div>
                  <div className="stat-card stat-registered">
                    <div className="stat-icon">
                      <i className="fas fa-user-check"></i>
                    </div>
                    <div className="stat-info">
                      <span className="stat-number" id="stat-registered">0</span>
                      <span className="stat-label">Com Cadastro Completo</span>
                    </div>
                  </div>
                  <div className="stat-card stat-simple">
                    <div className="stat-icon">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="stat-info">
                      <span className="stat-number" id="stat-simple">0</span>
                      <span className="stat-label">Apenas Nome</span>
                    </div>
                  </div>
                </div>

                <div className="config-section">
                  <label className="config-label">
                    <i className="fas fa-clipboard-list"></i> Formulário de Cadastro
                  </label>
                  <div className="game-toggle registration-toggle">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        id="toggle-registration"
                        onChange={(e) => (window as any).toggleRegistration(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">
                      <span id="registration-status">Desativado</span>
                      <small id="registration-desc">Apenas nome do jogador</small>
                    </span>
                  </div>
                  <p className="config-hint">
                    <i className="fas fa-info-circle"></i>
                    Quando ativado, solicita nome, e-mail, telefone e consentimento antes do jogo.
                  </p>
                </div>
              </div>

              {/* ABA CADASTROS */}
              <div id="tab-players" className="tab-content">
                <div className="players-header">
                  <div className="players-actions">
                    <button
                      className="btn-export"
                      onClick={() => (window as any).exportPlayersCSV()}
                    >
                      <i className="fas fa-download"></i> Exportar CSV
                    </button>
                    <button
                      className="btn-clear-data"
                      onClick={() => (window as any).clearPlayersData()}
                    >
                      <i className="fas fa-trash"></i> Limpar Dados
                    </button>
                  </div>
                </div>
                <div className="players-table-container">
                  <table className="players-table" id="players-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Data</th>
                        <th>Hora</th>
                      </tr>
                    </thead>
                    <tbody id="players-tbody"></tbody>
                  </table>
                  <div
                    className="no-data-message"
                    id="no-players-message"
                    style={{ display: 'none' }}
                  >
                    <i className="fas fa-users-slash"></i>
                    <p>Nenhum jogador registrado ainda.</p>
                  </div>
                </div>
              </div>

              {/* ABA VISUAL */}
              <div id="tab-visual" className="tab-content">
                <div className="config-section">
                  <label className="config-label">
                    <i className="fas fa-swatchbook"></i> Tema do Jogo
                  </label>
                  <div className="themes-grid" id="themes-grid"></div>
                </div>

                <div className="config-section">
                  <label className="config-label">
                    <i className="fas fa-gamepad"></i> Jogos Ativos
                  </label>
                  <div className="games-toggles">
                    <div className="game-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          id="toggle-memory"
                          defaultChecked
                          onChange={(e) => (window as any).toggleGame('memory', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <span className="toggle-label">
                        <i className="fas fa-brain"></i> Memória
                      </span>
                    </div>
                    <div className="game-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          id="toggle-puzzle"
                          defaultChecked
                          onChange={(e) => (window as any).toggleGame('puzzle', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <span className="toggle-label">
                        <i className="fas fa-puzzle-piece"></i> Quebra-Cabeça
                      </span>
                    </div>
                    <div className="game-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          id="toggle-quiz"
                          defaultChecked
                          onChange={(e) => (window as any).toggleGame('quiz', e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <span className="toggle-label">
                        <i className="fas fa-question-circle"></i> Quiz
                      </span>
                    </div>
                  </div>
                </div>

                <div className="config-section">
                  <label className="config-label">
                    <i className="fas fa-fill-drip"></i> Cor Principal (Amarelo)
                  </label>
                  <div className="color-picker-wrapper">
                    <input type="color" id="config-color" defaultValue="#ffb800" />
                    <span id="color-preview">#ffb800</span>
                  </div>
                </div>

                <div className="config-section">
                  <label className="config-label">
                    <i className="fas fa-fill-drip"></i> Cor Secundária (Roxo)
                  </label>
                  <div className="color-picker-wrapper">
                    <input type="color" id="config-color-secondary" defaultValue="#868fc6" />
                    <span id="color-secondary-preview">#868fc6</span>
                  </div>
                </div>

                <div className="config-section">
                  <label className="config-label">
                    <i className="fas fa-image"></i> Logo Principal
                  </label>
                  <div className="upload-wrapper">
                    <img id="logo-preview" src="/assets/logo-png.png" alt="Logo Preview" />
                    <input
                      type="file"
                      id="config-logo"
                      accept="image/*"
                      onChange={(e) => (window as any).previewLogo(e.target)}
                    />
                    <button
                      className="btn-upload"
                      onClick={() => document.getElementById('config-logo')?.click()}
                    >
                      <i className="fas fa-upload"></i> Escolher Imagem
                    </button>
                    <button
                      className="btn-reset-img"
                      onClick={() => (window as any).resetLogo()}
                    >
                      <i className="fas fa-undo"></i> Usar Padrão
                    </button>
                  </div>
                </div>
              </div>

              {/* ABA QUIZ */}
              <div id="tab-quiz" className="tab-content">
                <div className="config-section">
                  <label className="config-label">
                    <i className="fas fa-list"></i> Perguntas do Quiz (V/F)
                  </label>
                  <p className="quiz-info" id="quiz-level-count">
                    🟢 Fácil: 0 | 🟡 Médio: 0 | 🔴 Difícil: 0
                  </p>
                  <p className="quiz-distribution-hint">
                    O quiz exibe 10 perguntas: 2 fáceis, 3 médias e 5 difíceis (randomizadas)
                  </p>
                  <div id="quiz-questions-list" className="questions-list"></div>
                  <div className="add-question-form">
                    <textarea id="new-question" placeholder="Digite a pergunta..."></textarea>
                    <textarea
                      id="new-awareness"
                      placeholder="Mensagem de conscientização (aparece após resposta)..."
                    ></textarea>
                    <div className="level-toggle">
                      <span>Nível:</span>
                      <button
                        className="level-btn"
                        data-level="easy"
                        onClick={() => (window as any).setNewLevel('easy')}
                      >
                        🟢 Fácil
                      </button>
                      <button
                        className="level-btn active"
                        data-level="medium"
                        onClick={() => (window as any).setNewLevel('medium')}
                      >
                        🟡 Médio
                      </button>
                      <button
                        className="level-btn"
                        data-level="hard"
                        onClick={() => (window as any).setNewLevel('hard')}
                      >
                        🔴 Difícil
                      </button>
                    </div>
                    <div className="answer-toggle">
                      <span>Resposta correta:</span>
                      <button
                        id="answer-true"
                        className="answer-btn active"
                        onClick={() => (window as any).setNewAnswer(true)}
                      >
                        Sim
                      </button>
                      <button
                        id="answer-false"
                        className="answer-btn"
                        onClick={() => (window as any).setNewAnswer(false)}
                      >
                        Não
                      </button>
                    </div>
                    <button
                      className="btn-add-question"
                      onClick={() => (window as any).addQuizQuestion()}
                    >
                      <i className="fas fa-plus"></i> Adicionar Pergunta
                    </button>
                  </div>
                </div>
              </div>

              {/* ABA MEMÓRIA */}
              <div id="tab-memory" className="tab-content">
                <div className="config-section">
                  <label className="config-label">
                    <i className="fas fa-icons"></i> Ícones do Jogo da Memória (selecione 8+)
                  </label>
                  <div id="icons-grid" className="icons-grid"></div>
                  <p className="icons-count">
                    Selecionados: <span id="selected-count">0</span>/8 mínimo
                  </p>
                </div>
              </div>

              {/* ABA PUZZLE */}
              <div id="tab-puzzle" className="tab-content">
                <div className="config-section">
                  <label className="config-label">
                    <i className="fas fa-image"></i> Imagem do Quebra-Cabeça
                  </label>
                  <div className="upload-wrapper">
                    <img id="puzzle-preview" src="/assets/logo-png.png" alt="Puzzle Preview" />
                    <input
                      type="file"
                      id="config-puzzle"
                      accept="image/*"
                      onChange={(e) => (window as any).previewPuzzle(e.target)}
                    />
                    <button
                      className="btn-upload"
                      onClick={() => document.getElementById('config-puzzle')?.click()}
                    >
                      <i className="fas fa-upload"></i> Escolher Imagem
                    </button>
                    <button
                      className="btn-reset-img"
                      onClick={() => (window as any).resetPuzzleImage()}
                    >
                      <i className="fas fa-undo"></i> Usar Padrão
                    </button>
                  </div>
                  <p className="puzzle-hint-dash">
                    Dica: Use uma imagem quadrada para melhor resultado.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-footer">
            <button
              className="btn-reset-all"
              onClick={() => (window as any).resetAllConfig()}
            >
              <i className="fas fa-trash-restore"></i> Restaurar Padrão
            </button>
            <button
              className="btn-save-config"
              onClick={() => (window as any).saveAllConfigAndRedirect()}
            >
              <i className="fas fa-save"></i> Salvar
            </button>
          </div>
        </div>
      </div>

      <Script src="/game.js" strategy="afterInteractive" />
      <Script id="dashboard-init" strategy="afterInteractive">{`
        function waitForGame() {
          if (typeof applyConfig !== 'undefined' && typeof gameConfig !== 'undefined') {
            applyConfig(gameConfig);
            initDashboard();
            initGameToggles();
            initRegistrationToggle();
            renderThemes();
            updateStats();
            renderPlayersTable();
          } else {
            setTimeout(waitForGame, 50);
          }
        }

        function updateStats() {
          const stats = getPlayersStats();
          document.getElementById('stat-total').textContent = stats.total;
          document.getElementById('stat-today').textContent = stats.today;
          document.getElementById('stat-registered').textContent = stats.withRegistration;
          document.getElementById('stat-simple').textContent = stats.onlyName;
        }

        function renderPlayersTable() {
          const players = getPlayersData();
          const tbody = document.getElementById('players-tbody');
          const noDataMsg = document.getElementById('no-players-message');
          tbody.innerHTML = '';
          if (players.length === 0) {
            noDataMsg.style.display = 'flex';
            return;
          }
          noDataMsg.style.display = 'none';
          const sortedPlayers = [...players].reverse();
          sortedPlayers.forEach(player => {
            const tr = document.createElement('tr');
            tr.innerHTML =
              '<td>' + (player.name || '-') + '</td>' +
              '<td>' + (player.email || '-') + '</td>' +
              '<td>' + (player.phone || '-') + '</td>' +
              '<td>' + (player.date || '-') + '</td>' +
              '<td>' + (player.time || '-') + '</td>';
            tbody.appendChild(tr);
          });
        }

        function initRegistrationToggle() {
          const toggle = document.getElementById('toggle-registration');
          const isEnabled = gameConfig.registrationEnabled === true;
          toggle.checked = isEnabled;
          updateRegistrationStatus(isEnabled);
        }

        function toggleRegistration(enabled) {
          tempConfig.registrationEnabled = enabled;
          updateRegistrationStatus(enabled);
        }

        function updateRegistrationStatus(enabled) {
          const statusEl = document.getElementById('registration-status');
          const descEl = document.getElementById('registration-desc');
          if (enabled) {
            statusEl.textContent = 'Ativado';
            descEl.textContent = 'Nome, e-mail, telefone e consentimento';
          } else {
            statusEl.textContent = 'Desativado';
            descEl.textContent = 'Apenas nome do jogador';
          }
        }

        function renderThemes() {
          const grid = document.getElementById('themes-grid');
          grid.innerHTML = '';
          Object.keys(THEMES).forEach(themeKey => {
            const theme = THEMES[themeKey];
            const card = document.createElement('div');
            card.className = 'theme-card' + (tempConfig.theme === themeKey ? ' selected' : '');
            card.style.background = theme.bgGradient;
            card.onclick = () => selectTheme(themeKey);
            card.innerHTML =
              '<span class="theme-icon"><i class="fas ' + theme.icon + '"></i></span>' +
              '<span class="theme-name">' + theme.name + '</span>' +
              '<div class="theme-colors">' +
              '<span class="theme-color" style="background: ' + theme.primaryColor + '"></span>' +
              '<span class="theme-color" style="background: ' + theme.secondaryColor + '"></span>' +
              '</div>';
            grid.appendChild(card);
          });
        }

        function selectTheme(themeKey) {
          const theme = THEMES[themeKey];
          tempConfig.theme = themeKey;
          tempConfig.primaryColor = theme.primaryColor;
          tempConfig.secondaryColor = theme.secondaryColor;
          document.getElementById('config-color').value = theme.primaryColor;
          document.getElementById('color-preview').textContent = theme.primaryColor;
          document.getElementById('config-color-secondary').value = theme.secondaryColor;
          document.getElementById('color-secondary-preview').textContent = theme.secondaryColor;
          document.documentElement.style.setProperty('--cor-amarelo', theme.primaryColor);
          document.documentElement.style.setProperty('--cor-roxo', theme.secondaryColor);
          document.body.style.background = theme.bgGradient;
          document.getElementById('screen-dashboard').style.background = theme.bgGradient;
          renderThemes();
        }

        function initGameToggles() {
          const gamesEnabled = tempConfig.gamesEnabled || { memory: true, puzzle: true, quiz: true };
          document.getElementById('toggle-memory').checked = gamesEnabled.memory;
          document.getElementById('toggle-puzzle').checked = gamesEnabled.puzzle;
          document.getElementById('toggle-quiz').checked = gamesEnabled.quiz;
        }

        function toggleGame(game, enabled) {
          if (!tempConfig.gamesEnabled) {
            tempConfig.gamesEnabled = { memory: true, puzzle: true, quiz: true };
          }
          tempConfig.gamesEnabled[game] = enabled;
          const anyEnabled = tempConfig.gamesEnabled.memory || tempConfig.gamesEnabled.puzzle || tempConfig.gamesEnabled.quiz;
          if (!anyEnabled) {
            alert('Pelo menos um jogo deve estar ativo!');
            tempConfig.gamesEnabled[game] = true;
            document.getElementById('toggle-' + game).checked = true;
          }
        }

        function saveAllConfigAndRedirect() {
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
        }

        waitForGame();
      `}</Script>
    </>
  )
}
