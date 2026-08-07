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
URL="http://localhost:${PORTA}/${ALVO}"

if curl -s -o /dev/null --max-time 2 "http://localhost:${PORTA}/api/status" 2>/dev/null; then
  echo "  Já havia um servidor na porta ${PORTA}; reaproveitando."
  echo "  Jogo: $URL"
  SEGUNDO_PLANO=1
else
  SEGUNDO_PLANO=0
fi

# Abre o navegador em paralelo: o servidor abaixo segura o terminal.
(
  sleep 2
  for NAV in google-chrome chromium microsoft-edge chromium-browser firefox; do
    if command -v "$NAV" >/dev/null 2>&1; then
      "$NAV" "$URL" >/dev/null 2>&1 &
      break
    fi
  done
) &

if [ "$SEGUNDO_PLANO" = "1" ]; then
  echo "  Encerre o outro terminal para parar o servidor."
  wait
  exit 0
fi

# O servidor.py imprime o caminho do arquivo e fica no comando do terminal.
exec python3 "$PASTA/servidor.py" "$PORTA"
