const jsonServerAuth = require("json-server-auth");
const server = jsonServerAuth.create();
const router = jsonServerAuth.router("db.json");
const middlewares = jsonServerAuth.defaults();
const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(router);

server.listen(port);