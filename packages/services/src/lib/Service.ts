import {
  Service as IService,
  UserService as IUserService,
  TokenServices as ITokenServices,
} from "@eco-flow/types";
import { UserService } from "../user";
import { TokenServices } from "../token";

export class Service implements IService {
  get UserService(): IUserService {
    return new UserService();
  }

  get TokenServices(): ITokenServices {
    return new TokenServices();
  }
}
