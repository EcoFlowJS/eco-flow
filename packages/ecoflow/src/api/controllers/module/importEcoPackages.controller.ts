import { ApiResponse, ModuleSchema } from "@ecoflow/types";
import { Upload } from "@ecoflow/utils/upload";
import { Context } from "koa";

/**
 * Imports Eco packages asynchronously using the provided context.
 * @param {Context} ctx - The context object containing the request information.
 * @returns None
 */
const importEcoPackages = async (ctx: Context) => {
  const { _, ecoModule, service } = ecoFlow;

  /**
   * Try to install a local module and add it to the ecoModule.
   * If successful, returns a success response with the installed modules.
   * If an error occurs, returns an error response with the error message.
   * @param {Object} ctx - The context object containing the request and user information.
   * @returns None
   */
  try {
    /**
     * Checks if the request object contains the required "packages" files.
     * If not, throws an error indicating that "Packages is required."
     * @param {object} ctx - The context object containing the request files.
     * @throws {string} Throws an error message if "packages" files are missing or empty.
     */
    if (
      _.isUndefined(ctx.request.files) ||
      _.isUndefined(ctx.request.files["packages"]) ||
      _.isEmpty(ctx.request.files["packages"])
    )
      throw "Packages is required.";

    /**
     * Installs a local module and returns an array of ModuleSchema objects.
     * @param {Upload} upload - The uploaded file containing the module to install.
     * @returns {ModuleSchema[]} An array of ModuleSchema objects representing the installed modules.
     */
    const schemas: ModuleSchema[] = await ecoModule.installLocalModule(
      await new Upload(ctx.request.files["packages"]).upload()
    );

    /**
     * Adds the provided schemas to the ecoModule.
     * @param {any} schemas - The schemas to be added to the ecoModule.
     * @returns Promise<void>
     */
    await ecoModule.addModule(schemas);

    /**
     * Sets the status of the response to 200 and constructs a response body with a success flag
     * and an array of modules extracted from the given schemas.
     * @param {number} 200 - The HTTP status code for a successful response.
     * @param {<ApiResponse>} - An object representing the response body with success flag and payload.
     * @returns None
     */
    ctx.status = 200;
    ctx.body = <ApiResponse>{
      success: true,
      payload: schemas.map((s) => s.module),
    };

    /**
     * Asynchronously iterates over an array of schemas and adds an audit log for each installed module.
     * @param {Array} schemas - An array of schemas containing information about installed modules.
     * @returns None
     */
    for await (const { module: installedModule } of schemas) {
      await service.AuditLogsService.addLog({
        message: `New local package(${installedModule?.name}) has been installed by ${ctx.user}`,
        type: "Info",
        userID: ctx.user,
      });
    }
  } catch (error) {
    ctx.status = 404;
    ctx.body = <ApiResponse>{
      error: true,
      payload: error,
    };
  }
};

export default importEcoPackages;
