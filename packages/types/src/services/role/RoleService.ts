export interface RoleService {
  getAllRoles(): Promise<Role[]>;
  migrateRole(role: Role): Promise<string>;
  createRole(
    role: Role,
    roleLike?: string | null,
    isDefault?: boolean
  ): Promise<Role[] | { _id: any }>;
  fetchRole(id?: string): Promise<Role[]>;
  updateRole(id: string, permissions: Permissions): Promise<Role[]>;
  removeRole(id: string): Promise<Role[]>;
}

export interface Role {
  _id?: string;
  name: string;
  isDefault?: boolean;
  permissions?: Permissions | string;
}

export interface Permissions {
  [name: string]: boolean;
}
