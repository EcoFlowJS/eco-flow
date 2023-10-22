const mount = require("koa-mount");
const serve = require("koa-static");

module.exports = ({ server }) => {
  server.use(mount("/admin", serve(__dirname + "/build")));
};
