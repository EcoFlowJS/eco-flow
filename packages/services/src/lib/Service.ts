import {
  Service as IService,
  UserService as IUserService,
  TokenServices as ITokenServices,
  SchemaEditorService as ISchemaEditorService,
  RoleService as IRoleService,
  AuditLogsService as IAuditLogsService,
  FlowSettingsService as IFlowSettingsService,
} from "@ecoflow/types";
import { UserService } from "../user";
import { TokenServices } from "../token";
import { SchemaEditorService } from "../SchemaEditor/SchemaEditorService";
import { RoleService } from "../Role";
import { AuditLogsService } from "../AuditLogs";
import { FlowSettingsService } from "../FlowSettings";

export class Service implements IService {
  get UserService(): IUserService {
    return new UserService();
  }

  get TokenServices(): ITokenServices {
    return new TokenServices();
  }

  get SchemaEditorService(): ISchemaEditorService {
    return SchemaEditorService;
  }

  get RoleService(): IRoleService {
    return new RoleService();
  }

  get AuditLogsService(): IAuditLogsService {
    return new AuditLogsService();
  }

  get flowSettingsService(): IFlowSettingsService {
    return new FlowSettingsService();
  }
}
