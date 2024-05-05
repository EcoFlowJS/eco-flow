import { EcoContext, UserControllers } from "@ecoflow/types";

/**
 * Debug controller function that sets the debug payload in the EcoContext, calls the userControllers function,
 * and then deletes the debug payload.
 * @param {EcoContext} ecoContext - The EcoContext object containing the context information.
 * @param {any} controllerResponse - The response from the controller.
 * @param {() => Promise<UserControllers>} userControllers - A function that returns a Promise of UserControllers.
 * @returns {Promise<void>} A Promise that resolves when the userControllers function is called.
 */
const debugController = async (
  ecoContext: EcoContext,
  controllerResponse: any,
  userControllers: () => Promise<UserControllers>
): Promise<void> => {
  ecoContext.debugPayload = controllerResponse;
  await new Promise((resolve, reject) => {
    const userController = userControllers.call(ecoContext);
    if (userController instanceof Promise) userController.then(resolve, reject);
    resolve(userController);
  });

  delete ecoContext.debugPayload;
};

export default debugController;
