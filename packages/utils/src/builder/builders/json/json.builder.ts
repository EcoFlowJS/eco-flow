import _ from "lodash";
import path from "path";
import fs from "fs";
import functionToString from "./helpers/functionToString.helper";
import stringToFunction from "./helpers/stringToFunction.helper";

/* The `JsonBuilder` class in TypeScript provides methods for stringifying, parsing, and working with
JSON data, including writing JSON data to a file and reading JSON data from a file. */
export class JsonBuilder {
  private value: { [key: string | number]: any };

  /**
   * The constructor function takes an object as a parameter and assigns it to the value property of the
   * class.
   * @param value - The `value` parameter in the constructor is an object with keys of type string and
   * values of type any.
   */
  constructor(value: { [key: string]: any }) {
    this.value = value;
  }

  /**
   * The function `stringifyHelper` recursively converts an object to a string representation.
   * @returns The `stringifyHelper()` method is returning the modified `this.value` object after
   * processing its keys. If a key's value is an object, it is recursively calling `stringifyHelper()` on
   * that object. If the value is not an object, it is converting the value to a string using the
   * `functionToString()` function and updating the key's value in the object.
   */
  private stringifyHelper(): any {
    Object.keys(this.value).forEach((key) => {
      if (typeof this.value[key] === "object") {
        this.value[key] = new JsonBuilder(this.value[key]).stringifyHelper();
      } else this.value[key] = functionToString(this.value[key]);
    });

    return this.value;
  }

  /**
   * The function `parseHelper` recursively parses an object by converting any nested objects into
   * instances of `JsonBuilder` and converting other values into functions using `stringToFunction`.
   * @returns The `parseHelper()` method is returning `this.value` after parsing each key in the object.
   * If the value of a key is an object, it recursively calls `parseHelper()` on that object. If the
   * value of a key is not an object, it converts the value to a function using the `stringToFunction()`
   * function.
   */
  private parseHelper(): any {
    Object.keys(this.value).forEach((key) => {
      if (typeof this.value[key] === "object") {
        this.value[key] = new JsonBuilder(this.value[key]).parseHelper();
      } else this.value[key] = stringToFunction(this.value[key]);
    });
    return this.value;
  }

  /**
   * The `stringify` function takes an object, an optional replacer function, and an
   * optional space parameter, and returns a JSON string representation of the object.
   * @param {object} value - The `value` parameter in the `stringify` method is an object that you want
   * to convert to a JSON string.
   * @param {| ((number | string)[] | null)
   *       | ((this: any, key: string, value: any) => any)} [replacer] - The `replacer` parameter in the
   * `stringify` method can be either an array of strings and numbers, a function that transforms the
   * output, or `null`. If it is a function, it will be called for each key and value in the object being
   * stringified.
   * @param {string | number} [space] - The `space` parameter in the `stringify` method is used to
   * specify the indentation for the formatted JSON string. It can be either a string or a number. If it
   * is a number, it indicates the number of spaces to use for each level of indentation. If it is a
   * string,
   * @returns - The object string.
   */
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

  /**
   * The `parse` function in TypeScript parses a JSON string with an optional reviver function and
   * returns the parsed result using a `JsonBuilder` instance.
   * @param {string} value - The `value` parameter in the `parse` method is a string that represents the
   * JSON data that you want to parse into a JavaScript object.
   * @param [reviver] - The `reviver` parameter in the `parse` method is an optional function that can be
   * passed to the `JSON.parse` method. It allows you to transform the parsed JSON before it is returned.
   * The `reviver` function is called for each key-value pair in the parsed JSON and can
   * @returns - The Object after being parsed.
   */
  static parse(
    value: string,
    reviver?: (this: any, key: string, value: any) => any
  ): any {
    return new JsonBuilder(JSON.parse(value, reviver)).parseHelper();
  }

  /**
   * The `toFile` function writes an object to a JSON file with specified options like mode
   * and formatting.
   * @param {string} filePath - The `filePath` parameter is a string that represents the path to the file
   * where the JSON data will be written.
   * @param {object} value - The `value` parameter in the `toFile` function represents the object that
   * you want to write to a JSON file. This object will be converted to a JSON string and written to the
   * specified file path.
   * @param {JsonToFileOptions} options - The `options` parameter in the `toFile` method includes two
   * properties: `recursive` and `mode`.
   * @param {| ((number | string)[] | null)
   *       | ((this: any, key: string, value: any) => any)} [replacer] - The `replacer` parameter in the
   * `toFile` method is used to transform the result before it is written to the file. It can be a
   * function that will be called for each key-value pair and can return a modified value to include in
   * the JSON output. Alternatively, it can be an
   * @param {string | number} [space] - The `space` parameter in the `toFile` function is used to specify
   * the white space indentation for formatting the JSON output. It can be either a string or a number.
   * @returns The `toFile` function saves the result into the specified file.
   */
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

  /**
   * The `fromFile` function reads a JSON file from a specified path and parses its content with an
   * optional reviver function.
   * @param {string} filePath - The `filePath` parameter is a string that represents the path to a JSON
   * file that you want to read and parse.
   * @param [reviver] - The `reviver` parameter in the `fromFile` function is a function that can
   * transform the parsed JSON before it is returned. It is an optional parameter that can be used to
   * manipulate the JSON data during the parsing process. The `reviver` function is called for each key
   * and value at
   * @returns - The `fromFile` function returns the parsed JSON content of the file located at the
   * specified `filePath`. If any errors occur during the process, an object with an `error` property containing the
   * error message is returned.
   */
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

/* The `interface JsonToFileOptions` is defining interface named `JsonToFileOptions`. This
interface specifies the structure of an object that can be passed as an argument to the `toFile`
method of the `JsonBuilder` class. */
interface JsonToFileOptions {
  recursive?: boolean;
  mode?: "overwrite" | "append" | "none";
}
