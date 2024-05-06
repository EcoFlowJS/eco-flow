import { FlowSettingsService } from "./FlowSettings/FlowSettingsService";
import { SchemaEditorService } from "./SchemaEditor/SchemaEditorService";
import { AuditLogsService } from "./auditLogs/AuditLogsService";
import { RoleService } from "./role/RoleService";
import { TokenServices } from "./token/tokenServices";
import { UserService } from "./user/UserService";

/**
 * Interface representing a service that provides access to various services.
 */
export interface Service {
  /**
   * Getter method that returns an instance of the UserService class.
   * @returns {UserService} An instance of the UserService class.
   */
  get UserService(): UserService;

  /**
   * Returns an instance of TokenServices with the provided connection.
   * @returns {TokenServices} An instance of TokenServices
   */
  get TokenServices(): TokenServices;

  /**
   * Getter method for the SchemaEditorService instance.
   * @returns {SchemaEditorService} The SchemaEditorService instance.
   */
  get SchemaEditorService(): SchemaEditorService;

  /**
   * Getter method that returns an instance of RoleService with the current connection.
   * @returns {RoleService} An instance of RoleService with the current connection.
   */
  get RoleService(): RoleService;

  /**
   * Returns an instance of the AuditLogsService using the provided connection.
   * @returns {AuditLogsService} An instance of the AuditLogsService.
   */
  get AuditLogsService(): AuditLogsService;

  /**
   * Returns an instance of the FlowSettingsService using the provided connection.
   * @returns {FlowSettingsService} An instance of the FlowSettingsService
   */
  get FlowSettingsService(): FlowSettingsService;
}

export {
  UserService,
  TokenServices,
  SchemaEditorService,
  RoleService,
  FlowSettingsService,
};
export * from "./auditLogs/AuditLogsService";
