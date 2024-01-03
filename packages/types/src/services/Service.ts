import { TokenServices } from "./token/tokenServices";
import { UserService } from "./user/UserService";

export interface Service {
  get UserService(): UserService;
  get TokenServices(): TokenServices;
}
