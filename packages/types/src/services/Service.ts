import { UserService } from "./user/UserService";

export interface Service {
  get UserService(): UserService;
}
