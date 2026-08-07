#!/usr/bin/env bash
#
# Abre o jogo em http://localhost — é o que destrava a gravação direta no
# arquivo CSV.
#
# Por que não basta dar dois cliques no index.html: aberto como `file://`, o
# navegador bloqueia a File System Access API, e o jogo cai no plano B (baixar
# um CSV a cada 5 cadastros). Servido em localhost, cada cadastro é gravado no
# arquivo do disco na hora.
#
# Uso:  ./abrir-jogo.sh          → abre o jogo
#       ./abrir-jogo.sh painel   → abre o painel de controle
#
# Para encerrar, feche esta janela do terminal ou tecle Ctrl+C.

set -euo pipefail

PORTA="${PORTA:-8123}"
PASTA="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ALVO="index.html"
[ "${1:-}" = "painel" ] && ALVO="dashboard.html"

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERRO: python3 não encontrado. Instale o Python 3 para usar este atalho." >&2
  exit 1
fi

# Se a porta já estiver ocupada, provavelmente é uma cópia deste script rodando
# — reaproveita em vez de subir outra e confundir qual está servindo o quê.
if curl -s -o /dev/null --max-time 2 "http://localhost:${PORTA}/${ALVO}" 2>/dev/null; then
  echo "Já havia um servidor na porta ${PORTA}; reaproveitando."
else
  echo "Subindo o servidor local na porta ${PORTA}..."
  ( cd "$PASTA" && python3 -m http.server "$PORTA" --bind 127.0.0.1 >/dev/null 2>&1 ) &
  SERVIDOR=$!
  trap 'kill $SERVIDOR 2>/dev/null || true' EXIT INT TERM
  sleep 1
fi

URL="http://localhost:${PORTA}/${ALVO}"
echo
echo "  Jogo no ar:  $URL"
echo
echo "  IMPORTANTE — antes de começar o evento:"
echo "    1. Abra o painel:  ./abrir-jogo.sh painel"
echo "    2. Vá na aba Cadastros"
echo "    3. Clique em 'Conectar arquivo CSV' e escolha onde salvar"
echo "       (de preferência num pen drive ou numa pasta do evento)"
echo "    4. Confirme que a faixa ficou VERDE"
echo
echo "  Para encerrar: Ctrl+C"
echo

# --allow-file-access-from-files não é necessário aqui; o ponto é justamente
# servir por http para o navegador considerar contexto seguro.
for NAV in google-chrome chromium microsoft-edge chromium-browser; do
  if command -v "$NAV" >/dev/null 2>&1; then
    "$NAV" "$URL" >/dev/null 2>&1 &
    break
  fi
done

wait
