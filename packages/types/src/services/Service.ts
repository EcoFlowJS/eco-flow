import { ClassType } from "../ecoflow";
import { SchemaEditorService } from "./SchemaEditor/SchemaEditorService";
import { RoleService } from "./role/RoleService";
import { TokenServices } from "./token/tokenServices";
import { UserService } from "./user/UserService";

export interface Service {
  get UserService(): UserService;
  get TokenServices(): TokenServices;
  get SchemaEditorService(): SchemaEditorService;
  get RoleService(): RoleService;
}
