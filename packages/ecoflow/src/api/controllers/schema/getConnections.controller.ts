import { Context } from "koa";

const getConnections = async (ctx: Context) => {
  const { database } = ecoFlow;
  ctx.status = 200;
  ctx.body = {
    payload: database.connectionList,
    count: database.counntConnections,
  };
};

export default getConnections;
