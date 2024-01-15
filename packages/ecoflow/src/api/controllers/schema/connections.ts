import { Context, Next } from "koa";

const getConnections = async (ctx: Context, next: Next) => {
  const { database } = ecoFlow;
  ctx.status = 200;
  ctx.body = {
    payload: database.connectionNameList,
    count: database.counntConnections,
  };
};

const createConnection = async (ctx: Context, next: Next) => {};

const updateConnection = async (ctx: Context, next: Next) => {};

const deleteConnection = async (ctx: Context, next: Next) => {};

export { getConnections, createConnection, updateConnection, deleteConnection };
