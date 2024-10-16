// *************************************************************************
// Função para obter a planilha de livros
// *************************************************************************
function obterPlanilhaLivros() {
    return SpreadsheetApp.openById(sheetLivrosId).getSheetByName(livrosName);
}

// *************************************************************************
// Função para obter todos os dados da planilha
// *************************************************************************
function obterDadosLivros() {
    return obterPlanilhaLivros().getDataRange().getValues();
}

// *************************************************************************
// Função para buscar o próximo código de livro
// *************************************************************************
function buscarUltimoLivro() {
    const sheetLivro = obterPlanilhaLivros();
    const lastRow = sheetLivro.getLastRow();

    if (lastRow <= 1) return 1;

    const lastCodigo = sheetLivro.getRange(lastRow, 1).getValue();
    return lastCodigo + 1;
}

// *************************************************************************
// Função para incluir um novo livro
// *************************************************************************
function incluirLivro(livroIncluir) {
    const { codigo_do_livro, nome_do_livro, nome_do_autor, assuntos_do_livro, nome_da_editora, numero_da_edicao, local_de_publicacao, ano_de_publicacao, numero_do_exemplar } = livroIncluir;
    if (!codigo_do_livro || !nome_do_livro || !nome_do_autor || !assuntos_do_livro || !nome_da_editora || !numero_da_edicao || !local_de_publicacao || !ano_de_publicacao || !numero_do_exemplar) {
        return {
            success: false,
            message: "Por favor, preencha <strong>todos</strong> os campos."
        };
    }

    const sheetLivro = obterPlanilhaLivros();
    const dadosLivros = obterDadosLivros();
    const data_de_inclusao = obterDataHora();
    const data_de_exclusao = "00:00:00 - 00/00/0000";

    const livrosExistentes = sheetLivro.getRange(2, 1, sheetLivro.getLastRow() - 1, 1).getValues();
    for (let i = 0; i < livrosExistentes.length; i++) {
        if (String(livrosExistentes[i][0]).trim() === String(codigo_do_livro).trim()) {
            return {
                success: false,
                message: "Já existe um livro cadastrado com este código!"
            };
        }
    }

    sheetLivro.appendRow([codigo_do_livro, nome_do_livro, nome_do_autor, assuntos_do_livro, nome_da_editora, numero_da_edicao, local_de_publicacao, ano_de_publicacao, numero_do_exemplar, data_de_inclusao, data_de_exclusao]);
    return { 
        success: true,
        message: "Cadastro do livro incluído com sucesso!" };
}

// *************************************************************************
// Função para buscar um livro pelo código
// *************************************************************************
function buscarLivro(codigo_livro) {
   if (!codigo_livro) {
        return {
            success: false,
            message: "Código do cadastro do livro não foi enviado."
        };
    }

    const sheetLivros = obterPlanilhaLeitores();
    const dadosLivros = obterDadosLivros();
    const sheetEmprestimo = obterPlanilhaEmprestimos();
    const dadosEmprestimos = obterDadosEmprestimos();

    const livro = dadosLivros.find(l => String(l[0]) === String(codigo_livro) && l[10] === '00:00:00 - 00/00/0000');
    const emprestimo = dadosEmprestimos.find(e => String(e[1]) === String(codigo_livro) && e[7] === '00:00:00 - 00/00/0000');

    if (livro && !emprestimo) {
        return {
            success: true,
            codigo_do_livro: livro[0],
            nome_do_livro: livro[1],
            nome_do_autor: livro[2],
            assuntos_do_livro: livro[3],
            nome_da_editora: livro[4],
            numero_da_edicao: livro[5],
            local_de_publicacao: livro[6],
            ano_de_publicacao: livro[7],
            numero_do_exemplar: livro[8],
            data_de_inclusao: livro[9],
            data_de_exclusao: livro[10]
        };
    } else if (livro && emprestimo) {
        return {
            success: false,
            message: `Esse livro está emprestado desde ${emprestimo[5]} com devolução prevista para ${emprestimo[6]}!`
        };
    }
    return { 
        success: false,
        message: `Cadastro do livro não encontrado ou já excluído!`
    };
}


// *************************************************************************
// Função para alterar os dados de um livro existente
// *************************************************************************
function alterarLivro(livroAlterar) {
    const { codigo_do_livro, nome_do_livro, nome_do_autor, assuntos_do_livro, nome_da_editora, numero_da_edicao, local_de_publicacao, ano_de_publicacao, numero_do_exemplar } = livroAlterar;
    if (!codigo_do_livro || !nome_do_livro || !nome_do_autor || !assuntos_do_livro || !nome_da_editora || !numero_da_edicao || !local_de_publicacao || !ano_de_publicacao || !numero_do_exemplar) {
        return {
            success: false,
            message: "Por favor, preencha <strong>todos</strong> os campos."
        };
    }

    const sheetLivro = obterPlanilhaLivros();
    const dadosLivros = obterDadosLivros();

    const linhaAlvo = dadosLivros.findIndex(l => String(l[0]) === String(codigo_do_livro)) + 1;
    if (linhaAlvo > 0) {
        sheetLivro.getRange(linhaAlvo, 1, 1, 9).setValues([[
            codigo_do_livro, nome_do_livro, nome_do_autor, assuntos_do_livro, nome_da_editora, numero_da_edicao, local_de_publicacao, ano_de_publicacao, numero_do_exemplar
        ]]);
        return {
            success: true,
            message: "Cadastro do livro atualizado com sucesso!"
        };
    } 
    return {
        success: false,
        message: "Cadastro do livro não encontrado ou já excluído!"
    };
}

// *************************************************************************
// Função para excluir um livro
// *************************************************************************
function excluirLivro(livroExcluir) {
    const { codigo_do_livro, nome_do_livro, nome_do_autor, assuntos_do_livro, nome_da_editora, numero_da_edicao, local_de_publicacao, ano_de_publicacao, numero_do_exemplar } = livroExcluir;
    if (!codigo_do_livro || !nome_do_livro || !nome_do_autor || !assuntos_do_livro || !nome_da_editora || !numero_da_edicao || !local_de_publicacao || !ano_de_publicacao || !numero_do_exemplar) {
        return {
            success: false,
            message: "Por favor, preencha <strong>todos</strong> os campos."
        };
    }

    const sheetLivro = obterPlanilhaLivros();
    const dadosLivros = obterDadosLivros();

    const linhaAlvo = dadosLivros.findIndex(l => String(l[0]) === String(codigo_do_livro)) + 1;
    if (linhaAlvo > 0) {
        const data_de_inclusao = sheetLivro.getRange(linhaAlvo, 10).getValue();
        const data_de_exclusao = obterDataHora();

        sheetLivro.getRange(linhaAlvo, 1, 1, 11).setValues([[
            codigo_do_livro, nome_do_livro, nome_do_autor, assuntos_do_livro, nome_da_editora, numero_da_edicao, local_de_publicacao, ano_de_publicacao, numero_do_exemplar, data_de_inclusao, data_de_exclusao
        ]]);
        return {
            success: true,
            message: "Cadastro do livro excluído com sucesso!"
        };
    } 
    return {
        success: false,
        message: "Cadastro do livro não encontrado ou já excluído!"
    };
}

// *************************************************************************
// Função para buscar livros com filtro
// *************************************************************************
function buscarLivros(filtro) {
    const dadosLivros = obterDadosLivros();
    return dadosLivros.slice(1).filter(livro => {
        const data_de_exclusao = livro[10];
        return (filtro === "Ativos" && data_de_exclusao === '00:00:00 - 00/00/0000') ||
               (filtro === "Excluídos" && data_de_exclusao !== '00:00:00 - 00/00/0000') ||
                filtro === "Total";
    }).map(livro => ({
        codigo_do_livro: livro[0],
        nome_do_livro: livro[1],
        nome_do_autor: livro[2],
        assuntos_do_livro: livro[3],
        nome_da_editora: livro[4],
        numero_da_edicao: livro[5],
        local_de_publicacao: livro[6],
        ano_de_publicacao: livro[7],
        numero_do_exemplar: livro[8],
        data_de_inclusao: livro[9],
        data_de_exclusao: livro[10]
    }));
}
