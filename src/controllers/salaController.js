const salaModel = require("../models/salaModel");
const usuarioModel = require("../models/usuarioModel");

exports.get = async (req, res) => {
  return await salaModel.listarSalas();
};

exports.entrar = async (iduser, idsala) => {
  const sala = await salaModel.buscarSala(idsala);
  const user = await usuarioModel.buscarUsuario(iduser);

  user.sala = { _id: sala._id, nome: sala.nome, tipo: sala.tipo };

  if (await usuarioModel.alterarUsuario(user)) {
    return { mensagem: "OK", timestamp: (timestamp = Date.now()) };
  }
  return false;
};

// enviar mensagem
exports.enviarMensagem = async (nick, mensagem, idsala) => {
  const sala = await salaModel.buscarSala(idsala);

  if (!sala.mensagens) {
    sala.mensagens = [];
  }

  timestamp = Date.now();
  sala.mensagens.push({
    timestamp: timestamp,
    mensagem: mensagem,
    nick: nick,
  });

  let resp = await salaModel.atualizarMensagens(sala);

  if (!resp.acknowledged) {
    return { mensagem: "Falha ao enviar mensagem." };
  }
  return { mensagem: "OK", timestamp: timestamp };
};

exports.buscarMensagens = async (idsala, timestamp) => {
  let mensagens = await salaModel.buscarMensagens(idsala, timestamp);
  return {
    timestamp: mensagens[mensagens.length - 1].timestamp,
    mensagems: mensagens,
  };
};

// sair da sala
exports.sairSala = async (idsala, iduser) => {
  let user = await usuarioModel.buscarUsuario(iduser);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  await exports.enviarMensagem(user.nick, "Sai da sala!", idsala);

  user.sala = null;
  if (await usuarioModel.alterarUsuario(user)) {
    return await salaModel.listarSalas();
  }
  return false;
};

exports.criarSala = async (nome, tipo) => {
  const sala = {
    nome: nome,
    tipo: tipo,
    mensagens: [],
  };

  const novaSala = await salaModel.criarSala(sala);
  return novaSala;
};
