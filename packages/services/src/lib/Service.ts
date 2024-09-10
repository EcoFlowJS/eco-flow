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
import { UserService } from "../user/index.js";
import { TokenServices } from "../token/index.js";
import { SchemaEditorService } from "../SchemaEditor/SchemaEditorService.js";
import { RoleService } from "../Role/index.js";
import { AuditLogsService } from "../AuditLogs/index.js";
import { FlowSettingsService } from "../FlowSettings/index.js";

/**
 * Represents a service class that provides access to various services related to the application.
 * @implements {Service}
 */
export class Service implements IService {
  private connection: DatabaseConnection | undefined = undefined;

  /**
   * Constructs a new instance of the class with an optional name parameter.
   * If a name is provided, it initializes a connection to the database using the
   * provided name.
   * @param {string} [name] - The name to use for the database connection.
   * @returns None
   */
  constructor(name?: string) {
    if (name) {
      const { database } = ecoFlow;
      this.connection = database.getDatabaseConnection(name);
    }
  }

  /**
   * Getter method that returns an instance of the UserService class.
   * @returns {IUserService} An instance of the UserService class.
   */
  get UserService(): IUserService {
    return new UserService(this.connection);
  }

  /**
   * Returns an instance of TokenServices with the provided connection.
   * @returns {ITokenServices} An instance of TokenServices
   */
  get TokenServices(): ITokenServices {
    return new TokenServices(this.connection);
  }

  /**
   * Getter method for the SchemaEditorService instance.
   * @returns {SchemaEditorService} The SchemaEditorService instance.
   */
  get SchemaEditorService(): ISchemaEditorService {
    return SchemaEditorService;
  }

  /**
   * Getter method that returns an instance of RoleService with the current connection.
   * @returns {RoleService} An instance of RoleService with the current connection.
   */
  get RoleService(): IRoleService {
    return new RoleService(this.connection);
  }

  /**
   * Returns an instance of the AuditLogsService using the provided connection.
   * @returns {AuditLogsService} An instance of the AuditLogsService.
   */
  get AuditLogsService(): IAuditLogsService {
    return new AuditLogsService(this.connection);
  }

  /**
   * Returns an instance of the FlowSettingsService using the provided connection.
   * @returns {FlowSettingsService} An instance of the FlowSettingsService
   */
  get FlowSettingsService(): IFlowSettingsService {
    return new FlowSettingsService(this.connection);
  }
}
