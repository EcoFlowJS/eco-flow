import {
  Database,
  DatabaseConnection,
  RoleService as IRoleService,
  Permissions,
  Role,
  userTableCollection,
} from "@eco-flow/types";
import { RoleModelKnex, RoleModelMongoose } from "./model/RoleModel";
import { Types } from "mongoose";

export class RoleService implements IRoleService {
  private dataBase: Database;
  private connection: DatabaseConnection;

  constructor() {
    this.dataBase = ecoFlow.database;
    this.connection = this.dataBase.getDatabaseConnection("_sysDB");
  }

  async getAllRoles(): Promise<Role[]> {
    if (this.dataBase.isKnex(this.connection)) {
      return (<Role[]>(
        await (await RoleModelKnex(this.connection))().select()
      )).map((role) => {
        role.permissions = JSON.parse(role.permissions as string);
        return role;
      });
    }

    if (this.dataBase.isMongoose(this.connection)) {
      return await RoleModelMongoose(this.connection).find();
    }

    throw "Invalid database connection specified";
  }

  async fetchRole(id?: string): Promise<Role[]> {
    if (this.dataBase.isKnex(this.connection)) {
      const query = (await RoleModelKnex(this.connection))().select();
      if (id) query.where({ _id: id });

      return (<Role[]>await query).map((role) => {
        role.permissions = JSON.parse(role.permissions as string);
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

  async createRole(
    role: Role,
    roleLike?: string | null,
    isDefault: boolean = false
  ): Promise<Role[] | { _id: any }> {
    const { _ } = ecoFlow;
    if (_.isEmpty(role.name)) throw "Role name is empty";
    if (_.isEmpty(role.permissions)) role.permissions = {};

    if (this.dataBase.isKnex(this.connection)) {
      try {
        if (_.isUndefined(roleLike) || roleLike === null)
          role.permissions = JSON.stringify(role.permissions);
        else {
          role.permissions = (
            await (await RoleModelKnex(this.connection))()
              .select("permissions")
              .where({ _id: roleLike })
          )[0].permissions;
        }
        const id = await (
          await RoleModelKnex(this.connection)
        )().insert(role, ["_id"]);

        if (isDefault) return id[0];

        return (<Role[]>(
          await (await RoleModelKnex(this.connection))().select()
        )).map((role) => {
          role.permissions = JSON.parse(role.permissions as string);
          return role;
        });
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
        await RoleModelMongoose(this.connection).create(role);
        return await RoleModelMongoose(this.connection).find();
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

        server.socket.to(["roles"]).emit("roleUpdated");

        return (<Role[]>(
          await (await RoleModelKnex(this.connection))().select()
        )).map((role) => {
          role.permissions = JSON.parse(role.permissions as string);
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

        server.socket.to(["roles"]).emit("roleUpdated");

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

    for await (const user of <userTableCollection[]>(
      (await service.UserService.getUserAllInfo()).user
    )) {
      const permissions = user.roles.filter(
        (role: string) => role.toString() !== id.toString()
      );
      await service.UserService.upddateUser(user.username!, {
        roles: permissions,
      });
    }

    server.socket.to(["roles"]).emit("roleUpdated");

    if (this.dataBase.isKnex(this.connection)) {
      try {
        await (await RoleModelKnex(this.connection))()
          .delete()
          .where({ _id: id });

        return (<Role[]>(
          await (await RoleModelKnex(this.connection))().select()
        )).map((role) => {
          role.permissions = JSON.parse(role.permissions as string);
          return role;
        });
      } catch (e: any) {
        throw e.toString();
      }
    }

    if (this.dataBase.isMongoose(this.connection)) {
      try {
        await RoleModelMongoose(this.connection).deleteOne({
          _id: new Types.ObjectId(id),
        });
        return await RoleModelMongoose(this.connection).find();
      } catch (e: any) {
        throw e.toString();
      }
    }

    throw "Invalid database connection specified";
  }
}
