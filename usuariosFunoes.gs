// Função para obter a planilha de usuários
function obterPlanilhaUsuarios() {
  return SpreadsheetApp.openById(sheetUsuariosId).getSheetByName(usuariosName);
}

// Função para obter todos os dados da planilha
function obterDadosUsuarios() {
  return obterPlanilhaUsuarios().getDataRange().getValues();
}

// Função para buscar o próximo código de usuario
function buscarUltimoUsuario() {
  const sheetUsuario = obterPlanilhaUsuarios();
  const lastRow = sheetUsuario.getLastRow();

  if (lastRow <= 1) return 1;

  const lastCodigo = sheetUsuario.getRange(lastRow, 1).getValue();
  return lastCodigo + 1;
}

// Função para incluir um novo usuário
function incluirUsuario(usuarioIncluir) {
  const sheetUsuario = obterPlanilhaUsuarios();
  const data_de_inclusao = obterDataHora();
  const data_de_exclusao = "00:00:00 - 00/00/0000";

  const { nome_do_usuario, contato_do_usuario, login_do_usuario, senha_do_usuario } = usuarioIncluir;

  const loginsExistentes = sheetUsuario.getRange(2, 3, sheetUsuario.getLastRow() - 1, 1).getValues();

  for (let i = 0; i < loginsExistentes.length; i++) {
    if (loginsExistentes[i][0] === login_do_usuario) {
      return { success: false, message: "Já existe um usuário cadastrado com este login!" };
    }
  }

  const usuariosExistentes = sheetUsuario.getRange(2, 1, sheetUsuario.getLastRow() - 1, 1).getValues();

  for (let i = 0; i < usuariosExistentes.length; i++) {
    if (usuariosExistentes[i][0] === nome_do_usuario) {
      return { success: false, message: "Já existe um usuário cadastrado com este nome!" };
    }
  }

  sheetUsuario.appendRow([ nome_do_usuario, contato_do_usuario, login_do_usuario, senha_do_usuario, data_de_inclusao, data_de_exclusao]);

  return { success: true, message: "Cadastro do usuário incluído com sucesso!" };
}

// Função para buscar um usuario pelo nome
function buscarUsuario(nome_usuario) {
  const dadosUsuarios = obterDadosUsuarios();

  const usuario = dadosUsuarios.find(l => String(l[0]) === String(nome_usuario) && l[5] === '00:00:00 - 00/00/0000');

  if (usuario) {
    return {
      nome_do_usuario: usuario[0],
      contato_do_usuario: usuario[1],
      login_do_usuario: usuario[2],
      senha_do_usuario: usuario[3],
      data_de_inclusao: usuario[4],
      data_de_exclusao: usuario[5]
    };
  }
  return 'Usuário não encontrado ou já excluído!';
}

// Função para alterar os dados de um usuário existente
function alterarUsuario(usuarioAlterar) {
  const sheetUsuario = obterPlanilhaUsuarios();
  const dadosUsuarios = obterDadosUsuarios();

  const { nome_do_usuario, contato_do_usuario, login_do_usuario, senha_do_usuario } = usuarioAlterar;
  const linhaAlvo = dadosUsuarios.findIndex(l => String(l[0]) === String(nome_do_usuario)) + 1;

  if (linhaAlvo > 0) {
    sheetUsuario.getRange(linhaAlvo, 1, 1, 4).setValues([[
      nome_do_usuario, contato_do_usuario, login_do_usuario, senha_do_usuario
    ]]);
    return { success: true, message: "Cadastro do usuário atualizado com sucesso!" };
  } 
  return { success: false, message: "Usuário não encontrado ou já excluído." };
}

// Função para excluir um usuario
function excluirUsuario(usuarioExcluir) {
  const sheetUsuario = obterPlanilhaUsuarios();
  const dadosUsuarios = obterDadosUsuarios();

  const { nome_do_usuario, contato_do_usuario, login_do_usuario, senha_do_usuario } = usuarioExcluir;
  const linhaAlvo = dadosUsuarios.findIndex(l => String(l[0]) === String(nome_do_usuario)) + 1;

  if (linhaAlvo > 0) {
    const data_de_inclusao = sheetUsuario.getRange(linhaAlvo, 5).getValue();
    const data_de_exclusao = obterDataHora();

    sheetUsuario.getRange(linhaAlvo, 1, 1, 6).setValues([[
      nome_do_usuario, contato_do_usuario, login_do_usuario, senha_do_usuario, data_de_inclusao, data_de_exclusao
    ]]);
    return { success: true, message: "Cadastro do usuário excluído com sucesso!" };
  }
  return { success: false, message: "Usuário não encontrado ou já exluído." };
}

// Função para buscar usuários com filtro
function buscarUsuarios(filtro) {
  const dadosUsuarios = obterDadosUsuarios();
  return dadosUsuarios.slice(1).filter(usuario => {
    const data_de_exclusao = usuario[5];
    return (filtro === "Ativos" && data_de_exclusao === '00:00:00 - 00/00/0000') ||
           (filtro === "Excluídos" && data_de_exclusao !== '00:00:00 - 00/00/0000') ||
           filtro === "Total";
  }).map(usuario => ({
    nome_do_usuario: usuario[0],
    contato_do_usuario: usuario[1],
    login_do_usuario: usuario[2],
    senha_do_usuario: usuario[3],
    data_de_inclusao: usuario[4],
    data_de_exclusao: usuario[5]
  }));
}
