# sgBiblio
Sistema Gerenciador de Bibliotecas e Salas de Leituras.
Utiliza a infraestrutura do Google Apps Script (GAS).

# Criar planilhas do Google Sheets
São utilizadas quatro planilhas: Leitores (folha: Leitores), Livros (folha: Livros), Emprestimos (folha: Emprestimos) e Usuarios (folha: Usuarios).

# Obter as ID de cada uma das planilhas (sheetId)
É preciso pegar a ID de cada uma das planilhas, pode ser feitor através do link de compartilhamento, por exemplo:
    https://docs.google.com/spreadsheets/d/01234567890234567890123456789012345678901/edit?gid=0#gid=0

# Trocar o valor no arquivo indexFuncoes.gs, por exemplo:
const sheetLeitoresId = '01234567890234567890123456789012345678901';

# Trocar o nome da escola/instituição para exibição:
Trocar na <strong>tag header</strong> dos arquivos index.html, leitores.html, livros.html, emprestimos.html e usuarios.html:<br>
        <strong>EE Plinio Ferraz</strong> - Sistema de Gerenciamento de Bibliotecas
