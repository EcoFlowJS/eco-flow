import loadAdmin from "@eco-flow/admin-panel";
import loadFlow from "@eco-flow/flow-editor";
import loadSchema from "@eco-flow/schema-editor";
import { EcoFlow } from "@eco-flow/types";
import proxy from "koa-proxies";

export default ({ server, isAuth }: EcoFlow): void => {
  if (server.env === "development") {
    server.use(
      proxy("/admin", {
        target: "http://localhost:3000",
        changeOrigin: true,
      })
    );
    server.use(
      proxy("/editor/flow", {
        target: "http://localhost:3000",
        changeOrigin: true,
      })
    );
    server.use(
      proxy("/editor/schema", {
        target: "http://localhost:3000",
        changeOrigin: true,
      })
    );
    return;
  }
  let { editor } = ecoFlow.config._config;

  if (ecoFlow._.isEmpty(editor)) editor = { enabled: true };
  if (!editor.enabled) return;

  if (isAuth)
    editor.admin = ecoFlow._.isEmpty(editor.admin) ? true : editor.admin;
  editor.flow = ecoFlow._.isEmpty(editor.flow) ? true : editor.flow;
  editor.schema = ecoFlow._.isEmpty(editor.schema) ? true : editor.schema;

  if (editor.admin) loadAdmin(server);
  if (editor.flow) loadFlow(server);
  if (editor.schema) loadSchema(server);
};