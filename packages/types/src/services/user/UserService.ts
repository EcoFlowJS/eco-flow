import { Knex } from "knex";
import { ApiResponse } from "../../ecoflow";

export interface UserService {
  isNoUser(): Promise<boolean>;
  isUserExist(userId: string): Promise<boolean>;
  isActiveUser(userId: string): Promise<boolean>;
  migrateUsers(userInfo: userTableCollection): Promise<void>;
  createUser(
    userInfo: userTableCollection,
    isAdmin?: boolean
  ): Promise<ApiResponse>;
  getUsernames(): Promise<string[]>;
  getUsernames(isSystem?: boolean): Promise<string[]>;
  getUserInfos(): Promise<GetUserInfo>;
  getUserInfos(username?: string): Promise<GetUserInfoSingle>;
  getUserInfos(username?: string, isAll?: boolean): Promise<GetUserInfoSingle>;
  upddateUser(username: string, update: userTableCollection): Promise<UserInfo>;
  upddateUser(
    username: string,
    update: userTableCollection,
    isIgnoreActive?: boolean
  ): Promise<UserInfo>;
  updatePassword(
    username: string,
    oldPassword: string,
    password: string
  ): Promise<UserInfo>;
  updatePassword(
    username: string,
    oldPassword: string,
    password: string,
    ignoreCheck?: boolean
  ): Promise<UserInfo>;
}

interface AnyKeyBoolean {
  [key: string]: boolean;
}

export interface UserInfo {
  _id?: string;
  name?: string;
  username?: string;
  roles?: Array<any>;
  isActive?: boolean;
  email?: string;
  oldPassword?: string;
  isPermanent?: boolean;
  created_at?: Date;
  updated_at?: Date | Knex.Raw;
}

export interface GetUserInfo {
  isAvailable: boolean;
  user?: userTableCollection[];
}

export interface GetUserInfoSingle {
  isAvailable: boolean;
  user?: userTableCollection;
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
  backup: boolean;
  restore: boolean;
  schemaEditor: boolean;
  createDBConnection: boolean;
  modifyDBConnection: boolean;
  removeDBConnection: boolean;
  createCollectionTable: boolean;
  modifyCollectionTable: boolean;
  removeCollectionTable: boolean;
  modifyDBStructure: boolean;
  displayDBRecord: boolean;
  insertDBRecord: boolean;
  modifyDBRecord: boolean;
  removeDBRecord: boolean;
  flowEditor: boolean;
  auditLogs: boolean;
  administrator: boolean;
}

export interface UserInformations {
  name: string;
  username: string;
  email: string;
  isPermanent: boolean;
  createdAt: Date;
}
