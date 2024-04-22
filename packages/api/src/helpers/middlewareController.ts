import { EcoContext, UserControllers } from "@ecoflow/types";

const middlewareController = async (
  id: string,
  ecoContext: EcoContext,
  userControllers: () => Promise<UserControllers>,
  controllerResponse: { [key: string]: any }
) => {
  await new Promise((resolve, reject) => {
    const userController = userControllers.call(ecoContext);
    if (userController instanceof Promise) userController.then(resolve, reject);
    resolve(userController);
  });

  controllerResponse[id] = ecoContext.payload || {};
};

export default middlewareController;
