import { ApiResponse } from "@ecoflow/types";
import { Context } from "koa";

const backupRestoreStatus = async (ctx: Context) => {
  const { _, database, ecoModule } = ecoFlow;
  const { packageInfo: isPackage, databaseNames: isDatabase } =
    ctx.request.query;

  try {
    const packageInfo: { label: string; value: string }[] = [];
    let databaseNames: { label: string; value: string }[] = [];
    if (!_.isUndefined(isPackage)) {
      for await (const packageName of await ecoModule.installedModules)
        packageInfo.push(
          (await ecoModule.getInstalledPackagesDescription(packageName))
            .isLocalPackage
            ? { label: `${packageName}(Local)`, value: packageName }
            : { label: packageName, value: packageName }
        );
    }

    if (!_.isUndefined(isDatabase))
      databaseNames = await database.connectionList
        .map((db) => db.connectionsName)
        .map((connectionName) => ({
          label: connectionName,
          value: connectionName,
        }));

    ctx.body = <ApiResponse>{
      success: true,
      payload: { packageInfo, databaseNames },
    };
  } catch (error) {
    ctx.status = 409;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default backupRestoreStatus;
