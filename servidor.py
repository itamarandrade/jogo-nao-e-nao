#!/usr/bin/env python3
"""
Servidor local do jogo — serve as páginas E grava os cadastros em CSV.

Por que existe
--------------
O navegador, sozinho, não consegue criar um arquivo num caminho do disco: ele
sempre precisa que alguém escolha o lugar numa janela. É barreira de segurança,
não limitação nossa.

Como o jogo já precisa de um servidor local para rodar, é ele quem grava. Assim
o arquivo **nasce sozinho**, num caminho fixo e visível, sem ninguém clicar em
nada — e funciona em qualquer navegador.

Onde o arquivo fica
-------------------
    dados/jogadores.csv    (ao lado deste script)

Cada cadastro é gravado NA HORA, com flush + fsync: se faltar energia no totem,
o que já foi cadastrado está no disco, não num buffer.

Uso
---
    ./abrir-jogo.sh              → sobe isto e abre o jogo
    python3 servidor.py 8123     → sobe só o servidor
"""

import csv
import io
import json
import os
import subprocess
import sys
import threading
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PASTA = os.path.dirname(os.path.abspath(__file__))
PASTA_DADOS = os.path.join(PASTA, 'dados')
ARQUIVO = os.path.join(PASTA_DADOS, 'jogadores.csv')

COLUNAS = ['ID', 'Nome', 'CPF', 'Consentimento', 'Cadastro completo',
           'Data', 'Hora', 'Timestamp']

# Duas requisições podem chegar juntas; sem o cadeado, duas linhas se
# embaralhariam no meio do arquivo.
TRAVA = threading.Lock()


def garantir_arquivo():
    """Cria a pasta e o CSV com cabeçalho, se ainda não existirem."""
    os.makedirs(PASTA_DADOS, exist_ok=True)
    if not os.path.exists(ARQUIVO):
        with open(ARQUIVO, 'w', newline='', encoding='utf-8-sig') as f:
            csv.writer(f, delimiter=';').writerow(COLUNAS)
        print(f'  Arquivo criado: {ARQUIVO}')


def ids_gravados():
    """Ids já no arquivo — evita gravar o mesmo cadastro duas vezes."""
    if not os.path.exists(ARQUIVO):
        return set()
    try:
        with open(ARQUIVO, 'r', newline='', encoding='utf-8-sig') as f:
            leitor = csv.reader(f, delimiter=';')
            next(leitor, None)
            return {linha[0] for linha in leitor if linha}
    except Exception as e:
        print(f'  [aviso] não consegui ler o arquivo: {e}', file=sys.stderr)
        return set()


def gravar(jogador):
    """
    Acrescenta um cadastro. Devolve True se gravou, False se já existia.

    O fsync é o ponto todo: sem ele o dado fica num buffer do sistema e uma
    queda de energia leva embora os últimos cadastros.
    """
    with TRAVA:
        garantir_arquivo()
        ident = str(jogador.get('id', ''))
        if not ident or ident in ids_gravados():
            return False

        linha = [
            ident,
            jogador.get('name', '') or '',
            jogador.get('cpf', '') or '',
            'Sim' if jogador.get('consent') else 'Não',
            'Sim' if jogador.get('registered') else 'Não',
            jogador.get('date', '') or '',
            jogador.get('time', '') or '',
            jogador.get('timestamp', '') or '',
        ]
        with open(ARQUIVO, 'a', newline='', encoding='utf-8-sig') as f:
            csv.writer(f, delimiter=';').writerow(linha)
            f.flush()
            os.fsync(f.fileno())
        return True


def ler_todos():
    """Todos os cadastros do arquivo — é o caminho de volta se o navegador for limpo."""
    garantir_arquivo()
    with TRAVA:
        with open(ARQUIVO, 'r', newline='', encoding='utf-8-sig') as f:
            leitor = csv.reader(f, delimiter=';')
            next(leitor, None)
            jogadores = []
            for l in leitor:
                if not l or not l[0]:
                    continue
                l = l + [''] * (8 - len(l))
                jogadores.append({
                    'id': l[0], 'name': l[1], 'cpf': l[2],
                    'consent': l[3] == 'Sim', 'registered': l[4] == 'Sim',
                    'date': l[5], 'time': l[6], 'timestamp': l[7],
                })
            return jogadores


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PASTA, **kwargs)

    def log_message(self, formato, *args):
        # Silencia o log de cada arquivo servido; só o que interessa aparece.
        pass

    def _responder(self, dados, status=200):
        corpo = json.dumps(dados, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(corpo)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(corpo)

    def do_GET(self):
        if self.path.startswith('/api/status'):
            existe = os.path.exists(ARQUIVO)
            return self._responder({
                'ok': True,
                'arquivo': ARQUIVO,
                'pasta': PASTA_DADOS,
                'existe': existe,
                'total': len(ler_todos()) if existe else 0,
                'tamanho': os.path.getsize(ARQUIVO) if existe else 0,
            })

        if self.path.startswith('/api/jogadores'):
            return self._responder({'ok': True, 'jogadores': ler_todos()})

        # Nunca guardar em cache: no totem, um game.js velho em cache já nos
        # custou tempo de depuração.
        self.send_header_no_cache = True
        return super().do_GET()

    def end_headers(self):
        if getattr(self, 'send_header_no_cache', False):
            self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def do_POST(self):
        # Abre a pasta dos cadastros no gerenciador de arquivos do sistema.
        # O caminho é fixo (não vem da requisição) e o servidor só escuta em
        # 127.0.0.1, então não há como pedir para abrir outra coisa.
        if self.path.startswith('/api/abrir-pasta'):
            try:
                garantir_arquivo()
                if sys.platform == 'darwin':
                    comando = ['open', PASTA_DADOS]
                elif os.name == 'nt':
                    comando = ['explorer', PASTA_DADOS]
                else:
                    comando = ['xdg-open', PASTA_DADOS]
                subprocess.Popen(comando, stdout=subprocess.DEVNULL,
                                 stderr=subprocess.DEVNULL)
                return self._responder({'ok': True, 'pasta': PASTA_DADOS})
            except Exception as e:
                return self._responder({'ok': False, 'erro': str(e),
                                        'pasta': PASTA_DADOS}, 500)

        if not self.path.startswith('/api/cadastro'):
            return self._responder({'ok': False, 'erro': 'rota desconhecida'}, 404)
        try:
            tamanho = int(self.headers.get('Content-Length') or 0)
            corpo = json.loads(self.rfile.read(tamanho).decode('utf-8'))
            jogadores = corpo if isinstance(corpo, list) else [corpo]

            gravados = sum(1 for j in jogadores if gravar(j))
            total = len(ler_todos())
            if gravados:
                print(f'  + {gravados} cadastro(s) — total: {total}', flush=True)
            return self._responder({'ok': True, 'gravados': gravados,
                                    'total': total, 'arquivo': ARQUIVO})
        except Exception as e:
            print(f'  [ERRO] ao gravar: {e}', file=sys.stderr)
            return self._responder({'ok': False, 'erro': str(e)}, 500)


def main():
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8123
    garantir_arquivo()
    total = len(ler_todos())

    print()
    print('  ' + '=' * 62)
    print('  JOGO NÃO É NÃO — servidor local')
    print('  ' + '=' * 62)
    print(f'  Arquivo dos cadastros:')
    print(f'    {ARQUIVO}')
    print(f'  Cadastros já gravados: {total}')
    print()
    print(f'  Jogo:   http://localhost:{porta}/index.html')
    print(f'  Painel: http://localhost:{porta}/dashboard.html')
    print()
    print('  Cada cadastro é gravado no arquivo na hora. Encerrar: Ctrl+C')
    print('  ' + '=' * 62)
    print()

    ThreadingHTTPServer(('127.0.0.1', porta), Handler).serve_forever()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n  Servidor encerrado. Os cadastros estão em:')
        print(f'  {ARQUIVO}\n')
