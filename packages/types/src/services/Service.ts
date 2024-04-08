import { FlowSettingsService } from "./FlowSettings/FlowSettingsService";
import { SchemaEditorService } from "./SchemaEditor/SchemaEditorService";
import { AuditLogsService } from "./auditLogs/AuditLogsService";
import { RoleService } from "./role/RoleService";
import { TokenServices } from "./token/tokenServices";
import { UserService } from "./user/UserService";

export interface Service {
  get UserService(): UserService;
  get TokenServices(): TokenServices;
  get SchemaEditorService(): SchemaEditorService;
  get RoleService(): RoleService;
  get AuditLogsService(): AuditLogsService;
  get flowSettingsService(): FlowSettingsService;
}

export {
  UserService,
  TokenServices,
  SchemaEditorService,
  RoleService,
  FlowSettingsService,
};
export * from "./auditLogs/AuditLogsService";
