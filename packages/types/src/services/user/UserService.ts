import { ApiResponse } from "../../ecoflow";

export interface UserService {
  isNoUser(): Promise<boolean>;
  createUser(
    userInfo: userTableCollection,
    isAdmin?: boolean
  ): Promise<ApiResponse>;
  getUserAllInfo(username: string): Promise<GetUserInfo>;
}

interface UserInfo {
  _id?: string;
  name: string;
  username: string;
  isActive: boolean;
  email?: string;
  oldPassword?: string;
  isPermanent?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetUserInfo {
  isAvailable: boolean;
  user?: userTableCollection;
}

export interface userTableCollection extends UserInfo {
  password: string;
}
