// *************************************************************************
// Função para obter a planilha de leitores
// *************************************************************************
function obterPlanilhaLeitores() {
    return SpreadsheetApp.openById(sheetLeitoresId).getSheetByName(leitoresName);
}

// *************************************************************************
// Função para obter todos os dados da planilha
// *************************************************************************
function obterDadosLeitores() {
    return obterPlanilhaLeitores().getDataRange().getValues();
}

// *************************************************************************
// Função para incluir um novo leitor
// *************************************************************************
function incluirLeitor(leitorIncluir) {
    const { codigo_do_leitor, nome_do_leitor, funcao_do_leitor, local_do_leitor, contato_do_leitor } = leitorIncluir;
    if (!codigo_do_leitor || !nome_do_leitor || !funcao_do_leitor || !local_do_leitor || !contato_do_leitor) {
        return {
            success: false,
            message: "Por favor, preencha <strong>todos</strong> os campos."
        };
    }

    const sheetLeitor = obterPlanilhaLeitores();
    const dadosLeitores = obterDadosLeitores();
    const data_de_inclusao = obterDataHora();
    const data_de_exclusao = "00:00:00 - 00/00/0000";

    const leitoresExistentes = sheetLeitor.getRange(2, 1, sheetLeitor.getLastRow() - 1, 1).getValues();
    for (let i = 0; i < leitoresExistentes.length; i++) {
        if (String(leitoresExistentes[i][0]).trim() === String(codigo_do_leitor).trim()) {
            return {
                success: false,
                message: "Já existe um leitor cadastrado com este código!"
            };
        }
    }

    sheetLeitor.appendRow([codigo_do_leitor, nome_do_leitor, funcao_do_leitor, local_do_leitor, contato_do_leitor, data_de_inclusao, data_de_exclusao]);

    return {
        success: true,
        message: "Cadastro do leitor incluído com sucesso!"
    };
}

// *************************************************************************
// Função para buscar um leitor pelo código
// *************************************************************************
function buscarLeitor(codigo_leitor) {
   if (!codigo_leitor) {
        return {
            success: false,
            message: "Código do cadastro do leitor não foi enviado."
        };
    }

    const sheetLeitor = obterPlanilhaLeitores();
    const dadosLeitores = obterDadosLeitores();
    const sheetEmprestimo = obterPlanilhaEmprestimos();
    const dadosEmprestimos = obterDadosEmprestimos();

    const leitor = dadosLeitores.find(l => String(l[0]) === String(codigo_leitor) && l[6] === '00:00:00 - 00/00/0000');
    const emprestimo = dadosEmprestimos.find(e => String(e[3]) === String(codigo_leitor) && e[7] === '00:00:00 - 00/00/0000');

    if (leitor && !emprestimo) {
        return {
            success: true,
            codigo_do_leitor: leitor[0],
            nome_do_leitor: leitor[1],
            funcao_do_leitor: leitor[2],
            local_do_leitor: leitor[3],
            contato_do_leitor: leitor[4],
            data_de_inclusao: leitor[5],
            data_de_exclusao: leitor[6]
        };
    } else if (leitor && emprestimo) {
        return {
            success: false,
            message: `Esse leitor possui um empréstimo desde ${emprestimo[5]} com devolução prevista para ${emprestimo[6]}!`
        };
    }
    return { 
        success: false,
        message: `Cadastro do leitor não encontrado ou já excluído!`
    };
}

// *************************************************************************
// Função para alterar os dados de um leitor existente
// *************************************************************************
function alterarLeitor(leitorAlterar) {
    const { codigo_do_leitor, nome_do_leitor, funcao_do_leitor, local_do_leitor, contato_do_leitor } = leitorAlterar;
    if (!codigo_do_leitor || !nome_do_leitor || !funcao_do_leitor || !local_do_leitor || !contato_do_leitor) {
        return {
            success: false,
            message: "Por favor, preencha <strong>todos</strong> os campos."
        };
    }

    const sheetLeitor = obterPlanilhaLeitores();
    const dadosLeitores = obterDadosLeitores();

    const linhaAlvo = dadosLeitores.findIndex(l => String(l[0]) === String(codigo_do_leitor)) + 1;
    if (linhaAlvo > 0) {
        sheetLeitor.getRange(linhaAlvo, 1, 1, 5).setValues([[codigo_do_leitor, nome_do_leitor, funcao_do_leitor, local_do_leitor, contato_do_leitor]]);
        return {
            success: true,
            message: "Cadastro do leitor atualizado com sucesso!"
        };
    }
    return {
        success: false,
        message: "Cadastro do leitor não encontrado ou já excluído!"
    };
}

// *************************************************************************
// Função para excluir um leitor
// *************************************************************************
function excluirLeitor(leitorExcluir) {
    const { codigo_do_leitor, nome_do_leitor, funcao_do_leitor, local_do_leitor, contato_do_leitor } = leitorExcluir;
    if (!codigo_do_leitor || !nome_do_leitor || !funcao_do_leitor || !local_do_leitor || !contato_do_leitor) {
        return {
            success: false,
            message: "Por favor, preencha <strong>todos</strong> os campos."
        };
    }

    const sheetLeitor = obterPlanilhaLeitores();
    const dadosLeitores = obterDadosLeitores();

    const linhaAlvo = dadosLeitores.findIndex(l => String(l[0]) === String(codigo_do_leitor)) + 1;

    if (linhaAlvo > 0) {
        const data_de_inclusao = sheetLeitor.getRange(linhaAlvo, 6).getValue();
        const data_de_exclusao = obterDataHora();

        sheetLeitor.getRange(linhaAlvo, 1, 1, 7).setValues([[codigo_do_leitor, nome_do_leitor, funcao_do_leitor, local_do_leitor, contato_do_leitor, data_de_inclusao, data_de_exclusao]]);
        return {
            success: true,
            message: "Cadastro do leitor excluído com sucesso!"
        };
    }
    return {
        success: false,
        message: "Cadastro do leitor não encontrado ou já excluído!"
    };
}

// *************************************************************************
// Função para buscar leitores com filtro
// *************************************************************************
function buscarLeitores(filtro) {

    const sheetLeitor = obterPlanilhaLeitores();
    const dadosLeitores = obterDadosLeitores();

    return dadosLeitores.slice(1).filter(leitor => {
        const data_de_exclusao = leitor[6];
        return (filtro === "Ativos" && data_de_exclusao === '00:00:00 - 00/00/0000') ||
               (filtro === "Excluídos" && data_de_exclusao !== '00:00:00 - 00/00/0000') ||
                filtro === "Total";
    }).map(leitor => ({
        success: true,
        codigo_do_leitor: leitor[0],
        nome_do_leitor: leitor[1],
        funcao_do_leitor: leitor[2],
        local_do_leitor: leitor[3],
        contato_do_leitor: leitor[4],
        data_de_inclusao: leitor[5],
        data_de_exclusao: leitor[6]
    }));
}
