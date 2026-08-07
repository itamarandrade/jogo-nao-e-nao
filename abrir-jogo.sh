#!/usr/bin/env bash
#
# Abre o jogo. NÃO precisa instalar nada.
#
# O jogo roda direto do arquivo (file://) e grava os cadastros num CSV do
# disco pela File System Access API do navegador — que funciona em file://,
# sem servidor. Basta escolher, uma vez, onde salvar.
#
# Uso:  ./abrir-jogo.sh          → abre o jogo
#       ./abrir-jogo.sh painel   → abre o painel de controle
#
# Precisa ser Chrome ou Edge: são os que gravam direto no arquivo. No Firefox
# o jogo funciona, mas os cadastros só são salvos por download periódico.

set -euo pipefail

PASTA="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ALVO="index.html"
[ "${1:-}" = "painel" ] && ALVO="dashboard.html"
URL="file://${PASTA}/${ALVO}"

NAV=""
for CANDIDATO in google-chrome chromium microsoft-edge chromium-browser google-chrome-stable; do
  if command -v "$CANDIDATO" >/dev/null 2>&1; then NAV="$CANDIDATO"; break; fi
done

if [ -z "$NAV" ]; then
  echo "  Não encontrei o Chrome nem o Edge."
  echo "  Abrindo no navegador padrão — mas para gravar direto no arquivo,"
  echo "  use Chrome ou Edge."
  xdg-open "$URL" >/dev/null 2>&1 || open "$URL" 2>/dev/null || true
  exit 0
fi

echo
echo "  Abrindo: $URL"
echo
echo "  ANTES DE COMEÇAR O EVENTO (uma vez só):"
echo "    1. ./abrir-jogo.sh painel"
echo "    2. Aba Cadastros → 'Conectar arquivo CSV'"
echo "    3. Escolha onde salvar (de preferência um pen drive)"
echo "    4. Confirme que a faixa ficou VERDE"
echo

# --kiosk: tela cheia sem barra de endereço, para totem. Sair: Alt+F4.
"$NAV" --kiosk "$URL" >/dev/null 2>&1 &
