import {
  Service as IService,
  UserService as IUserService,
} from "@eco-flow/types";
import { UserService } from "../user";

export class Service implements IService {
  get UserService(): IUserService {
    return new UserService();
  }
}
