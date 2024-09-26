function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('EE Plinio Ferraz - Sistema de Gerenciamento de Biblioteca');
}

function getPage(pageName) {
    return HtmlService.createHtmlOutputFromFile(pageName).getContent();
}

// Constantes globais
const sheetLeitoresId = 'ID DA PLANILHA LEITORES';
const leitoresName = 'Leitores';

const sheetLivrosId = 'ID DA PLANILHA LIVROS';
const livrosName = 'Livros';

const sheetEmprestimosId = 'ID DA PLANILHA EMPRESTIMOS';
const emprestimosName = 'Emprestimos';

const sheetUsuariosId = 'ID DA PLANILHA USUARIOS';
const usuariosName = 'Usuarios';

// Função para autenticar o usuário
function autenticarUsuario(usuarioAutenticar) {
  const { login_usuario, senha_usuario} = usuarioAutenticar;

  const dadosUsuarios = obterDadosUsuarios();
  
  const usuario = dadosUsuarios.find(l => String(l[2]) === String(login_usuario) && l[5] === '00:00:00 - 00/00/0000');

  let senha;
  if (usuario) {
    senha = String(usuario[3]);
  }

  if (usuario && senha_usuario === senha) {
      const userProperties = PropertiesService.getUserProperties();
      userProperties.setProperty('papel', usuario[1]);
    return { success: true, papel: usuario[1]};
  } else {
    return { success: false}
  }
}

// Função para armazenar usuário na sessão do servidor
function pegarUsuarioLogado() {
  const userProperties = PropertiesService.getUserProperties();
  const papelUsuario = userProperties.getProperty('papel');

  if (papelUsuario) {
    return { papel: papelUsuario };
  }
  return null;
}

// Função para liberar usuário na sessão do servidor
function soltarUsuarioLogado() {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.deleteAllProperties;
}

// Função para criar data no formato pt-BR
function obterDataHora() {
  const data = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const hora = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const horaData = `${hora} - ${data}`;

  return horaData;
}

// Função para obter a data no formato ISO
function converterDataISO(dataHora) {
  const [_, dataPtBr] = dataHora.split(' - ');
  const [dia, mes, ano] = dataPtBr.split('/');
  const dataISO = `${ano}-${mes}-${dia}`;

  return dataISO;
}

// Função para obter a data no formato PTBR
function converterDataPTBR(dataRecebida) {
  const [ano, mes, dia] = dataRecebida.split('-');

  const hora = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const dataPTBR = `${hora} - ${dia}/${mes}/${ano}`;

  return dataPTBR;
}
