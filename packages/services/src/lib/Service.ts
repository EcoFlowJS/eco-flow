import {
  Service as IService,
  UserService as IUserService,
  TokenServices as ITokenServices,
  SchemaEditorService as ISchemaEditorService,
} from "@eco-flow/types";
import { UserService } from "../user";
import { TokenServices } from "../token";
import { SchemaEditorService } from "../SchemaEditor/SchemaEditorService";

export class Service implements IService {
  get UserService(): IUserService {
    return new UserService();
  }

  get TokenServices(): ITokenServices {
    return new TokenServices();
  }

  get SchemaEditorService(): ISchemaEditorService {
    return SchemaEditorService;
  }
}
