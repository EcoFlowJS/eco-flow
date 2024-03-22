import { Context } from "koa";

const getConfigs = async (ctx: Context) => {
  const { _, config } = ecoFlow;
  const { configID } = ctx.params;

  if (_.isUndefined(configID)) {
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
    return;
  }

  const conf = Object.create({});
  conf[configID] = await config.get(configID);
  ctx.status = 200;
  ctx.body = {
    success: true,
    payload: await JSON.parse(await JSON.stringify(conf).replace(/\\\\/g, "/")),
  };
};

export default getConfigs;
