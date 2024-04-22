import {
  EcoContext,
  ResponseController,
  UserControllers,
} from "@ecoflow/types";
import { Context } from "koa";

const responseController = async (
  ecoContext: EcoContext,
  koaContext: Context,
  userControllers: () => Promise<UserControllers>,
  middlewareResponse: { [key: string]: any }
): Promise<void> => {
  const [id, response]: ResponseController = await new Promise(
    (resolve, reject) => {
      const userController = userControllers.call(
        ecoContext
      ) as Promise<ResponseController>;
      if (userController instanceof Promise)
        userController.then(resolve, reject);
      resolve(userController);
    }
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
