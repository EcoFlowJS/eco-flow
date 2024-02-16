import { ApiResponse } from "../../ecoflow";

export interface UserService {
  isNoUser(): Promise<boolean>;
  createUser(
    userInfo: userTableCollection,
    isAdmin?: boolean
  ): Promise<ApiResponse>;
}

export interface userTableCollection {
  _id?: string;
  name: string;
  username: string;
  password: string;
  email?: string;
  oldPassword?: string;
  isPermanent?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
