import {
  EcoContext,
  EcoEvent,
  NodeConfiguration,
  NodesStack,
} from "@ecoflow/types";
import { Context } from "koa";
import TPromise from "thread-promises";
import buildUserControllers from "./buildUserControllers";
import debugController from "./debugController";
import eventEmitterController from "./eventEmitterController";
import middlewareController from "./middlewareController";
import responseController from "./responseController";

const generateContext = (
  ctx: Context | any[],
  next: () => void
): EcoContext | EcoEvent => {
  const { _ } = ecoFlow;
  if (_.isArray(ctx)) {
    const payload = Object.create({});
    ctx.forEach(
      (item, index) => (payload[index === 0 ? "msg" : `msg${index}`] = item)
    );
    return {
      payload,
      next,
    };
  }

  return {
    ...ctx,
    payload: { msg: (<any>ctx.request).body || {} },
    next,
  };
};

/**
 * Builds a controller function that executes a series of middlewares and controllers based on the provided configuration.
 * @param {NodesStack} [middlewares=[]] - An array of middleware functions to be executed.
 * @param {NodeConfiguration[]} nodeConfiguration - An array of node configurations specifying the controllers to be executed.
 * @returns {Promise<void>} A promise that resolves when all middlewares and controllers have been executed.
 */
const buildController = async (
  middlewares: NodesStack = [],
  nodeConfiguration: NodeConfiguration[],
  mode: "KOA" | "EVENT" = "KOA"
) => {
  return async (ctx: Context | any[]) => {
    const { _ } = ecoFlow;
    const controllerResponse = Object.create({});
    const middlewareResponse = Object.create({});
    const concurrentMiddlewares: TPromise<Array<void>, void, void>[] =
      middlewares.map(
        (middleware) =>
          new TPromise<Array<void>, void, void>(async (resolve) => {
            const controllers = await buildUserControllers(
              middleware,
              nodeConfiguration
            );

            let isNext = true;
            let lastControllerID: string | null = null;

            const ecoContext: EcoContext | EcoEvent = generateContext(
              ctx,
              function next() {
                isNext = true;
              }
            );

            for await (const controller of controllers) {
              const [id, type, datas, inputs, userControllers] = controller;

              if (_.has(controllerResponse, id)) continue;

              if (!isNext && type === "Middleware") {
                controllerResponse[id] = lastControllerID
                  ? controllerResponse[lastControllerID]
                  : (ecoContext.payload as never);
                lastControllerID = id;
                continue;
              }
              isNext = false;
              ecoContext.inputs = inputs;
              ecoContext.moduleDatas = datas;

              if (type === "Middleware")
                await middlewareController(
                  id,
                  ecoContext,
                  userControllers,
                  controllerResponse
                );

              if (type === "Response" && mode === "KOA" && !_.isArray(ctx))
                await responseController(
                  ecoContext as EcoContext,
                  ctx,
                  userControllers,
                  middlewareResponse
                );

              if (type === "Debug")
                await debugController(
                  ecoContext,
                  lastControllerID
                    ? controllerResponse[lastControllerID]
                    : ecoContext.payload,
                  userControllers
                );

              if (type === "EventEmitter")
                await eventEmitterController(ecoContext, userControllers);

              lastControllerID = id;
            }
            resolve();
          })
      );

    await Promise.all(concurrentMiddlewares);

    if (!_.isEmpty(middlewareResponse) && !_.isArray(ctx))
      ctx.body = middlewareResponse;
  };
};

export default buildController;
