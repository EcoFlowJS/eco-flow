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

export interface UserPermissions {
  createUser: boolean;
  deleteUser: boolean;
  updateUser: boolean;
  showUser: boolean;
  createRole: boolean;
  deleteRole: boolean;
  updateRole: boolean;
  stopServer: boolean;
  restartServer: boolean;
  createEnvs: boolean;
  deleteEnvs: boolean;
  updateEnvs: boolean;
  adminEditor: boolean;
  schemaEditor: boolean;
  flowEditor: boolean;
  administrator: boolean;
}
