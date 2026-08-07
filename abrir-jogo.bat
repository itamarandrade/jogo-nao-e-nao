@echo off
REM ============================================================
REM  JOGO NAO E NAO - atalho para Windows
REM
REM  De dois cliques neste arquivo para abrir o jogo.
REM  Ele sobe o servidor local (que grava os cadastros no
REM  arquivo) e abre o navegador.
REM
REM  Uso:  abrir-jogo.bat          -> abre o jogo
REM        abrir-jogo.bat painel   -> abre o painel de controle
REM
REM  Para encerrar: feche esta janela preta.
REM ============================================================

setlocal
cd /d "%~dp0"

set PORTA=8123
set ALVO=index.html
if /i "%~1"=="painel" set ALVO=dashboard.html

REM O Python precisa estar instalado. Sem ele o jogo ate abre,
REM mas NAO grava os cadastros no arquivo.
where python >nul 2>nul
if errorlevel 1 (
  echo.
  echo  ============================================================
  echo   ERRO: o Python nao esta instalado nesta maquina.
  echo.
  echo   Sem ele os cadastros NAO sao gravados no arquivo.
  echo   Instale em: https://www.python.org/downloads/
  echo   Marque a opcao "Add Python to PATH" durante a instalacao.
  echo  ============================================================
  echo.
  pause
  exit /b 1
)

start "" "http://localhost:%PORTA%/%ALVO%"
python servidor.py %PORTA%

pause
