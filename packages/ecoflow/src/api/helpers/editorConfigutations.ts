import { configOptions } from "@ecoflow/types";

/**
 * Asynchronously generates an editor configuration object based on the provided config request.
 * @param {any} configRequest - The configuration request object.
 * @returns {Promise<configOptions>} A promise that resolves to the generated editor configuration object.
 */
const editorConfigutations = async (
  configRequest: any
): Promise<configOptions> => {
  const configs: configOptions = {};
  const { _ } = ecoFlow;

  const { editorEnabled, editorAdmin, editorFlow, editorSchema } =
    configRequest;

  if (!_.isUndefined(editorEnabled) && _.isBoolean(editorEnabled)) {
    configs.editor = Object.create({});
    if (editorEnabled) {
      configs.editor!.enabled = true;

      if (!_.isUndefined(editorAdmin) && _.isBoolean(editorAdmin))
        configs.editor!.admin = editorAdmin;
      if (!_.isUndefined(editorFlow) && _.isBoolean(editorFlow))
        configs.editor!.flow = editorFlow;
      if (!_.isUndefined(editorSchema) && _.isBoolean(editorSchema))
        configs.editor!.schema = editorSchema;
    } else configs.editor!.enabled = false;
  }
  return configs;
};

export default editorConfigutations;
