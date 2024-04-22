import { API_METHODS } from "@ecoflow/types";
import { Context } from "koa";

const getDuplicateRoutes = (
  routes: [API_METHODS, string, (ctx: Context) => void][]
): { [key: string]: string } => {
  const duplicateRoutes = Object.create({});
  routes.forEach((route) => {
    if (duplicateRoutes[`${route[0]} ${route[1]}`]) {
      duplicateRoutes[`${route[0]} ${route[1]}`] += 1;
    } else {
      duplicateRoutes[`${route[0]} ${route[1]}`] = 1;
    }
  });

  Object.keys(duplicateRoutes).map((key) => {
    if (duplicateRoutes[key] === 1) delete duplicateRoutes[key];
  });

  return duplicateRoutes;
};

export default getDuplicateRoutes;
