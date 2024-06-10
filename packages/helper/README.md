# Helper

Helper class with static methods for various helper functions

## Methods

### String To Function

**stringToFunction(value)** ⇒ `unknown`

Converts a string representation of a function to an actual function.

**Return:** The function represented by the input string.

**_Available arguments :_**

| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| value     | `string` | The string representation of the function. |

### XSS Filter

**xssFilterHelper(value)** ⇒ `string`

Filters out potential cross-site scripting (XSS) attacks from the given string value.

**Return:** The filtered string value without XSS vulnerabilities.

**_Available arguments :_**

| Parameter | Type     | Description                                 |
| :-------- | :------- | :------------------------------------------ |
| value     | `string` | The string value to filter for XSS attacks. |

### Function To String

**functionToString(value)** ⇒ `string`

Converts a function to a string representation.

**Return:** A string representation of the function.

**_Available arguments :_**

| Parameter | Type       | Description                          |
| :-------- | :--------- | :----------------------------------- |
| value     | `Function` | The function to convert to a string. |

### Install Package

**installPackageHelper(installDir, packageNames)** ⇒ `Promise<void>`

Asynchronously installs the specified package or packages into the given directory.

**Return:** A promise that resolves when the packages are successfully installed.

**_Available arguments :_**

| Parameter    | Type                 | Description                                         |
| :----------- | :------------------- | :-------------------------------------------------- |
| installDir   | `string`             | The directory where the packages will be installed. |
| packageNames | `string \| string[]` | The name or names of the packages to install.       |

### Install Package Dependencies

**installPackageDependencies(installDir)** ⇒ `Promise<void>`

Asynchronously installs the dependencies into the given directory.

**Return:** A promise that resolves when the dependencies are successfully installed.

**_Available arguments :_**

| Parameter  | Type     | Description                                                      |
| :--------- | :------- | :--------------------------------------------------------------- |
| installDir | `string` | The directory where the packages dependencies will be installed. |

### Remove Package

**removePackageHelper(installDir, packageNames)** ⇒ `Promise<void>`

Asynchronously removes the specified package or packages from the given installation directory.

**Return:** A promise that resolves once the packages have been removed.

**_Available arguments :_**

| Parameter    | Type                 | Description                                      |
| :----------- | :------------------- | :----------------------------------------------- |
| installDir   | `string`             | The directory where the packages are installed.  |
| packageNames | `string \| string[]` | The name or names of the packages to be removed. |

### Fetch From Environment

**fetchFromEnv(env, type)** ⇒ `string | undefined`

Fetches a value from the environment variables based on the specified environment variable name and type.

**Return:** The value of the environment variable if found, otherwise undefined.

**_Available arguments :_**

| Parameter    | Type `(Default)`                | Description                                                      |
| :----------- | :------------------------------ | :--------------------------------------------------------------- |
| env          | `string`                        | The name of the environment variable to fetch.                   |
| packageNames | `"user" \| "system"` `("user")` | The type of environment variable to fetch from (user or system). |

### Generate Random Int

**getRandomInt(min, max)** ⇒ `number`

Generate a random integer between the specified minimum and maximum values.

**Return:** A random integer between the min and max values.

**_Available arguments :_**

| Parameter | Type     | Description                                           |
| :-------- | :------- | :---------------------------------------------------- |
| min       | `number` | The minimum value for the random integer (inclusive). |
| max       | `number` | The maximum value for the random integer (inclusive). |

### Generate Jwt Token

**generateJwtToken(value, [options])** ⇒ `string`

Generates a JWT token based on the provided value and options.

**Return:** The generated JWT token.

**_Available arguments :_**

| Parameter | Type                         | Description                                                                                                               |
| :-------- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| value     | `string \| object \| Buffer` | The value to be encoded in the token.                                                                                     |
| [options] | `SignOptions`                | The options for signing the token. Detailed documentation can be found [here](https://www.npmjs.com/package/jsonwebtoken) |

### Verify Jwt Token

**verifyJwtToken(token, [options])** ⇒ `JwtPayload | string | null`

Verifies the JWT token using the provided options.

**Return:** The payload of the JWT token if verified successfully, a JwtPayload or string and null if verification fails.

**_Available arguments :_**

| Parameter | Type            | Description                                                                                                                 |
| :-------- | :-------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| token     | `string`        | The JWT token to verify.                                                                                                    |
| [options] | `VerifyOptions` | The options to use for verification. Detailed documentation can be found [here](https://www.npmjs.com/package/jsonwebtoken) |

### Create Hash

**createHash(val)** ⇒ `Promise<string>`

Asynchronously creates a hash value for the given input.

**Return:** A promise that resolves to the hash value of the input.

**_Available arguments :_**

| Parameter | Type  | Description             |
| :-------- | :---- | :---------------------- |
| val       | `any` | The value to be hashed. |

### Compare Hash

**compareHash(val, hash)** ⇒ `Promise<boolean>`

Compares a value to a hash.

**Return:** A promise that resolves to true if the value matches the hash, false otherwise.

**_Available arguments :_**

| Parameter | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| val       | `string` | The value to compare.        |
| hash      | `string` | The hash to compare against. |

### List All Cookies

**listAllCookies(cookie)** ⇒ `Array<any>`

Returns a list of all cookies from the provided cookie header.

**Return:** An array containing all the cookies.

**_Available arguments :_**

| Parameter | Type     | Description                               |
| :-------- | :------- | :---------------------------------------- |
| cookie    | `string` | The cookie header containing the cookies. |

### Set Cookie

**setCookie(ctx, name, value, [options])** ⇒ `Promise<void>`

Asynchronously sets a cookie with the given name, value, and options in the provided context.

**Return:** A Promise that resolves when the cookie is successfully set.

**_Available arguments :_**

| Parameter | Type        | Description                                                                                                    |
| :-------- | :---------- | :------------------------------------------------------------------------------------------------------------- |
| ctx       | `Context`   | The context in which to set the cookie. Detailed documentation can be found [here](https://koajs.com/#context) |
| name      | `string`    | The name of the cookie to set.                                                                                 |
| value     | `string`    | The value to assign to the cookie.                                                                             |
| [options] | `SetOption` | The options to apply when setting the cookie.                                                                  |

### Fetch Cookie

**getCookie(ctx, name)** ⇒ `Promise<string | undefined>`

Retrieves a cookie value from the provided context using the given cookie name.

**Return:** A Promise that resolves to the value of the cookie, or undefined if the cookie is not found.

**_Available arguments :_**

| Parameter | Type      | Description                                                                                                       |
| :-------- | :-------- | :---------------------------------------------------------------------------------------------------------------- |
| ctx       | `Context` | The context object containing the cookies. Detailed documentation can be found [here](https://koajs.com/#context) |
| name      | `string`  | The name of the cookie to retrieve.                                                                               |

### Validate Password Regex

**validatePasswordRegex(value)** ⇒ `boolean`

Validates a password using a regular expression pattern.

**Return:** True if the password matches the regular expression pattern, false otherwise.

**_Available arguments :_**

| Parameter | Type     | Description               |
| :-------- | :------- | :------------------------ |
| value     | `string` | The password to validate. |

### Require Uncached

**requireUncached(id)** ⇒ `any`

Requires a module in Node.js without caching the result, allowing for dynamic reloading.

**Return:** The result of requiring the module

**_Available arguments :_**

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| id        | `string` | The module identifier to require. |

## TypeScript Properties

### `SetOption`

```ts
interface SetOption {
  /**
   * a number representing the milliseconds from Date.now() for expiry
   */
  maxAge?: number | undefined;
  /**
   * a Date object indicating the cookie's expiration
   * date (expires at the end of session by default).
   */
  expires?: Date | undefined;
  /**
   * a string indicating the path of the cookie (/ by default).
   */
  path?: string | undefined;
  /**
   * a string indicating the domain of the cookie (no default).
   */
  domain?: string | undefined;
  /**
   * a boolean indicating whether the cookie is only to be sent
   * over HTTPS (false by default for HTTP, true by default for HTTPS).
   */
  secure?: boolean | undefined;
  /**
   * "secureProxy" option is deprecated; use "secure" option, provide "secure" to constructor if needed
   */
  secureProxy?: boolean | undefined;
  /**
   * a boolean indicating whether the cookie is only to be sent over HTTP(S),
   * and not made available to client JavaScript (true by default).
   */
  httpOnly?: boolean | undefined;
  /**
   * a boolean or string indicating whether the cookie is a "same site" cookie (false by default).
   * This can be set to 'strict', 'lax', or true (which maps to 'strict').
   */
  sameSite?: "strict" | "lax" | "none" | boolean | undefined;
  /**
   * a boolean indicating whether the cookie is to be signed (false by default).
   * If this is true, another cookie of the same name with the .sig suffix
   * appended will also be sent, with a 27-byte url-safe base64 SHA1 value
   * representing the hash of cookie-name=cookie-value against the first Keygrip key.
   * This signature key is used to detect tampering the next time a cookie is received.
   */
  signed?: boolean | undefined;
  /**
   * a boolean indicating whether to overwrite previously set
   * cookies of the same name (false by default). If this is true,
   * all cookies set during the same request with the same
   * name (regardless of path or domain) are filtered out of
   * the Set-Cookie header when setting this cookie.
   */
  overwrite?: boolean | undefined;
}
```
