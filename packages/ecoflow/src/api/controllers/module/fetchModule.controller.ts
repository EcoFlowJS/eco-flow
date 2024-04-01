import { Context } from "koa";

const fetchModule = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;
  const { moduleID } = ctx.params;

  ctx.status = 200;
  ctx.body = _.isUndefined(moduleID)
    ? ecoModule.getModule()
    : ecoModule.getModule(moduleID);
};

export default fetchModule;
