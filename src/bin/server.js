require("dotenv").config();

const app = require("../api");

app.use((req, res, next) => {
  next();
});

let port = process.env.PORT || 5000;

app.listen(port);

console.log(`Starting in http://localhost:${port}`);
