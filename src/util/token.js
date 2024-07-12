const jwt = require("jsonwebtoken");

const checkToken = async (token, id, key) => {
  //função que verifica o token
  return jwt.verify(token, key, (err, decoded) => {
    if (err) {
      return false;
    } else if (decoded.id == id) {
      return true;
    } else {
      return false;
    }
  });
};

const checkCredentialsUser = (req) => {
  const isToken = req.headers.authorization;
  if (!isToken) {
    return {
      status: false,
      statusCode: 401,
      message: "Token não fornecido.",
    };
  }

  const tokenUser = isToken.split(" ")[1];
  const idUser = req.params.idUser;
  const nick = req.params.nick;

  if (!tokenUser) {
    return {
      status: false,
      statusCode: 401,
      message: "Token não fornecido.",
    };
  }

  if (!idUser || !nick) {
    return {
      status: false,
      statusCode: 400,
      message: "Id de usuario ou nick não informado no parametro da rota.",
    };
  }

  return {
    status: true,
    tokenUser,
    idUser,
    nick,
  };
};

const setToken = async (id, key) => {
  //cria um token para o usuario
  let token;
  console.log(id);
  if (id) {
    token = jwt.sign({ id }, key, { expiresIn: 28800 });
    console.log(`Token => ${token}`);
    return token;
  }
  return false;
};

module.exports = {
  checkToken,
  setToken,
  checkCredentialsUser,
};
