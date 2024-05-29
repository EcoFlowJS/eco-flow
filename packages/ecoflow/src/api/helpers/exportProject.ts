import path from "path";
import AdmZip from "adm-zip";
import generateBackupZip from "./generateBackupZip";
import { Builder } from "@ecoflow/utils";
import { format } from "date-and-time";

const exportProject = async (): Promise<Buffer> => {
  const { _, service, config } = ecoFlow;
  const { AuditLogsService, FlowSettingsService, RoleService, UserService } =
    service;
  const allBackups = await generateBackupZip(true, true, true, true, true);
  const zip = new AdmZip(allBackups);

  const auditLogs = (await AuditLogsService.fetchAuditLogs(true)).logs.map(
    (log) => ({
      ...log,
      timeSpan: new Date(
        _.isUndefined(log.timeSpan) ? "" : log.timeSpan
      ).toISOString(),
    })
  );

  const flowSettings = await FlowSettingsService.fetchAllFlowSettings();
  const userRoles = await RoleService.getAllRoles();
  const users = (await UserService.getUserInfos()).user?.map((val) => ({
    ...val,
    created_at: _.isUndefined(val.created_at) ? "" : val.created_at,
    updated_at: _.isUndefined(val.updated_at) ? "" : val.updated_at,
  }));

  const systemDB = JSON.stringify(
    {
      auditLogs,
      flowSettings,
      userRoles,
      users,
    },
    null,
    2
  );

  const systemEnvs = JSON.stringify(await Builder.ENV.getSystemEnv(), null, 2);

  zip.addFile("systemDB.json", Buffer.from(systemDB, "utf8"));
  zip.addFile("systemEnvs.json", Buffer.from(systemEnvs, "utf8"));
  zip.writeZip(
    path.join(
      config.get("userDir"),
      "exports",
      `export_${format(new Date(), "DD-MM-YYYY")}_${format(
        new Date(),
        "HH-mm-ss"
      )}.zip`
    )
  );

  return zip.toBuffer();
};

export default exportProject;
