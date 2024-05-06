export interface RoleService {
  /**
   * Retrieves all roles from the database based on the type of database connection.
   * @returns {Promise<Role[]>} A promise that resolves to an array of Role objects.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  getAllRoles(): Promise<Role[]>;

  /**
   * Migrates a role object to the database based on the type of database connection.
   * @param {Role} role - The role object to be migrated.
   * @returns {Promise<string>} The ID of the migrated role.
   * @throws {string} If an invalid database connection is specified.
   */
  migrateRole(role: Role): Promise<string>;

  /**
   * Creates a new role with the given parameters and stores it in the database.
   * @param {Role} role - The role object to create.
   * @param {string | null} [roleLike] - A string representing a similar role to base permissions on.
   * @param {boolean} [isDefault=false] - A boolean indicating if the role is a default role.
   * @returns {Promise<Role[] | { _id: any }>} - A promise that resolves to an array of roles or an object with the _id of the new role.
   * @throws {string} - Throws an error if role name is empty or if an invalid database connection is specified.
   */
  createRole(
    role: Role,
    roleLike?: string | null,
    isDefault?: boolean
  ): Promise<Role[] | { _id: any }>;

  /**
   * Fetches role data based on the provided ID using either Knex or Mongoose ORM.
   * @param {string} [id] - The ID of the role to fetch.
   * @returns {Promise<Role[]>} A promise that resolves to an array of Role objects.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  fetchRole(id: string): Promise<Role[]>;

  /**
   * Updates the permissions of a role with the given id.
   * @param {string} id - The id of the role to update.
   * @param {Permissions} permissions - The new permissions to assign to the role.
   * @returns {Promise<Role[]>} - A promise that resolves to an array of updated roles.
   * @throws {string} - Throws an error if role id or permissions are not defined.
   */
  updateRole(id: string, permissions: Permissions): Promise<Role[]>;

  /**
   * Asynchronously removes a role from the database and updates all users with the role removed.
   * @param {string} id - The id of the role to be removed.
   * @returns {Promise<Role[]>} A promise that resolves to an array of Role objects after the role is removed.
   * @throws {string} Throws an error if the role id is not defined or if there is an issue with the database connection.
   */
  removeRole(id: string): Promise<Role[]>;
}

/**
 * Represents a Role with optional properties.
 * @interface Role
 * @property {string} [_id] - The unique identifier of the role.
 * @property {string} name - The name of the role.
 * @property {boolean} [isDefault] - Indicates if the role is a default role.
 * @property {Permissions | string} [permissions] - The permissions associated with the role.
 */
export interface Role {
  _id?: string;
  name: string;
  isDefault?: boolean;
  permissions?: Permissions | string;
}

/**
 * Interface representing permissions with keys as strings and values as booleans.
 */
export interface Permissions {
  [name: string]: boolean;
}
