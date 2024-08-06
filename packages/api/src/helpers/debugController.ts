import { EcoContext, EcoEvent, UserControllers } from "@ecoflow/types";

/**
 * Debug controller function that sets the debug payload in the EcoContext, calls the userControllers function,
 * and then deletes the debug payload.
 * @param {EcoContext} ecoContext - The EcoContext object containing the context information.
 * @param {any} controllerResponse - The response from the controller.
 * @param {() => Promise<UserControllers>} userControllers - A function that returns a Promise of UserControllers.
 * @returns {Promise<void>} A Promise that resolves when the userControllers function is called.
 */
const debugController = async (
  ecoContext: EcoContext | EcoEvent,
  controllerResponse: any,
  userControllers: (ctx: EcoContext | EcoEvent) => Promise<UserControllers>
): Promise<void> => {
  ecoContext.debugPayload = controllerResponse;
  await new Promise((resolve, reject) =>
    userControllers.call(ecoContext, ecoContext).then(resolve, reject)
  );

  delete ecoContext.debugPayload;
};

export default debugController;
