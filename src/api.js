var express = require("express");
const token = require("./util/token.js");
const salaController = require("./controllers/salaController");
const usuarioController = require("./controllers/usuarioController");
const router = express.Router();

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home
app.use(
  "/",
  router.get("/", (req, res) => {
    res.status(200).send("<h1>API-CHAT<h1>");
  })
);

// Sobre
app.use(
  "/sobre",
  router.get("/sobre", (req, res, next) => {
    res.status(200).send({
      nome: "API - CHAT",
      versão: "0.1.0",
      autor: "Eduarda",
    });
  })
);

// Criar usuario
app.use(
  "/entrar",
  router.post("/entrar", async (req, res, next) => {
    const usuarioController = require("./controllers/usuarioController");
    let resp = await usuarioController.entrar(req.body.nick);
    res.status(200).send(resp);
  })
);

// Criar sala
app.use(
  "/sala/criar",
  router.post("/sala/criar/:nick/:idUser", async (req, res) => {
    const checkCredential = token.checkCredentialsUser(req);

    if (!checkCredential.status) {
      return res
        .status(checkCredential.statusCode)
        .send({ mensagem: checkCredential.message });
    }

    const isValidToken = await token.checkToken(
      checkCredential.tokenUser,
      checkCredential.idUser,
      checkCredential.nick
    );

    if (!isValidToken) {
      return res.status(401).send({ mensagem: "Usuário não autorizado" });
    }

    // Extrair os dados da requisição
    const { nome, tipo } = req.body;

    if (!nome || !tipo) {
      return res
        .status(400)
        .send({ mensagem: "Nome ou tipo de sala não informado." });
    }

    // Chamar o controller para criar a sala
    const sala = await salaController.criarSala(nome, tipo);

    if (sala) {
      return res
        .status(200)
        .send({ mensagem: "Sala criada com sucesso", sala });
    } else {
      return res.status(400).send({ mensagem: "Erro ao criar sala" });
    }
  })
);

//Listar Salas
app.use(
  "/salas",
  router.get("/sala/listar/:nick/:idUser", async (req, res, next) => {
    const checkCredential = token.checkCredentialsUser(req);

    if (!checkCredential.status) {
      return res
        .status(checkCredential.statusCode)
        .send({ mensagem: checkCredential.message });
    }

    const isValidToken = await token.checkToken(
      checkCredential.tokenUser,
      checkCredential.idUser,
      checkCredential.nick
    );

    if (!isValidToken) {
      return res.status(401).send({ mensagem: "Usuário não autorizado" });
    }

    let resp = await salaController.get();

    if (resp.length === 0) {
      return res.status(404).send({ mensagem: "Salas não encontradas" });
    }
    res.status(200).send(resp);
  })
);

// Entrar em uma sala
app.use(
  "/sala/entrar",
  router.put("/sala/entrar/:nick/:idUser/:idSala", async (req, res) => {
    const checkCredential = token.checkCredentialsUser(req);

    if (!checkCredential.status) {
      return res
        .status(checkCredential.statusCode)
        .send({ mensagem: checkCredential.message });
    }

    const isValidToken = await token.checkToken(
      checkCredential.tokenUser,
      checkCredential.idUser,
      checkCredential.nick
    );

    if (!isValidToken) {
      return res.status(401).send({ mensagem: "Usuário não autorizado" });
    }

    let resp = await salaController.entrar(
      checkCredential.idUser,
      req.params.idSala
    );
    res.status(200).send(resp);
  })
);

//enviar mensagem
app.use(
  "/sala/mensagem/",
  router.post("/sala/mensagem/:nick/:idUser/:idSala", async (req, res) => {
    const checkCredential = token.checkCredentialsUser(req);

    if (!checkCredential.status) {
      return res
        .status(checkCredential.statusCode)
        .send({ mensagem: checkCredential.message });
    }

    const isValidToken = await token.checkToken(
      checkCredential.tokenUser,
      checkCredential.idUser,
      checkCredential.nick
    );

    if (!isValidToken) {
      return res.status(401).send({ mensagem: "Usuário não autorizado" });
    }

    let resp = await salaController.enviarMensagem(
      checkCredential.nick,
      req.body.mensagem,
      req.params.idSala
    );
    res.status(200).send(resp);
  })
);

//listar mensagem
app.use(
  "/sala/mensagens/",
  router.get(
    "/sala/mensagens/:nick/:idUser/:idSala/:timestamp",
    async (req, res) => {
      const checkCredential = token.checkCredentialsUser(req);

      if (!checkCredential.status) {
        return res
          .status(checkCredential.statusCode)
          .send({ mensagem: checkCredential.message });
      }

      const isValidToken = await token.checkToken(
        checkCredential.tokenUser,
        checkCredential.idUser,
        checkCredential.nick
      );

      if (!isValidToken) {
        return res.status(401).send({ mensagem: "Usuário não autorizado" });
      }

      let resp = await salaController.buscarMensagens(
        req.params.idSala,
        req.params.timestamp
      );
      res.status(200).send(resp);
    }
  )
);

// Sair da sala
app.use(
  "/sala/sair/",
  router.put("/sala/sair/:nick/:idUser/:idSala", async (req, res) => {
    const checkCredential = token.checkCredentialsUser(req);

    if (!checkCredential.status) {
      return res
        .status(checkCredential.statusCode)
        .send({ mensagem: checkCredential.message });
    }

    const isValidToken = await token.checkToken(
      checkCredential.tokenUser,
      checkCredential.idUser,
      checkCredential.nick
    );

    if (!isValidToken) {
      return res.status(401).send({ mensagem: "Usuário não autorizado" });
    }

    try {
      let resp = await salaController.sairSala(
        req.params.idSala,
        checkCredential.idUser
      );
      res.status(200).send(resp);
    } catch (error) {
      res
        .status(500)
        .send({ mensagem: "Erro ao sair da sala", error: error.message });
    }
  })
);

// Busca Usuarios
app.use(
  "/listar/usuarios",
  router.get("/listar/usuarios/:nick/:idUser", async (req, res) => {
    const checkCredential = token.checkCredentialsUser(req);

    if (!checkCredential.status) {
      return res
        .status(checkCredential.statusCode)
        .send({ mensagem: checkCredential.message });
    }

    const isValidToken = await token.checkToken(
      checkCredential.tokenUser,
      checkCredential.idUser,
      checkCredential.nick
    );

    if (!isValidToken) {
      return res.status(401).send({ mensagem: "Usuário não autorizado" });
    }

    try {
      let resp = await usuarioController.BuscaUsuarios();
      res.status(200).send(resp);
    } catch (error) {
      res
        .status(500)
        .send({ mensagem: "Erro ao buscar usuarios.", error: error.message });
    }
  })
);

// Remove usuario
app.use(
  "/deleta/usuario",
  router.delete("/deleta/usuario/:nick/:idUser", async (req, res) => {
    const checkCredential = token.checkCredentialsUser(req);

    if (!checkCredential.status) {
      return res
        .status(checkCredential.statusCode)
        .send({ mensagem: checkCredential.message });
    }

    const isValidToken = await token.checkToken(
      checkCredential.tokenUser,
      checkCredential.idUser,
      checkCredential.nick
    );

    if (!isValidToken) {
      return res.status(401).send({ mensagem: "Usuário não autorizado" });
    }

    try {
      let resp = await usuarioController.sairUser(checkCredential.idUser);
      res.status(200).send(resp);
    } catch (error) {
      res
        .status(500)
        .send({ mensagem: "Erro ao deletar usuario", error: error.message });
    }
  })
);

module.exports = app;
