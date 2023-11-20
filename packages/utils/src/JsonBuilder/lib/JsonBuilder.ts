import { Helper } from "@eco-flow/helper";

export class JsonBuilder {
  private value: { [key: string | number]: any };

  constructor(value: { [key: string]: any }) {
    this.value = value;
  }

  stringifyHelper() {
    Object.keys(this.value).forEach((key) => {
      if (typeof this.value[key] === "object") {
        this.value[key] = new JsonBuilder(this.value[key]).stringifyHelper();
      } else this.value[key] = Helper.functionToString(this.value[key]);
    });

    return this.value;
  }

  parseHelper() {
    Object.keys(this.value).forEach((key) => {
      if (typeof this.value[key] === "object") {
        this.value[key] = new JsonBuilder(this.value[key]).parseHelper();
      } else this.value[key] = Helper.stringToFunction(this.value[key]);
    });
    return this.value;
  }

  static stringify(
    value: object,
    replacer?:
      | ((number | string)[] | null)
      | ((this: any, key: string, value: any) => any),
    space?: string | number
  ): string {
    if (typeof replacer === "function")
      return JSON.stringify(
        new JsonBuilder(value).stringifyHelper(),
        replacer,
        space
      );
    return JSON.stringify(
      new JsonBuilder(value).stringifyHelper(),
      replacer,
      space
    );
  }

  static parse(
    value: string,
    reviver?: (this: any, key: string, value: any) => any
  ): object {
    return new JsonBuilder(JSON.parse(value, reviver)).parseHelper();
  }
}
