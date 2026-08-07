@echo off
REM ============================================================
REM  JOGO NAO E NAO
REM
REM  De dois cliques neste arquivo para abrir o jogo.
REM  NAO precisa instalar nada.
REM
REM  Uso:  abrir-jogo.bat          -> abre o jogo
REM        abrir-jogo.bat painel   -> abre o painel de controle
REM ============================================================

setlocal
cd /d "%~dp0"

set ALVO=index.html
if /i "%~1"=="painel" set ALVO=dashboard.html

REM Precisa ser Chrome ou Edge: sao os que gravam direto no
REM arquivo do disco. No Firefox o jogo funciona, mas os
REM cadastros so sao salvos por download de tempos em tempos.
set NAV=
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set NAV=%ProgramFiles%\Google\Chrome\Application\chrome.exe
if not defined NAV if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set NAV=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe
if not defined NAV if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set NAV=%LocalAppData%\Google\Chrome\Application\chrome.exe
if not defined NAV if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set NAV=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe
if not defined NAV if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set NAV=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe

if not defined NAV (
  echo.
  echo  ============================================================
  echo   Nao encontrei o Chrome nem o Edge nesta maquina.
  echo.
  echo   O jogo vai abrir no navegador padrao, mas para gravar os
  echo   cadastros direto no arquivo e preciso Chrome ou Edge.
  echo  ============================================================
  echo.
  pause
  start "" "%CD%\%ALVO%"
  exit /b 0
)

REM --kiosk deixa em tela cheia, sem barra de endereco (bom para
REM totem). Tire o --kiosk se quiser a janela normal.
REM Sair do modo kiosk: Alt+F4.
start "" "%NAV%" --kiosk "file:///%CD:\=/%/%ALVO%"
exit /b 0
