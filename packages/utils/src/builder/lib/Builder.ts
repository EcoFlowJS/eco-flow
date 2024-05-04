import { EnvBuilder } from "../builders/env/env.builder";
import { JsonBuilder } from "../builders/json/json.builder";

/* The Builder class provides static methods to access different types of builders such
as JSON and ENV. */
export class Builder {
  /**
   * The static method "JSON" returns the JsonBuilder class in TypeScript.
   * @returns The static getter method `JSON` is being returned, which returns the `JsonBuilder` class.
   */
  static get JSON(): typeof JsonBuilder {
    return JsonBuilder;
  }

  /**
   * The static get ENV function returns the EnvBuilder class.
   * @returns The static property `ENV` is being returned, which is of type `EnvBuilder`.
   */
  static get ENV(): typeof EnvBuilder {
    return EnvBuilder;
  }
}
