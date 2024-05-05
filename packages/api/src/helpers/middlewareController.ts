import { EcoContext, UserControllers } from "@ecoflow/types";

/**
 * Middleware controller function that handles asynchronous operations for a given ID and EcoContext.
 * @param {string} id - The ID associated with the operation.
 * @param {EcoContext} ecoContext - The context object containing information for the operation.
 * @param {() => Promise<UserControllers>} userControllers - A function that returns a Promise of UserControllers.
 * @param {Object} controllerResponse - An object containing key-value pairs for controller responses.
 * @returns {Promise<void>} A Promise that resolves when the operation is complete.
 */
const middlewareController = async (
  id: string,
  ecoContext: EcoContext,
  userControllers: () => Promise<UserControllers>,
  controllerResponse: { [key: string]: any }
): Promise<void> => {
  await new Promise((resolve, reject) => {
    const userController = userControllers.call(ecoContext);
    if (userController instanceof Promise) userController.then(resolve, reject);
    resolve(userController);
  });

  controllerResponse[id] = ecoContext.payload || {};
};

export default middlewareController;
