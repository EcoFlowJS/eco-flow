import {
  ApiResponse,
  InstalledPackagesDescription,
  RegitySearchResults,
} from "@ecoflow/types";
import { Context } from "koa";
import TPromise from "thread-promises";

const searchPackages = async (ctx: Context) => {
  const { _, ecoModule } = ecoFlow;
  const { packageName } = ctx.params;
  try {
    if (_.isUndefined(packageName) || _.isEmpty(packageName))
      throw "Package name is not provided.";

    const searchPromise = new TPromise<
      undefined[],
      RegitySearchResults | null,
      void
    >((resolve, reject) => {
      ecoModule.searchModule(packageName).then(resolve, reject);
    });

    const installedModules = new TPromise<
      undefined[],
      InstalledPackagesDescription[],
      void
    >(async (resolve, reject) => {
      const result: InstalledPackagesDescription[] = [];
      for await (const installedModule of await ecoModule.installedModules) {
        try {
          result.push(
            await ecoModule.getInstalledPackagesDescription(installedModule)
          );
        } catch (err) {
          reject(err);
        }
      }
      resolve(result);
    });

    const result = await Promise.all([searchPromise, installedModules]);

    ctx.body = <ApiResponse>{
      success: true,
      payload: result,
    };
  } catch (error) {
    ctx.status = 404;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default searchPackages;
