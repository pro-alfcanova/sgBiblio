// *************************************************************************
// Função doGet
// *************************************************************************
function doGet() {
    return HtmlService.createHtmlOutputFromFile('index')
        .setTitle('EE Plinio Ferraz - Sistema de Gerenciamento de Biblioteca');
}

// *************************************************************************
// Função getPage
// *************************************************************************
function getPage(pageName) {
    return HtmlService.createHtmlOutputFromFile(pageName).getContent();
}

// *************************************************************************
// Constantes globais
// *************************************************************************
const sheetLeitoresId = '01234567890234567890123456789012345678901';
const leitoresName = 'Leitores';

const sheetLivrosId = '01234567890234567890123456789012345678901';
const livrosName = 'Livros';

const sheetEmprestimosId = '01234567890234567890123456789012345678901';
const emprestimosName = 'Emprestimos';

const sheetUsuariosId = '01234567890234567890123456789012345678901';
const usuariosName = 'Usuarios';

// *************************************************************************
// Função autenticar o usuário no sistema
// *************************************************************************
function autenticarUsuario(usuarioAutenticar) {
    const { login_usuario, senha_usuario } = usuarioAutenticar;

    const dadosUsuarios = obterDadosUsuarios();

    const usuario = dadosUsuarios.find(l => String(l[2]) === String(login_usuario) && l[5] === '00:00:00 - 00/00/0000');

    let senha;
    if (usuario) {
        senha = String(usuario[3]);
    }

    if (usuario && senha_usuario === senha) {
        const userProperties = PropertiesService.getUserProperties();
        userProperties.setProperty('papel', usuario[1]);
        return { success: true, papel: usuario[1] };
    } else {
        return { success: false };
    }
}

// *************************************************************************
// Função pegar o papel do usuário
// *************************************************************************
function pegarUsuarioLogado() {
    const userProperties = PropertiesService.getUserProperties();
    const papelUsuario = userProperties.getProperty('papel');

    if (papelUsuario) {
        return { papel: papelUsuario };
    }
    return null;
}

// *************************************************************************
// Função liberar o pepel usuário ao sair do sistema
// *************************************************************************
function soltarUsuarioLogado() {
    const userProperties = PropertiesService.getUserProperties();
    userProperties.deleteAllProperties();
}

// *************************************************************************
// Função obterDataHora no formato HH:MM:SS - DD/MM/AAAA
// *************************************************************************
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

// *************************************************************************
// Função para converter a data em AAAA-MM-DD
// *************************************************************************
function converterDataISO(dataHora) {
    const [_, dataPtBr] = dataHora.split(' - ');
    const [dia, mes, ano] = dataPtBr.split('/');
    const dataISO = `${ano}-${mes}-${dia}`;

    return dataISO;
}

// *************************************************************************
// Função para converter a da em HH:MM:SS - DD/MM/AAAA
// *************************************************************************
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
