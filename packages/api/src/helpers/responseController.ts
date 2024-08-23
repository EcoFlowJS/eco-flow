import {
  EcoContext,
  ResponseController,
  UserControllers,
} from "@ecoflow/types";
import { Context } from "koa";

/**
 * Handles the response for a given request by updating the middleware response object
 * and the context object.
 * @param {EcoContext} ecoContext - The Eco context object containing request information.
 * @param {Context} koaContext - The Koa context object for the request.
 * @param {() => Promise<UserControllers>} userControllers - A function that returns a promise of UserControllers.
 * @param {Object} middlewareResponse - An object containing middleware response data.
 * @returns {Promise<void>} A promise that resolves when the response handling is complete.
 */
const responseController = async (
  ecoContext: EcoContext,
  koaContext: Context,
  userControllers: (ctx: EcoContext) => Promise<UserControllers>,
  middlewareResponse: { [key: string]: any }
): Promise<void> => {
  const [id, response]: ResponseController = await new Promise(
    (resolve, reject) =>
      Promise.resolve(
        userControllers.call(
          ecoContext,
          ecoContext
        ) as Promise<ResponseController>
      ).then(resolve, reject)
  );

  middlewareResponse[id] = response;
  const updatedContext: Context = { ...ecoContext };
  delete updatedContext.payload;
  delete updatedContext.inputs;
  delete updatedContext.next;
  Object.keys(updatedContext)
    .filter((key) => key !== "body")
    .map((key) => {
      koaContext[key] = updatedContext[key];
    });
};

export default responseController;
