const { ObjectId } = require("mongodb");
const db = require("./db");

let registrarUsuario = async (nick) => {
  try {
    return await db.insertOne("usuario", { nick: nick });
  } catch (error) {
    console.log(error);
  }
};

let buscarUsuario = async (idUser) => {
  let user = await db.findOne("usuario", idUser);
  return user;
};

let buscarTodosUsuarios = async () => {
  let user = await db.findAllUsuarios("usuario");
  return user;
};

let alterarUsuario = async (user) => {
  return await db.updateOne("usuario", user, { _id: user._id });
};

let removerUsuario = async (idUser) => {
  let result = await db.deleteOne("usuario", { _id: new ObjectId(idUser) });

  if (result.deletedCount === 1) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  registrarUsuario,
  buscarUsuario,
  alterarUsuario,
  removerUsuario,
  buscarTodosUsuarios,
};
