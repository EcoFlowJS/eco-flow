import { EnvBuilder } from "../builders/env/env.builder";
import { JsonBuilder } from "../builders/json/json.builder";

export class Builder {
  static get JSON(): typeof JsonBuilder {
    return JsonBuilder;
  }

  static get ENV(): typeof EnvBuilder {
    return EnvBuilder;
  }
}
