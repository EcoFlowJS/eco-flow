import {
  Database,
  DatabaseConnection,
  RoleService as IRoleService,
  Permissions,
  Role,
  userTableCollection,
} from "@ecoflow/types";
import { RoleModelKnex, RoleModelMongoose } from "./model/RoleModel";
import { Types } from "mongoose";

export class RoleService implements IRoleService {
  private dataBase: Database;
  private connection: DatabaseConnection;

  constructor(conn?: DatabaseConnection) {
    this.dataBase = ecoFlow.database;
    this.connection = conn || this.dataBase.getDatabaseConnection("_sysDB");
  }

  async getAllRoles(): Promise<Role[]> {
    const { _ } = ecoFlow;
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

    if (this.dataBase.isMongoose(this.connection)) {
      return await RoleModelMongoose(this.connection).find();
    }

    throw "Invalid database connection specified";
  }

  async fetchRole(id?: string): Promise<Role[]> {
    const { _ } = ecoFlow;
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

    if (this.dataBase.isMongoose(this.connection)) {
      return await RoleModelMongoose(this.connection).find(
        id ? { _id: new Types.ObjectId(id) } : {}
      );
    }

    throw "Invalid database connection specified";
  }

  async migrateRole(role: Role): Promise<string> {
    if (this.dataBase.isKnex(this.connection)) {
      await (await RoleModelKnex(this.connection))().insert(role);

      const id = await (await RoleModelKnex(this.connection))()
        .select("_id")
        .limit(1)
        .orderBy("_id", "desc");
      return id[0]._id;
    }

    if (this.dataBase.isMongoose(this.connection)) {
      const newRole = await RoleModelMongoose(this.connection).create(role);
      return newRole._id;
    }

    throw "Invalid database connection specified";
  }

  async createRole(
    role: Role,
    roleLike?: string | null,
    isDefault: boolean = false
  ): Promise<Role[] | { _id: any }> {
    const { _, server } = ecoFlow;
    if (_.isEmpty(role.name)) throw "Role name is empty";
    if (_.isEmpty(role.permissions)) role.permissions = {};

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

  async updateRole(id: string, permissions: Permissions): Promise<Role[]> {
    const { _, server } = ecoFlow;
    if (_.isUndefined(id)) throw "Role id not defined";
    if (_.isUndefined(permissions)) permissions = {};

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

  async removeRole(id: string): Promise<Role[]> {
    const { _, service, server } = ecoFlow;
    if (_.isUndefined(id)) throw "Role id not defined";

    for await (const user of (await service.UserService.getUserInfos()).user!) {
      const permissions = user.roles!.filter(
        (role: string) => role.toString() !== id.toString()
      );
      await service.UserService.upddateUser(user.username!, {
        roles: permissions,
      });
    }

    server.socket.emit("roleUpdated");

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
