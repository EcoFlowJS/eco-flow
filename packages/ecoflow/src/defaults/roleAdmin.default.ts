import { UserPermissions } from "@ecoflow/types";

/**
 * Defines the permissions for a user with the role of Admin.
 * @type {UserPermissions}
 */
const roleAdmin: UserPermissions = {
  createUser: true,
  deleteUser: true,
  updateUser: true,
  showUser: true,
  createRole: true,
  deleteRole: true,
  updateRole: true,
  serverConfigurationShow: true,
  serverConfigurationUpdate: true,
  stopServer: true,
  restartServer: true,
  createEnvs: true,
  deleteEnvs: true,
  updateEnvs: true,
  backup: true,
  restore: true,
  schemaEditor: true,
  createDBConnection: true,
  modifyDBConnection: true,
  removeDBConnection: true,
  createCollectionTable: true,
  modifyCollectionTable: true,
  removeCollectionTable: true,
  modifyDBStructure: true,
  displayDBRecord: true,
  insertDBRecord: true,
  modifyDBRecord: true,
  removeDBRecord: true,
  flowEditor: true,
  auditLogs: true,
  administrator: true,
};

export default roleAdmin;
