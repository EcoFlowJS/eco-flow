import {
  Service as IService,
  UserService as IUserService,
  TokenServices as ITokenServices,
  SchemaEditorService as ISchemaEditorService,
  RoleService as IRoleService,
  AuditLogsService as IAuditLogsService,
  FlowSettingsService as IFlowSettingsService,
  DatabaseConnection,
} from "@ecoflow/types";
import { UserService } from "../user";
import { TokenServices } from "../token";
import { SchemaEditorService } from "../SchemaEditor/SchemaEditorService";
import { RoleService } from "../Role";
import { AuditLogsService } from "../AuditLogs";
import { FlowSettingsService } from "../FlowSettings";

export class Service implements IService {
  private connection: DatabaseConnection | undefined = undefined;

  constructor(name?: string) {
    if (name) {
      const { database } = ecoFlow;
      this.connection = database.getDatabaseConnection(name);
    }
  }

  get UserService(): IUserService {
    return new UserService(this.connection);
  }

  get TokenServices(): ITokenServices {
    return new TokenServices(this.connection);
  }

  get SchemaEditorService(): ISchemaEditorService {
    return SchemaEditorService;
  }

  get RoleService(): IRoleService {
    return new RoleService(this.connection);
  }

  get AuditLogsService(): IAuditLogsService {
    return new AuditLogsService(this.connection);
  }

  get FlowSettingsService(): IFlowSettingsService {
    return new FlowSettingsService(this.connection);
  }
}
