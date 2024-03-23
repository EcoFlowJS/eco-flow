import { Knex } from "knex";
import { ApiResponse } from "../../ecoflow";

export interface UserService {
  isNoUser(): Promise<boolean>;
  createUser(
    userInfo: userTableCollection,
    isAdmin?: boolean
  ): Promise<ApiResponse>;
  getUserAllInfo(username?: string): Promise<GetUserInfo>;
  upddateUser(username: string, update: userTableCollection): Promise<UserInfo>;
}

interface AnyKeyBoolean {
  [key: string]: boolean;
}

export interface UserInfo {
  _id?: string;
  name?: string;
  username?: string;
  roles?: Array<any> | any;
  isActive?: boolean;
  email?: string;
  oldPassword?: string;
  isPermanent?: boolean;
  created_at?: Date;
  updated_at?: Date | Knex.Raw;
}

export interface GetUserInfo {
  isAvailable: boolean;
  user?: userTableCollection | userTableCollection[];
}

export interface userTableCollection extends UserInfo {
  password?: string;
}

export interface UserPermissions extends AnyKeyBoolean {
  createUser: boolean;
  deleteUser: boolean;
  updateUser: boolean;
  showUser: boolean;
  createRole: boolean;
  deleteRole: boolean;
  updateRole: boolean;
  serverConfigurationShow: boolean;
  serverConfigurationUpdate: boolean;
  stopServer: boolean;
  restartServer: boolean;
  createEnvs: boolean;
  deleteEnvs: boolean;
  updateEnvs: boolean;
  schemaEditor: boolean;
  flowEditor: boolean;
  auditLogs: boolean;
  administrator: boolean;
}
