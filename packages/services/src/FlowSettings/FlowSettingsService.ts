import {
  Database,
  DatabaseConnection,
  FlowEditorSettingsConfigurations,
  FlowSettingsService as IFlowSettingsService,
} from "@ecoflow/types";
import {
  flowEditorSettingsModelKnex,
  flowEditorSettingsModelMongoose,
} from "./model/flowSettingsModel";

/**
 * A service class for managing flow settings in the database.
 */
export class FlowSettingsService implements IFlowSettingsService {
  private database: Database;
  private connection: DatabaseConnection;

  /**
   * Constructs a new instance of the class.
   * @param {DatabaseConnection} [conn] - Optional parameter for the database connection.
   * If not provided, it defaults to the connection from the ecoFlow database.
   * @returns None
   */
  constructor(conn?: DatabaseConnection) {
    this.database = ecoFlow.database;
    this.connection = conn || this.database.getDatabaseConnection("_sysDB");
  }

  /**
   * Fetches all flow settings configurations from the database based on the type of connection.
   * @returns A promise that resolves to an array of objects containing partial FlowEditorSettingsConfigurations
   * and optional _id and username fields.
   * @throws {string} If an invalid database connection is specified.
   */
  async fetchAllFlowSettings(): Promise<
    (Partial<FlowEditorSettingsConfigurations> & {
      _id?: string;
      username?: string;
    })[]
  > {
    /**
     * Checks if the connection is a Knex connection and if so, selects all records from the flow editor settings model.
     * @param {any} connection - The database connection to check.
     * @returns {Promise<any>} A promise that resolves to the selected records from the flow editor settings model.
     */
    if (this.database.isKnex(this.connection))
      return await (
        await flowEditorSettingsModelKnex(this.connection)
      )().select();

    /**
     * Checks if the connection is using Mongoose and returns the flow editor settings model data.
     * @param {any} connection - The database connection object.
     * @returns {Promise<any>} The flow editor settings model data.
     */
    if (this.database.isMongoose(this.connection))
      return await flowEditorSettingsModelMongoose(this.connection).find();

    throw "Invalid database connection specified";
  }

  /**
   * Fetches the flow settings for a specific user from the database based on the user ID.
   * @param {string} userId - The ID of the user to fetch settings for.
   * @returns A promise that resolves to an object containing partial FlowEditorSettingsConfigurations
   * along with optional _id and username properties.
   * @throws Throws an error if an invalid database connection is specified.
   */
  async fetchFlowSettings(userId: string): Promise<
    Partial<FlowEditorSettingsConfigurations> & {
      _id?: string | undefined;
      username?: string | undefined;
    }
  > {
    /**
     * Checks if the database connection is using Knex, then queries the flow editor settings
     * model to retrieve the user settings based on the provided userId.
     * @param {string} userId - The unique identifier of the user.
     * @returns {Object} The user settings if found, otherwise an empty object.
     */
    if (this.database.isKnex(this.connection)) {
      const result = await (
        await flowEditorSettingsModelKnex(this.connection)
      )()
        .select()
        .where("username", "=", userId);

      if (result.length > 0) return result[0];
      return {};
    }

    /**
     * Checks if the database connection is using Mongoose, then queries the flowEditorSettings collection
     * to find a document with the given username.
     * @param {string} userId - The username to search for in the flowEditorSettings collection.
     * @returns {Promise<object>} A Promise that resolves to the found document or an empty object.
     */
    if (this.database.isMongoose(this.connection)) {
      const result = await flowEditorSettingsModelMongoose(
        this.connection
      ).findOne({ username: userId });
      if (result !== null) return result;
      return {};
    }

    throw "Invalid database connection specified";
  }

  /**
   * Updates the flow settings for a specific user in the database.
   * @param {string} userId - The ID of the user whose flow settings are being updated.
   * @param {Partial<FlowEditorSettingsConfigurations>} flowSettings - The partial flow settings to update.
   * @returns A promise that resolves to the updated flow settings object with optional _id and username fields.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async updateFlowSettings(
    userId: string,
    flowSettings: Partial<FlowEditorSettingsConfigurations>
  ): Promise<
    Partial<FlowEditorSettingsConfigurations> & {
      _id?: string | undefined;
      username?: string | undefined;
    }
  > {
    const { _ } = ecoFlow;
    /**
     * Updates or inserts flow editor settings for a given user in the database.
     * If the user's settings already exist, they are updated; otherwise, a new entry is inserted.
     * @param {string} userId - The ID of the user whose settings are being updated/inserted.
     * @param {object} flowSettings - The settings to update/insert for the user.
     * @returns {object} The updated/inserted flow editor settings for the user.
     */
    if (this.database.isKnex(this.connection)) {
      /**
       * Counts the number of records in the flow editor settings model table that match the given user ID.
       * @param {string} userId - The user ID to match records against.
       * @returns The count of records that match the user ID.
       */
      const countQuery = (
        await (await flowEditorSettingsModelKnex(this.connection))()
          .count()
          .where("username", "=", userId)
      )[0];

      /**
       * Checks if the countQuery object has a property "count(*)". If it does, returns that value,
       * otherwise returns the value of countQuery.count.
       * @param {Object} countQuery - The object containing the count information.
       * @returns The count value extracted from the countQuery object.
       */
      const count = !_.isUndefined(countQuery["count(*)"])
        ? countQuery["count(*)"]
        : countQuery.count;

      if (Number(count) === 0) {
        await (
          await flowEditorSettingsModelKnex(this.connection)
        )().insert({
          username: userId,
          ...flowSettings,
        });

        return (
          await (await flowEditorSettingsModelKnex(this.connection))()
            .select(
              "keyboardAccessibility",
              "controls",
              "miniMap",
              "panMiniMap",
              "scrollPan"
            )
            .where({ username: userId })
        )[0];
      }

      await (
        await flowEditorSettingsModelKnex(this.connection)
      )()
        .update({
          ...flowSettings,
        })
        .where("username", "=", userId);

      return (
        await (await flowEditorSettingsModelKnex(this.connection))()
          .select(
            "keyboardAccessibility",
            "controls",
            "miniMap",
            "panMiniMap",
            "scrollPan"
          )
          .where({ username: userId })
      )[0];
    }

    /**
     * Checks if the database connection is using Mongoose, then performs operations
     * on the flow editor settings model based on the provided user ID and flow settings.
     * @param {string} userId - The ID of the user.
     * @param {Object} flowSettings - The settings for the flow editor.
     * @returns {Object} The result of the operation on the flow editor settings model.
     */
    if (this.database.isMongoose(this.connection)) {
      /**
       * Checks if there are any existing flow editor settings in the database for the given user.
       * If no settings are found, creates new flow editor settings for the user.
       * @param {string} userId - The user ID for which the settings are being checked/created.
       * @param {Object} flowSettings - The flow editor settings to be created for the user.
       * @returns {Promise<Object>} A promise that resolves to the created flow editor settings object.
       */
      if (
        (await flowEditorSettingsModelMongoose(
          this.connection
        ).countDocuments()) === 0
      )
        return await flowEditorSettingsModelMongoose(this.connection).create({
          username: userId,
          ...flowSettings,
        });

      /**
       * Update the flow editor settings for a specific user in the database.
       * @param {string} userId - The username of the user whose settings are being updated.
       * @param {Object} flowSettings - The new flow editor settings to be set for the user.
       * @returns {Promise} A promise that resolves when the update operation is complete.
       */
      await flowEditorSettingsModelMongoose(this.connection).updateOne(
        { username: userId },
        { $set: { ...flowSettings } }
      );
      const result = await flowEditorSettingsModelMongoose(
        this.connection
      ).findOne({ username: userId });
      if (result) return result;
      return {};
    }

    throw "Invalid database connection specified";
  }
}
