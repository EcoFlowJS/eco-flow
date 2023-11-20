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

  static stringify(value: object): string {
    return JSON.stringify(new JsonBuilder(value).stringifyHelper(), null, 2);
  }

  static parse(value: string): object {
    return new JsonBuilder(JSON.parse(value)).parseHelper();
  }
}
