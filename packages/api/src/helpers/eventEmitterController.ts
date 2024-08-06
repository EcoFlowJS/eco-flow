import { EcoContext, EcoEvent, UserControllers } from "@ecoflow/types";

const eventEmitterController = async (
  ecoContext: EcoEvent,
  userControllers: (ctx: EcoEvent) => Promise<UserControllers>
): Promise<void> => {
  await new Promise((resolve, reject) =>
    userControllers.call(ecoContext, ecoContext).then(resolve, reject)
  );
};

export default eventEmitterController;
