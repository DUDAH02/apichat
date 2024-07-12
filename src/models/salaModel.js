const db = require("./db");
const { ObjectId } = require("mongodb");

let listarSalas = async () => {
  let salas = await db.findAll("salas");
  return salas;
};

let buscarSala = async (idsala) => {
  return db.findOne("salas", idsala);
};

let atualizarMensagens = async (sala) => {
  return await db.updateOne("salas", sala, { _id: sala._id });
};

let buscarMensagens = async (idsala, timestamp) => {
  let sala = await buscarSala(idsala);
  if (sala.mensagens) {
    let mensagens = [];
    sala.mensagens.forEach((msg) => {
      if (msg.timestamp >= timestamp) {
        mensagens.push(msg);
      }
    });
    return mensagens;
  }
  return [];
};

let sairSala = async (idsala) => {
  let salas = await db.findAll("salas");
  return salas;
};

let criarSala = async (sala) => {
  return await db.insertOne("salas", sala);
};

module.exports = {
  listarSalas,
  buscarSala,
  atualizarMensagens,
  buscarMensagens,
  sairSala,
  criarSala,
};
