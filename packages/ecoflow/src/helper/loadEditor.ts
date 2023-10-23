import loadAdmin from "@eco-flow/admin-panel";
import loadFlow from "@eco-flow/flow-editor";
import loadSchema from "@eco-flow/schema-editor";
import { EcoFlow } from "@eco-flow/types";

export const loadEditor = ({ server }: EcoFlow): void => {
  if (ecoFlow.server.env === "developmen") return;
  let { editor } = ecoFlow.config._config;

  if (ecoFlow._.isEmpty(editor)) editor = { enabled: true };
  if (!editor.enabled) return;

  editor.admin = ecoFlow._.isEmpty(editor.admin) ? true : editor.admin;
  editor.flow = ecoFlow._.isEmpty(editor.flow) ? true : editor.flow;
  editor.schema = ecoFlow._.isEmpty(editor.schema) ? true : editor.schema;

  if (editor.admin) loadAdmin(server);
  if (editor.flow) loadFlow(server);
  if (editor.schema) loadSchema(server);
};
