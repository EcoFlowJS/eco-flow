import { Helper } from "@eco-flow/helper";
import _ from "lodash";
import path from "path";
import fs from "fs";

export class JsonBuilder {
  private value: { [key: string | number]: any };

  constructor(value: { [key: string]: any }) {
    this.value = value;
  }

  private stringifyHelper(): any {
    Object.keys(this.value).forEach((key) => {
      if (typeof this.value[key] === "object") {
        this.value[key] = new JsonBuilder(this.value[key]).stringifyHelper();
      } else this.value[key] = Helper.functionToString(this.value[key]);
    });

    return this.value;
  }

  private parseHelper(): any {
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
  ): any {
    return new JsonBuilder(JSON.parse(value, reviver)).parseHelper();
  }

  static toFile(
    filePath: string,
    value: object,
    options: JsonToFileOptions = { recursive: false, mode: "none" },
    replacer?:
      | ((number | string)[] | null)
      | ((this: any, key: string, value: any) => any),
    space?: string | number
  ) {
    if (_.isEmpty(filePath)) return { error: "filePath must not be empty" };

    if (!_.isString(filePath)) return { error: "Invalid path" };

    const [basePath, extension] = [
      path.dirname(filePath),
      path.extname(filePath),
    ];

    const { mode, recursive } = options;

    if (!fs.existsSync(basePath))
      if (recursive !== false) fs.mkdirSync(basePath, { recursive: true });
      else return { error: "Directory does not exist" };

    let jsonFileName = path.basename(filePath);
    if (extension !== ".json") jsonFileName += ".json";

    const writePath = path.join(basePath, jsonFileName);
    try {
      if (!fs.existsSync(writePath)) {
        fs.writeFileSync(
          writePath,
          JsonBuilder.stringify(value, replacer, space),
          { encoding: "utf-8" }
        );
        return;
      }

      if (mode === "none" && fs.existsSync(writePath)) {
        return { error: "File already exists" };
      }

      if (mode === "append") {
        const jsonData = JsonBuilder.fromFile(writePath);
        fs.writeFileSync(
          writePath,
          JsonBuilder.stringify({ ...jsonData, ...value }, replacer, space),
          { encoding: "utf-8", flag: "w" }
        );
        return;
      }

      if (mode === "overwrite") {
        fs.writeFileSync(
          writePath,
          JsonBuilder.stringify(value, replacer, space),
          { encoding: "utf-8", flag: "w" }
        );
        return;
      }
    } catch (err) {
      return { error: err };
    }
  }

  static fromFile(
    filePath: string,
    reviver?: (this: any, key: string, value: any) => any
  ): any {
    if (_.isEmpty(filePath)) return { error: "File not found" };
    if (!_.isString(filePath)) return { error: "Invalid path" };
    if (path.extname(filePath) != ".json")
      return { error: "File is not a JSON file" };
    if (!fs.existsSync(filePath)) return { error: "File does not exist" };
    try {
      const jsonText = fs.readFileSync(filePath).toString();
      return JsonBuilder.parse(jsonText, reviver);
    } catch (error) {
      return { error: error };
    }
  }
}

interface JsonToFileOptions {
  recursive?: boolean;
  mode?: "overwrite" | "append" | "none";
}
