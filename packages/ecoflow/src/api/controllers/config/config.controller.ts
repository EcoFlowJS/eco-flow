import { Context } from "koa";
import parseServerConfigHelper from "../../helpers/parseServerConfigHelper";

const getAllConfigs = async (ctx: Context) => {
  const { config } = ecoFlow;
  ctx.status = 200;
  ctx.body = {
    success: true,
    payload: {
      serverConfig: await JSON.parse(
        await JSON.stringify(config._config).replace(/\\\\/g, "/")
      ),
      defaultConfig: await config.getDefaultConfigs(),
    },
  };
};

const getConfig = async (ctx: Context) => {
  if (typeof ctx.params.config === "undefined") {
    ctx.status = 404;
    ctx.body = {
      error: true,
      payload: "invalid config parameter",
    };
    return;
  }

  const config = Object.create({});
  config[ctx.params.config] = await ecoFlow.config.get(ctx.params.config);
  ctx.status = 200;
  ctx.body = {
    success: true,
    payload: await JSON.parse(
      await JSON.stringify(config).replace(/\\\\/g, "/")
    ),
  };
};

const updateConfig = async (ctx: Context) => {
  ctx.status = 200;
  try {
    const { config, log } = ecoFlow;

    const configs = await parseServerConfigHelper({
      ...(<any>ctx.request.body),
    });

    await config.createBackup();
    log.info("Writing new configuration ");
    await config.setConfig(configs);

    ctx.body = {
      success: true,
      payload: "Configuration updated successfully.",
    };
  } catch (error) {
    ctx.body = {
      error: true,
      payload: error,
    };
  }
};

export { getConfig, updateConfig, getAllConfigs };
