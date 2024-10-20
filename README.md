# sgBiblio
Sistema Gerenciador de Bibliotecas e Salas de Leituras.

Utiliza a infraestrutura do Google Apps Script (GAS).

Precisa de quatro planilhas do Google Sheets: Leitores (folha: Leitores), Livros (folha: Livros), Emprestimos (folha: Emprestimos) e Usuarios (folha: Usuarios).

É preciso pegar a ID de cada uma das planilhas, pode ser feitor através do link de compartilhamento, por exemplo:
    https://docs.google.com/spreadsheets/d/01234567890234567890123456789012345678901/edit?gid=0#gid=0
                                           |        Essa é a ID da planilha        |

# Trocar o valor no arquivo indexFuncoes.gs, por exemplo:
// *************************************************************************
// Constantes globais
// *************************************************************************
const sheetLeitoresId = '01234567890234567890123456789012345678901';
const leitoresName = 'Leitores';

# Trocar o nome da escola/instituição nos arquivos: index.html, leitores.html, livros.html, emprestimos.html e usuarios.html:
        <header>
            EE Plínio Ferraz - Sistema de Gerenciamento de Bibliotecas
        </header>
