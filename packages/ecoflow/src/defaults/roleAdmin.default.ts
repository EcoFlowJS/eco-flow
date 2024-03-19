import { UserPermissions } from "@eco-flow/types";

const roleAdmin: UserPermissions = {
  createUser: true,
  deleteUser: true,
  updateUser: true,
  showUser: true,
  createRole: true,
  deleteRole: true,
  updateRole: true,
  stopServer: true,
  restartServer: true,
  createEnvs: true,
  deleteEnvs: true,
  updateEnvs: true,
  adminEditor: true,
  schemaEditor: true,
  flowEditor: true,
  administrator: true,
};

export default roleAdmin;
