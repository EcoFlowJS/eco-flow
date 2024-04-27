import { EcoContext, UserControllers } from "@ecoflow/types";

const debugController = async (
  ecoContext: EcoContext,
  controllerResponse: any,
  userControllers: () => Promise<UserControllers>
) => {
  ecoContext.debugPayload = controllerResponse;
  await new Promise((resolve, reject) => {
    const userController = userControllers.call(ecoContext);
    if (userController instanceof Promise) userController.then(resolve, reject);
    resolve(userController);
  });

  delete ecoContext.debugPayload;
};

export default debugController;
