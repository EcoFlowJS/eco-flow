import {
  Database,
  DatabaseConnection,
  RoleService as IRoleService,
  Permissions,
  Role,
} from "@ecoflow/types";
import { RoleModelKnex, RoleModelMongoose } from "./model/RoleModel";
import { Types } from "mongoose";

/**
 * RoleService class that implements RoleService interface.
 * This class provides methods for interacting with roles in the database.
 */
export class RoleService implements IRoleService {
  private dataBase: Database;
  private connection: DatabaseConnection;

  /**
   * Constructs a new instance of the class.
   * @param {DatabaseConnection} [conn] - Optional parameter for the database connection.
   * @returns None
   */
  constructor(conn?: DatabaseConnection) {
    this.dataBase = ecoFlow.database;
    this.connection = conn || this.dataBase.getDatabaseConnection("_sysDB");
  }

  /**
   * Retrieves all roles from the database based on the type of database connection.
   * @returns {Promise<Role[]>} A promise that resolves to an array of Role objects.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async getAllRoles(): Promise<Role[]> {
    const { _ } = ecoFlow;
    /**
     * Checks if the connection is a Knex connection and returns all roles using Knex model.
     * @param {any} connection - The database connection to check.
     * @returns {Promise<Role[]>} A promise that resolves to an array of Role objects.
     */
    if (this.dataBase.isKnex(this.connection)) {
      return (<Role[]>(
        await (await RoleModelKnex(this.connection))().select()
      )).map((role) => {
        role.permissions = _.isObject(role.permissions)
          ? role.permissions
          : JSON.parse(role.permissions as string);
        return role;
      });
    }

    /**
     * Checks if the connection is a Mongoose connection and returns all roles using Mongoose model.
     * @param {any} connection - The database connection to check.
     * @returns {Promise<Role[]>} A promise that resolves to an array of Role objects.
     */
    if (this.dataBase.isMongoose(this.connection)) {
      return await RoleModelMongoose(this.connection).find();
    }

    throw "Invalid database connection specified";
  }

  /**
   * Fetches role data based on the provided ID using either Knex or Mongoose ORM.
   * @param {string} [id] - The ID of the role to fetch.
   * @returns {Promise<Role[]>} A promise that resolves to an array of Role objects.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async fetchRole(id: string): Promise<Role[]> {
    const { _ } = ecoFlow;
    /**
     * Retrieves roles from the database using Knex if the connection is a Knex connection.
     * @param {any} connection - The database connection object.
     * @param {string} id - The id of the role to retrieve.
     * @returns {Role[]} An array of Role objects with updated permissions.
     */
    if (this.dataBase.isKnex(this.connection)) {
      const query = (await RoleModelKnex(this.connection))().select();
      if (id) query.where({ _id: id });

      return (<Role[]>await query).map((role) => {
        role.permissions = _.isObject(role.permissions)
          ? role.permissions
          : JSON.parse(role.permissions as string);
        return role;
      });
    }

    /**
     * Checks if the connection is using Mongoose and returns the result of finding a role
     * based on the provided id.
     * @param {string} id - The id of the role to find.
     * @returns {Promise<Role>} A promise that resolves to the found role.
     */
    if (this.dataBase.isMongoose(this.connection)) {
      return await RoleModelMongoose(this.connection).find(
        id ? { _id: new Types.ObjectId(id) } : {}
      );
    }

    throw "Invalid database connection specified";
  }

  /**
   * Migrates a role object to the database based on the type of database connection.
   * @param {Role} role - The role object to be migrated.
   * @returns {Promise<string>} The ID of the migrated role.
   * @throws {string} If an invalid database connection is specified.
   */
  async migrateRole(role: Role): Promise<string> {
    /**
     * Checks if the connection is using Knex, then inserts a new role into the database using RoleModelKnex.
     * Retrieves the id of the inserted role.
     * @param {any} connection - The database connection object.
     * @param {any} role - The role object to insert into the database.
     * @returns {string} The id of the inserted role.
     */
    if (this.dataBase.isKnex(this.connection)) {
      await (await RoleModelKnex(this.connection))().insert(role);

      const id = await (await RoleModelKnex(this.connection))()
        .select("_id")
        .limit(1)
        .orderBy("_id", "desc");
      return id[0]._id;
    }

    /**
     * If the connection is using Mongoose, creates a new role using the RoleModelMongoose
     * and returns the id of the newly created role.
     * @param {any} connection - The connection object to the database.
     * @param {object} role - The role object to create.
     * @returns {string} The id of the newly created role.
     */
    if (this.dataBase.isMongoose(this.connection)) {
      const newRole = await RoleModelMongoose(this.connection).create(role);
      return newRole._id;
    }

    throw "Invalid database connection specified";
  }

  /**
   * Creates a new role with the given parameters and stores it in the database.
   * @param {Role} role - The role object to create.
   * @param {string | null} [roleLike] - A string representing a similar role to base permissions on.
   * @param {boolean} [isDefault=false] - A boolean indicating if the role is a default role.
   * @returns {Promise<Role[] | { _id: any }>} - A promise that resolves to an array of roles or an object with the _id of the new role.
   * @throws {string} - Throws an error if role name is empty or if an invalid database connection is specified.
   */
  async createRole(
    role: Role,
    roleLike?: string | null,
    isDefault: boolean = false
  ): Promise<Role[] | { _id: any }> {
    const { _, server } = ecoFlow;
    if (_.isEmpty(role.name)) throw "Role name is empty";
    if (_.isEmpty(role.permissions)) role.permissions = {};

    /**
     * If the database is using Knex, this method creates a new role with the given permissions.
     * @param {any} roleLike - The role to base the permissions on.
     * @param {boolean} isDefault - Flag to indicate if the role is a default role.
     * @returns {Role[]} - An array of roles with updated permissions.
     * @throws {string} - Throws an error if there is an issue with the database operation.
     */
    if (this.dataBase.isKnex(this.connection)) {
      try {
        if (!_.isUndefined(roleLike) && roleLike !== null) {
          role.permissions = (
            await (await RoleModelKnex(this.connection))()
              .select("permissions")
              .where({ _id: roleLike })
          )[0].permissions;
        } else role.permissions = JSON.stringify(role.permissions);

        await (await RoleModelKnex(this.connection))().insert(role);
        const id = await (await RoleModelKnex(this.connection))()
          .select("_id")
          .limit(1)
          .orderBy("_id", "desc");

        if (isDefault) return id[0];

        const roles = (<Role[]>(
          await (await RoleModelKnex(this.connection))().select()
        )).map((role) => {
          role.permissions = _.isString(role.permissions)
            ? JSON.parse(role.permissions)
            : role.permissions;
          return role;
        });
        server.socket.emit("roleCreated", roles);

        return roles;
      } catch (e: any) {
        throw e.toString();
      }
    }

    /**
     * Creates a new role in the database using Mongoose if the connection is a Mongoose connection.
     * @param {any} role - The role object to be created.
     * @param {string} roleLike - The role ID to base the new role's permissions on.
     * @param {boolean} isDefault - Flag indicating if the new role is a default role.
     * @returns The newly created role or an array of all roles in the database.
     * @throws Throws an error if there is an issue creating the role.
     */
    if (this.dataBase.isMongoose(this.connection)) {
      try {
        if (!_.isUndefined(roleLike) && roleLike !== null) {
          role.permissions = (
            await RoleModelMongoose(this.connection).find({
              _id: new Types.ObjectId(roleLike),
            })
          )[0].permissions;
        }

        const newRole = await RoleModelMongoose(this.connection).create(role);
        if (isDefault) return newRole;

        const roles = await RoleModelMongoose(this.connection).find({});
        server.socket.emit("roleCreated", roles);
        return roles;
      } catch (e: any) {
        throw e.toString();
      }
    }

    throw "Invalid database connection specified";
  }

  /**
   * Updates the permissions of a role with the given id.
   * @param {string} id - The id of the role to update.
   * @param {Permissions} permissions - The new permissions to assign to the role.
   * @returns {Promise<Role[]>} - A promise that resolves to an array of updated roles.
   * @throws {string} - Throws an error if role id or permissions are not defined.
   */
  async updateRole(id: string, permissions: Permissions): Promise<Role[]> {
    const { _, server } = ecoFlow;
    if (_.isUndefined(id)) throw "Role id not defined";
    if (_.isUndefined(permissions)) permissions = {};

    /**
     * Updates the permissions of a role in the database using Knex if the connection is Knex.
     * Emits a "roleUpdated" event to the server socket upon successful update.
     * @param {any} id - The ID of the role to update.
     * @param {any} permissions - The permissions to update for the role.
     * @returns {Role[]} An array of roles with updated permissions.
     * @throws {string} Throws an error message if an error occurs during the update process.
     */
    if (this.dataBase.isKnex(this.connection)) {
      try {
        await (
          await RoleModelKnex(this.connection)
        )()
          .update({ permissions: JSON.stringify(permissions) })
          .where({ _id: id });

        server.socket.emit("roleUpdated");

        return (<Role[]>(
          await (await RoleModelKnex(this.connection))().select()
        )).map((role) => {
          role.permissions = _.isObject(role.permissions)
            ? role.permissions
            : JSON.parse(role.permissions as string);
          return role;
        });
      } catch (e: any) {
        throw e.toString();
      }
    }

    /**
     * Updates the permissions of a role in the database using Mongoose.
     * If the operation is successful, emits a "roleUpdated" event to the server socket.
     * @param {string} id - The ID of the role to update.
     * @param {object} permissions - The new permissions object to set for the role.
     * @returns {Promise<Array>} - A promise that resolves to an array of RoleModelMongoose objects.
     * @throws {string} - Throws an error message if an error occurs during the update process.
     */
    if (this.dataBase.isMongoose(this.connection)) {
      try {
        await RoleModelMongoose(this.connection).updateOne(
          { _id: new Types.ObjectId(id) },
          { $set: { permissions } }
        );

        server.socket.emit("roleUpdated");

        return await RoleModelMongoose(this.connection).find();
      } catch (e: any) {
        throw e.toString();
      }
    }

    throw "Invalid database connection specified";
  }

  /**
   * Asynchronously removes a role from the database and updates all users with the role removed.
   * @param {string} id - The id of the role to be removed.
   * @returns {Promise<Role[]>} A promise that resolves to an array of Role objects after the role is removed.
   * @throws {string} Throws an error if the role id is not defined or if there is an issue with the database connection.
   */
  async removeRole(id: string): Promise<Role[]> {
    const { _, service, server } = ecoFlow;

    /**
     * Throws an error if the role id is undefined.
     * @param {any} id - The role id to check for undefined.
     * @throws {string} Throws an error message if the role id is undefined.
     */
    if (_.isUndefined(id)) throw "Role id not defined";

    /**
     * Iterates over each user returned from the UserService.getUserInfos() call and updates their roles
     * by filtering out the role with the specified id and updating the user's roles.
     * @returns None
     */
    for await (const user of (await service.UserService.getUserInfos()).user!) {
      const permissions = user.roles!.filter(
        (role: string) => role.toString() !== id.toString()
      );
      await service.UserService.upddateUser(user.username!, {
        roles: permissions,
      });
    }

    /**
     * Emit a "roleUpdated" event through the server socket.
     */
    server.socket.emit("roleUpdated");

    /**
     * Deletes a role from the database using Knex if the connection is Knex.
     * @param {string} id - The id of the role to be deleted.
     * @returns {Role[]} - An array of roles after the deletion.
     * @throws {string} - Throws an error message if an error occurs during the deletion process.
     */
    if (this.dataBase.isKnex(this.connection)) {
      try {
        await (await RoleModelKnex(this.connection))()
          .delete()
          .where({ _id: id });

        const roles = (<Role[]>(
          await (await RoleModelKnex(this.connection))().select()
        )).map((role) => {
          role.permissions = _.isObject(role.permissions)
            ? role.permissions
            : JSON.parse(role.permissions as string);
          return role;
        });
        server.socket.emit("roleRemoved", roles);
        return roles;
      } catch (e: any) {
        throw e.toString();
      }
    }

    /**
     * Deletes a role from the database using Mongoose if the connection is a Mongoose connection.
     * @param {string} id - The ID of the role to delete.
     * @returns {Promise<Array>} - A promise that resolves to an array of roles after deletion.
     * @throws {string} - Throws an error message if an error occurs during the deletion process.
     */
    if (this.dataBase.isMongoose(this.connection)) {
      try {
        await RoleModelMongoose(this.connection).deleteOne({
          _id: new Types.ObjectId(id),
        });

        const roles = await RoleModelMongoose(this.connection).find();
        server.socket.emit("roleRemoved", roles);
        return roles;
      } catch (e: any) {
        throw e.toString();
      }
    }

    throw "Invalid database connection specified";
  }
}
