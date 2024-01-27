import { Context, Next } from "koa";

const getConnections = async (ctx: Context, next: Next) => {
  const { database } = ecoFlow;
  ctx.status = 200;
  ctx.body = {
    payload: database.connectionList,
    count: database.counntConnections,
  };
};

const createConnection = async (ctx: Context, next: Next) => {
  ctx.body = ctx.request.body;
};

const updateConnection = async (ctx: Context, next: Next) => {
  ctx.body = ctx.request.body;
};

const deleteConnection = async (ctx: Context, next: Next) => {
  ctx.body = ctx.request.body;
};

export { getConnections, createConnection, updateConnection, deleteConnection };
