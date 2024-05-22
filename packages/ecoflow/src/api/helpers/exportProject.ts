import AdmZip from "adm-zip";
import generateBackupZip from "./generateBackupZip";
import { Builder } from "@ecoflow/utils";

const exportProject = async (): Promise<Buffer> => {
  const { _, service } = ecoFlow;
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

  return zip.toBuffer();
};

export default exportProject;
