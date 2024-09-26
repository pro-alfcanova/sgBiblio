// Função para obter a planilha de empréstimos
function obterPlanilhaEmprestimos() {
  return SpreadsheetApp.openById(sheetEmprestimosId).getSheetByName(emprestimosName);
}

// Função para obter todos os dados da planilha
function obterDadosEmprestimos() {
  return obterPlanilhaEmprestimos().getDataRange().getValues();
}

// Função para buscar o próximo código de emprestimo
function buscarUltimoEmprestimo() {
  var sheetEmprestimo = obterPlanilhaEmprestimos();
  var lastRow = sheetEmprestimo.getLastRow();

  if (lastRow <= 1) return 1;

  var lastCodigo = sheetEmprestimo.getRange(lastRow, 1).getValue();
  return lastCodigo + 1;
}

// Função para verificar se o leitor tem livros emprestados
function verificarEmprestimosLeitor(codigoLeitor) {
  const sheetEmprestimos = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Emprestimos');
  const dadosEmprestimos = sheetEmprestimos.getDataRange().getValues();
  
  return dadosEmprestimos.some(emprestimo => 
    String(emprestimo[3]) === String(codigoLeitor) && emprestimo[7] === "00:00:00 00/00/0000"
  );
}

// Função para incluir um novo emprestimo
function incluirEmprestimo(emprestimoIncluir) {
  const sheetEmprestimo = obterPlanilhaEmprestimos();

  const { codigo_do_emprestimo, codigo_do_livro, nome_do_livro, codigo_do_leitor, nome_do_leitor,  data_de_retirada, data_de_devolucao} = emprestimoIncluir;
  data_de_retiradaPTBR = converterDataPTBR(data_de_retirada);
  data_de_devolucaoPTBR = converterDataPTBR(data_de_devolucao);
  data_de_entregaPTBR = "00:00:00 - 00/00/0000";

  sheetEmprestimo.appendRow([codigo_do_emprestimo, codigo_do_livro, nome_do_livro, codigo_do_leitor, nome_do_leitor, data_de_retiradaPTBR, data_de_devolucaoPTBR, data_de_entregaPTBR]);
  return { success: true, message: "Emprestimos realizado com sucesso!" };
}

// Função para buscar um emprestimo pelo código
function buscarEmprestimo(codigo_emprestimo) {
  const dadosEmprestimos = obterDadosEmprestimos();

  const emprestimo = dadosEmprestimos.find(l => String(l[0]) === String(codigo_emprestimo) && String(l[7]) === '00:00:00 - 00/00/0000');

  if (emprestimo) {
    const data_de_retiradaISO = converterDataISO(emprestimo[5]);
    const data_de_devolucaoISO = converterDataISO(emprestimo[6]);
    const data_de_entregaISO = converterDataISO(emprestimo[7]);
    return {
      codigo_do_emprestimo: emprestimo[0],
      codigo_do_livro: emprestimo[1],
      nome_do_livro: emprestimo[2],
      codigo_do_leitor: emprestimo[3],
      nome_do_leitor: emprestimo[4],
      data_de_retirada: data_de_retiradaISO,
      data_de_devolucao: data_de_devolucaoISO,
      data_de_entrega: data_de_entregaISO
    };
  }

  return `Empréstimo não encontrado ou já devolvido.`;
}

// Função para alterar os dados de um emprestimo existente
function alterarEmprestimo(emprestimoAlterar) {
  var sheetEmprestimo = obterPlanilhaEmprestimos();
  var dadosEmprestimos = obterDadosEmprestimos();

  const { codigo_do_emprestimo, codigo_do_livro, nome_do_livro, codigo_do_leitor, nome_do_leitor, data_de_retirada, data_de_devolucao } = emprestimoAlterar;
  const linhaAlvo = dadosEmprestimos.findIndex(l => String(l[0]) === String(codigo_do_emprestimo)) + 1;
  
  const data_de_retiradaPTBR = sheetEmprestimo.getRange(linhaAlvo, 6).getValue();
  const data_de_devolucaoPTBR = converterDataPTBR(data_de_devolucao);

  if (linhaAlvo > 0) {
    sheetEmprestimo.getRange(linhaAlvo, 1, 1, 7).setValues([[
      codigo_do_emprestimo, codigo_do_livro, nome_do_livro, codigo_do_leitor, nome_do_leitor, data_de_retiradaPTBR, data_de_devolucaoPTBR
    ]]);
    return { success: true, message: "Empréstimo renovado com sucesso!" };
  } 
  return { success: false, message: "Empréstimo não encontrado ou já foi entregue." };
}

// Função para excluir os dados de um emprestimo existente
function excluirEmprestimo(emprestimoExcluir) {
  var sheetEmprestimo = obterPlanilhaEmprestimos();
  var dadosEmprestimos = obterDadosEmprestimos();

  const { codigo_do_emprestimo, codigo_do_livro, nome_do_livro, codigo_do_leitor, nome_do_leitor } = emprestimoExcluir;
  const linhaAlvo = dadosEmprestimos.findIndex(l => String(l[0]) === String(codigo_do_emprestimo)) + 1;

  if (linhaAlvo > 0) {
    const data_de_retirada = sheetEmprestimo.getRange(linhaAlvo, 6).getValue();
    const data_de_devolucao = sheetEmprestimo.getRange(linhaAlvo, 7).getValue();
    const data_de_entrega = obterDataHora();

    sheetEmprestimo.getRange(linhaAlvo, 1, 1, 8).setValues([[
      codigo_do_emprestimo, codigo_do_livro, nome_do_livro, codigo_do_leitor, nome_do_leitor, data_de_retirada, data_de_devolucao, data_de_entrega
    ]]);
    return { success: true, message: "Empréstimo entregue com sucesso!" };
  } 
  return { success: false, message: "Empréstimo não encontrado ou já foi entregue." };
}

// Função para buscar empréstimos com filtro
function buscarEmprestimos(filtro) {
  const dadosEmprestimos = obterDadosEmprestimos();
  return dadosEmprestimos.slice(1).filter(emprestimo => {
    const data_de_devolucao = emprestimo[6];
    const data_de_devolucaoISO = converterDataISO(data_de_devolucao);
    const data_de_entrega = emprestimo[7];
    const data_de_hoje = obterDataHora();
    const data_de_hojeISO = converterDataISO(data_de_hoje);
    return (filtro === "Abertos" && data_de_devolucaoISO > data_de_hojeISO && data_de_entrega === '00:00:00 - 00/00/0000') ||
           (filtro === "Atrasados" && data_de_devolucaoISO < data_de_hojeISO && data_de_entrega == '00:00:00 - 00/00/0000') ||
           (filtro === "Entregues" && data_de_entrega !== '00:00:00 - 00/00/0000') ||
           filtro === "Total";
  }).map(emprestimo => ({
    codigo_do_emprestimo: emprestimo[0],
    codigo_do_livro: emprestimo[1],
    nome_do_livro: emprestimo[2],
    codigo_do_leitor: emprestimo[3],
    nome_do_leitor: emprestimo[4],
    data_de_retirada: emprestimo[5],
    data_de_devolucao: emprestimo[6],
    data_de_entrega: emprestimo[7]
  }));
}
