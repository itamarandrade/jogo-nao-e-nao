/**
 * ===== BANCO DE DADOS OFFLINE =====
 *
 * Por que este arquivo existe
 * ---------------------------
 * Até agora os cadastros viviam SÓ no localStorage do navegador. Isso significa
 * que um "limpar dados de navegação", um modo anônimo ou uma reinstalação do
 * Chrome apagavam os dados do evento inteiro, sem aviso e sem cópia.
 *
 * Aqui os dados passam a viver em três lugares ao mesmo tempo:
 *
 *   1. localStorage  — onde já viviam. Nada muda; o jogo e o painel continuam
 *                      lendo daqui, então nenhuma tela precisou ser reescrita.
 *   2. IndexedDB     — espelho estruturado, com cota bem maior. Serve de rede
 *                      de segurança se o localStorage estourar ou corromper.
 *   3. Arquivo CSV   — um arquivo DE VERDADE no disco (pen drive, pasta do
 *                      evento, o que for). É a única camada que sobrevive a
 *                      uma limpeza de navegador, e por isso é a que importa.
 *
 * O arquivo é reescrito INTEIRO a cada cadastro, não acrescentado no fim. É de
 * propósito: são algumas centenas de linhas num evento, o custo é irrisório, e
 * reescrever é idempotente — não existe estado de "meio escrito" se a máquina
 * desligar no meio.
 *
 * Requisito do navegador
 * ----------------------
 * A escrita direta em disco usa a File System Access API, que exige contexto
 * seguro (http://localhost ou https) e Chrome/Edge. Em `file://` ou Firefox ela
 * não existe — nesse caso entra o plano B automático: um download do CSV
 * completo a cada N cadastros. Cada download é uma cópia inteira, então basta
 * guardar o arquivo mais recente.
 *
 * Use `abrir-jogo.sh` para subir o jogo em http://localhost e ter o caminho bom.
 */

const DB_NOME = 'jogo_nao_e_nao';
const DB_VERSAO = 1;
const STORE_JOGADORES = 'jogadores';
const STORE_CONFIG = 'config';
const CHAVE_ARQUIVO = 'handle_csv';

/** A cada quantos cadastros o plano B baixa um CSV completo. */
const CADASTROS_POR_DOWNLOAD = 5;

const BancoOffline = (() => {
  let bd = null;
  let arquivoCSV = null;      // FileSystemFileHandle, quando conectado
  let gravandoAgora = null;   // evita duas gravações simultâneas no mesmo arquivo
  let servidor = null;        // {arquivo, pasta, total} quando o servidor.py está no ar

  // ---------------------------------------------------------------------
  // Servidor local (servidor.py) — o caminho preferido
  // ---------------------------------------------------------------------

  /**
   * Descobre se o servidor.py está atendendo.
   *
   * Sendo ele quem grava, o arquivo nasce sozinho num caminho fixo, sem
   * ninguém escolher nada numa janela — que é o que o navegador exigiria.
   */
  async function detectarServidor() {
    try {
      const r = await fetch('/api/status', { cache: 'no-store' });
      if (!r.ok) return null;
      const dados = await r.json();
      servidor = dados && dados.ok ? dados : null;
      return servidor;
    } catch (e) {
      servidor = null; // servido por outra coisa (python -m http.server, file://)
      return null;
    }
  }

  /** Manda um cadastro para o servidor gravar. */
  async function enviarAoServidor(jogador) {
    const r = await fetch('/api/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jogador),
    });
    const dados = await r.json();
    if (!dados.ok) throw new Error(dados.erro || 'falha ao gravar');
    if (servidor) servidor.total = dados.total;
    return dados;
  }

  /**
   * Puxa do servidor o que o navegador não tem.
   *
   * É o caminho de volta depois de uma limpeza de navegador: o arquivo no disco
   * continua lá, então a lista se reconstrói sozinha ao abrir a página.
   */
  async function sincronizarDoServidor() {
    if (!servidor) return { novos: 0 };
    try {
      const r = await fetch('/api/jogadores', { cache: 'no-store' });
      const dados = await r.json();
      if (!dados.ok) return { novos: 0 };

      const atuais = getPlayersData();
      const conhecidos = new Set(atuais.map((p) => String(p.id)));
      const novos = dados.jogadores.filter((p) => !conhecidos.has(String(p.id)));
      if (novos.length === 0) return { novos: 0 };

      const juntos = [...atuais, ...novos].sort(
        (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
      );
      localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(juntos));
      for (const p of novos) await espelharJogador(p);

      console.log(`[storage] ${novos.length} cadastro(s) recuperados do arquivo`);
      return { novos: novos.length };
    } catch (e) {
      console.error('[storage] falha ao sincronizar com o servidor:', e);
      return { novos: 0 };
    }
  }

  /**
   * Empurra para o servidor o que só existe no navegador.
   *
   * Cobre o caso de o servidor ter sido reiniciado (ou o arquivo apagado) com
   * cadastros já feitos: o arquivo volta a ficar completo.
   */
  async function empurrarParaServidor() {
    if (!servidor) return { enviados: 0 };
    try {
      const locais = getPlayersData();
      if (locais.length === 0) return { enviados: 0 };
      const r = await fetch('/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locais),
      });
      const dados = await r.json();
      if (dados.ok && dados.gravados > 0) {
        console.log(`[storage] ${dados.gravados} cadastro(s) enviados ao arquivo`);
      }
      if (dados.ok) servidor.total = dados.total;
      return { enviados: dados.gravados || 0 };
    } catch (e) {
      console.error('[storage] falha ao enviar ao servidor:', e);
      return { enviados: 0 };
    }
  }

  // ---------------------------------------------------------------------
  // IndexedDB
  // ---------------------------------------------------------------------

  function abrirBanco() {
    if (bd) return Promise.resolve(bd);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NOME, DB_VERSAO);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_JOGADORES)) {
          db.createObjectStore(STORE_JOGADORES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_CONFIG)) {
          db.createObjectStore(STORE_CONFIG);
        }
      };
      req.onsuccess = () => { bd = req.result; resolve(bd); };
      req.onerror = () => reject(req.error);
    });
  }

  function transacao(store, modo, fn) {
    return abrirBanco().then((db) => new Promise((resolve, reject) => {
      const tx = db.transaction(store, modo);
      const resultado = fn(tx.objectStore(store));
      tx.oncomplete = () => resolve(resultado && resultado.result);
      tx.onerror = () => reject(tx.error);
    }));
  }

  /** Guarda um jogador no espelho do IndexedDB. */
  async function espelharJogador(jogador) {
    try {
      await transacao(STORE_JOGADORES, 'readwrite', (s) => s.put(jogador));
    } catch (e) {
      console.error('[storage] falha ao espelhar no IndexedDB:', e);
    }
  }

  /** Todos os jogadores do espelho — usado na recuperação. */
  async function jogadoresDoEspelho() {
    try {
      return await transacao(STORE_JOGADORES, 'readonly', (s) => s.getAll());
    } catch (e) {
      console.error('[storage] falha ao ler o IndexedDB:', e);
      return [];
    }
  }

  // ---------------------------------------------------------------------
  // CSV
  // ---------------------------------------------------------------------

  const COLUNAS = ['ID', 'Nome', 'CPF', 'Consentimento', 'Cadastro completo', 'Data', 'Hora', 'Timestamp'];

  /**
   * Escapa um campo para CSV.
   *
   * Sem isso, um nome com `;` (ou com aspas, ou com quebra de linha) desloca as
   * colunas e corrompe o arquivo inteiro dali para baixo — silenciosamente.
   */
  function campo(valor) {
    const texto = String(valor ?? '');
    if (/[;"\n\r]/.test(texto)) {
      return '"' + texto.replace(/"/g, '""') + '"';
    }
    return texto;
  }

  function jogadorParaLinha(p) {
    return [
      p.id, p.name, p.cpf,
      p.consent ? 'Sim' : 'Não',
      p.registered ? 'Sim' : 'Não',
      p.date, p.time, p.timestamp,
    ].map(campo).join(';');
  }

  /** CSV completo, com BOM para o Excel abrir com acento correto. */
  function montarCSV(jogadores) {
    const linhas = [COLUNAS.join(';'), ...jogadores.map(jogadorParaLinha)];
    return '﻿' + linhas.join('\r\n');
  }

  /** Lê um CSV gerado por aqui de volta para objetos de jogador. */
  function lerCSV(texto) {
    const limpo = texto.replace(/^﻿/, '');
    const linhas = [];
    let atual = [], campoAtual = '', dentroDeAspas = false;

    for (let i = 0; i < limpo.length; i++) {
      const c = limpo[i];
      if (dentroDeAspas) {
        if (c === '"' && limpo[i + 1] === '"') { campoAtual += '"'; i++; }
        else if (c === '"') dentroDeAspas = false;
        else campoAtual += c;
      } else if (c === '"') dentroDeAspas = true;
      else if (c === ';') { atual.push(campoAtual); campoAtual = ''; }
      else if (c === '\n') { atual.push(campoAtual); linhas.push(atual); atual = []; campoAtual = ''; }
      else if (c !== '\r') campoAtual += c;
    }
    if (campoAtual || atual.length) { atual.push(campoAtual); linhas.push(atual); }

    return linhas.slice(1)
      .filter((l) => l.length >= 7 && l[0])
      .map((l) => ({
        // O id fica como TEXTO. Converter para número quebraria os ids novos
        // (que têm sufixo aleatório) e, com todos virando Date.now(), a
        // deduplicação da restauração deixaria de funcionar.
        id: String(l[0]),
        name: l[1] || '',
        cpf: l[2] || '',
        consent: l[3] === 'Sim',
        registered: l[4] === 'Sim',
        date: l[5] || '',
        time: l[6] || '',
        timestamp: l[7] || '',
      }));
  }

  // ---------------------------------------------------------------------
  // Arquivo no disco (File System Access API)
  // ---------------------------------------------------------------------

  function suportaArquivo() {
    return typeof window.showSaveFilePicker === 'function' && window.isSecureContext;
  }

  /**
   * Pede ao operador para escolher o arquivo CSV do evento. Uma vez por
   * máquina: o handle fica guardado no IndexedDB e é reaproveitado depois.
   *
   * Precisa ser chamado a partir de um clique — o navegador exige gesto do
   * usuário para abrir o seletor de arquivos.
   */
  async function conectarArquivo() {
    if (!suportaArquivo()) {
      throw new Error(
        'Este navegador não permite gravar direto no disco. Abra o jogo por ' +
        'http://localhost (use o abrir-jogo.sh) no Chrome ou Edge.'
      );
    }

    const handle = await window.showSaveFilePicker({
      suggestedName: `jogadores_${new Date().toISOString().split('T')[0]}.csv`,
      types: [{ description: 'Planilha CSV', accept: { 'text/csv': ['.csv'] } }],
    });

    arquivoCSV = handle;
    await transacao(STORE_CONFIG, 'readwrite', (s) => s.put(handle, CHAVE_ARQUIVO));

    // Grava o que já existe, para o arquivo não nascer vazio ignorando os
    // cadastros feitos antes de conectar.
    await gravarArquivo();
    return handle.name;
  }

  /**
   * Reconecta ao arquivo escolhido numa sessão anterior.
   *
   * Devolve o nome se a permissão ainda vale. O navegador costuma pedir o
   * clique de novo depois de fechar — por isso `pedirPermissao`, que só deve
   * ser usado a partir de um botão.
   */
  async function reconectarArquivo(pedirPermissao = false) {
    if (!suportaArquivo()) return null;
    try {
      const handle = await transacao(STORE_CONFIG, 'readonly', (s) => s.get(CHAVE_ARQUIVO));
      if (!handle) return null;

      const opcoes = { mode: 'readwrite' };
      let estado = await handle.queryPermission(opcoes);
      if (estado !== 'granted' && pedirPermissao) {
        estado = await handle.requestPermission(opcoes);
      }
      if (estado !== 'granted') return null;

      arquivoCSV = handle;
      return handle.name;
    } catch (e) {
      console.error('[storage] falha ao reconectar o arquivo:', e);
      return null;
    }
  }

  /** Reescreve o CSV inteiro. Serializado: duas gravações não se atropelam. */
  async function gravarArquivo() {
    if (!arquivoCSV) return false;

    gravandoAgora = (gravandoAgora || Promise.resolve()).then(async () => {
      const conteudo = montarCSV(getPlayersData());
      const fluxo = await arquivoCSV.createWritable();
      await fluxo.write(conteudo);
      await fluxo.close();
    }).catch((e) => {
      console.error('[storage] falha ao gravar o CSV:', e);
      // Perder a permissão no meio do evento é o caso perigoso: avisa alto em
      // vez de seguir gravando no vazio.
      if (e && (e.name === 'NotAllowedError' || e.name === 'NotFoundError')) {
        arquivoCSV = null;
        atualizarPainel();
        alert(
          'ATENÇÃO: a gravação no arquivo CSV foi interrompida.\n\n' +
          'Os cadastros continuam sendo salvos no navegador, mas sem cópia no disco.\n' +
          'Abra o painel e clique em "Conectar arquivo CSV" novamente.'
        );
      }
    });

    await gravandoAgora;
    return true;
  }

  // ---------------------------------------------------------------------
  // Plano B: download automático
  // ---------------------------------------------------------------------

  function baixarCSV(nomeArquivo) {
    const blob = new Blob([montarCSV(getPlayersData())], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo || `jogadores_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  /**
   * Sem acesso ao disco, baixa o CSV completo.
   *
   * Baixa **no primeiro cadastro** e depois a cada N. O primeiro é o que
   * importa: sem ele, um evento com menos de N pessoas terminaria sem arquivo
   * nenhum, e nos primeiros minutos de qualquer evento não haveria cópia — que
   * é justamente quando um problema ainda dá tempo de ser corrigido.
   *
   * Cada arquivo é uma cópia INTEIRA, então basta guardar o mais recente; o
   * número de registros vai no nome para não haver dúvida sobre qual é.
   */
  function planoB(total) {
    const primeiro = total === 1;
    const naCadencia = total > 0 && total % CADASTROS_POR_DOWNLOAD === 0;
    if (!primeiro && !naCadencia) return;

    const agora = new Date().toISOString().replace(/[:.]/g, '-').split('T');
    baixarCSV(`jogadores_${agora[0]}_${agora[1].slice(0, 8)}_${total}-registros.csv`);
  }

  // ---------------------------------------------------------------------
  // API pública
  // ---------------------------------------------------------------------

  /**
   * Chamado pelo jogo a cada cadastro, depois de o localStorage ser gravado.
   * Nunca lança: falha de cópia não pode impedir a pessoa de jogar.
   */
  async function persistir(jogador) {
    try {
      await espelharJogador(jogador);

      // Ordem de preferência: servidor (arquivo automático) → arquivo escolhido
      // à mão → download periódico.
      if (servidor) {
        try {
          await enviarAoServidor(jogador);
        } catch (e) {
          // O servidor caiu no meio do evento. Não dá para seguir em silêncio:
          // a partir daqui os cadastros só existem no navegador.
          console.error('[storage] o servidor não gravou:', e);
          servidor = null;
          alert(
            'ATENÇÃO: o servidor parou de gravar no arquivo.\n\n' +
            'Os cadastros continuam salvos no navegador, mas sem cópia no disco.\n' +
            'Avise o responsável e NÃO feche esta janela.'
          );
        }
      } else if (arquivoCSV) {
        await gravarArquivo();
      } else {
        planoB(getPlayersData().length);
      }
      atualizarPainel();
    } catch (e) {
      console.error('[storage] falha ao persistir:', e);
    }
  }

  /**
   * Recupera cadastros de um CSV — o caminho de volta depois de uma limpeza de
   * navegador, ou para juntar as listas de dois totens.
   *
   * Não sobrescreve: junta pelo ID e mantém o que já existe. Rodar duas vezes
   * com o mesmo arquivo não duplica nada.
   */
  async function restaurarDeArquivo(file) {
    const texto = await file.text();
    const doArquivo = lerCSV(texto);
    const atuais = getPlayersData();
    const conhecidos = new Set(atuais.map((p) => String(p.id)));

    const novos = doArquivo.filter((p) => !conhecidos.has(String(p.id)));
    if (novos.length === 0) return { lidos: doArquivo.length, novos: 0 };

    const juntos = [...atuais, ...novos].sort(
      (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
    );
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(juntos));
    for (const p of novos) await espelharJogador(p);
    if (arquivoCSV) await gravarArquivo();

    return { lidos: doArquivo.length, novos: novos.length };
  }

  /** Recupera do espelho do IndexedDB, quando não há CSV à mão. */
  async function restaurarDoEspelho() {
    const espelho = await jogadoresDoEspelho();
    const atuais = getPlayersData();
    const conhecidos = new Set(atuais.map((p) => String(p.id)));
    const novos = espelho.filter((p) => !conhecidos.has(String(p.id)));

    if (novos.length > 0) {
      const juntos = [...atuais, ...novos].sort(
        (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
      );
      localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(juntos));
    }
    return { espelho: espelho.length, novos: novos.length };
  }

  function estado() {
    return {
      // 'servidor'  → o servidor.py grava sozinho, caminho fixo (o melhor caso)
      // 'arquivo'   → arquivo escolhido à mão pelo navegador
      // 'download'  → sem gravação direta; baixa CSV a cada N cadastros
      modo: servidor ? 'servidor' : (arquivoCSV ? 'arquivo' : 'download'),
      servidor: servidor,
      caminhoArquivo: servidor ? servidor.arquivo : null,
      pastaArquivo: servidor ? servidor.pasta : null,
      totalNoArquivo: servidor ? servidor.total : null,
      suportaArquivo: suportaArquivo(),
      conectado: !!arquivoCSV,
      nomeArquivo: arquivoCSV ? arquivoCSV.name : null,
      contextoSeguro: window.isSecureContext,
      origem: location.origin,
    };
  }

  /** O painel expõe esta função; no jogo ela não existe e é ignorada. */
  function atualizarPainel() {
    if (typeof window.renderStorageStatus === 'function') {
      try { window.renderStorageStatus(); } catch (e) { /* painel fechado */ }
    }
  }

  return {
    persistir,
    detectarServidor,
    sincronizarDoServidor,
    empurrarParaServidor,
    conectarArquivo,
    reconectarArquivo,
    gravarArquivo,
    restaurarDeArquivo,
    restaurarDoEspelho,
    baixarCSV,
    montarCSV,
    lerCSV,
    estado,
    jogadoresDoEspelho,
  };
})();

/**
 * Arranque.
 *
 * 1. Procura o servidor.py. Se estiver no ar, ele grava sozinho e não há mais
 *    nada a configurar — nem janela de escolher arquivo.
 * 2. Reconcilia os dois lados: puxa do arquivo o que o navegador não tem (volta
 *    de uma limpeza de navegador) e envia ao arquivo o que só existe aqui
 *    (cobre servidor reiniciado ou arquivo apagado).
 * 3. Sem servidor, tenta reaproveitar um arquivo escolhido antes. Sem pedir
 *    permissão: não há gesto do usuário no carregamento e o navegador recusaria.
 */
window.addEventListener('DOMContentLoaded', async () => {
  const srv = await BancoOffline.detectarServidor();

  if (srv) {
    console.log('[storage] gravando em:', srv.arquivo);
    await BancoOffline.sincronizarDoServidor();
    await BancoOffline.empurrarParaServidor();
    if (typeof window.renderPlayersTable === 'function') {
      try { window.renderPlayersTable(); window.updateStats(); } catch (e) { /* no jogo não existe */ }
    }
  } else {
    const nome = await BancoOffline.reconectarArquivo(false);
    if (nome) {
      console.log('[storage] arquivo CSV reconectado:', nome);
      BancoOffline.gravarArquivo();
    } else {
      armarReconexaoNoPrimeiroToque();
    }
  }

  if (typeof window.renderStorageStatus === 'function') window.renderStorageStatus();
});

/**
 * Recupera a permissão do arquivo no primeiro toque da tela.
 *
 * ## O problema que isto resolve
 * O navegador só devolve a permissão de gravar num arquivo se houver um gesto
 * do usuário — e não há gesto nenhum quando a página carrega. Então, se o
 * Chrome for reiniciado no meio do evento, a gravação ficaria parada até
 * alguém abrir o painel e clicar em reconectar. Ninguém perceberia.
 *
 * Como a tela inicial já pede um toque para começar, esse toque serve de gesto.
 * O operador (ou o primeiro jogador) responde uma vez à pergunta do navegador e
 * a gravação volta sozinha.
 *
 * Só arma quando JÁ EXISTE um arquivo escolhido antes: numa máquina que nunca
 * foi configurada, isso não dispara nada.
 */
function armarReconexaoNoPrimeiroToque() {
  const tentar = async () => {
    document.removeEventListener('pointerdown', tentar, true);
    document.removeEventListener('keydown', tentar, true);
    try {
      const nome = await BancoOffline.reconectarArquivo(true);
      if (nome) {
        console.log('[storage] permissão do arquivo recuperada:', nome);
        await BancoOffline.gravarArquivo();
        if (typeof window.renderStorageStatus === 'function') window.renderStorageStatus();
      }
    } catch (e) {
      console.warn('[storage] não consegui recuperar a permissão do arquivo:', e);
    }
  };
  document.addEventListener('pointerdown', tentar, true);
  document.addEventListener('keydown', tentar, true);
}
