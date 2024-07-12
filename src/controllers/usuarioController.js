const token = require("../util/token");
const usuarioModel = require("../models/usuarioModel");
const salaModel = require("../models/salaModel");

exports.entrar = async (nick) => {
  let resp = await usuarioModel.registrarUsuario(nick);
  if (resp.insertedId) {
    return {
      idUser: resp.insertedId,
      token: await token.setToken(
        JSON.stringify(resp.insertedId).replace(/"/g, ""),
        nick
      ),
      nick: nick,
    };
  }
};

exports.BuscaUsuarios = async () => {
  let users = await usuarioModel.buscarTodosUsuarios();
  if (users.length === 0) {
    return { mensagem: "Usuarios não encotrados." };
  }
  return users;
};

// sair Usuario
exports.sairUser = async (idUser) => {
  let user = await usuarioModel.buscarUsuario(idUser);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  if (await usuarioModel.removerUsuario(idUser)) {
    return { mensagem: "Usuario deletado com sucesso!" };
  } else {
    return { mensagem: "Erro ao remover usuario!" };
  }
};
