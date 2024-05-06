import { FlowEditorSettingsConfigurations } from "../../flows";

export interface FlowSettingsService {
  /**
   * Fetches all flow settings configurations from the database based on the type of connection.
   * @returns A promise that resolves to an array of objects containing partial FlowEditorSettingsConfigurations
   * and optional _id and username fields.
   * @throws {string} If an invalid database connection is specified.
   */
  fetchAllFlowSettings(): Promise<
    (Partial<FlowEditorSettingsConfigurations> & {
      _id?: string;
      username?: string;
    })[]
  >;

  /**
   * Fetches the flow settings for a specific user from the database based on the user ID.
   * @param {string} userId - The ID of the user to fetch settings for.
   * @returns A promise that resolves to an object containing partial FlowEditorSettingsConfigurations
   * along with optional _id and username properties.
   * @throws Throws an error if an invalid database connection is specified.
   */
  fetchFlowSettings(userId: string): Promise<
    Partial<FlowEditorSettingsConfigurations> & {
      _id?: string;
      username?: string;
    }
  >;

  /**
   * Updates the flow settings for a specific user in the database.
   * @param {string} userId - The ID of the user whose flow settings are being updated.
   * @param {Partial<FlowEditorSettingsConfigurations>} flowSettings - The partial flow settings to update.
   * @returns A promise that resolves to the updated flow settings object with optional _id and username fields.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  updateFlowSettings(
    userId: string,
    flowSettings: Partial<FlowEditorSettingsConfigurations>
  ): Promise<
    Partial<FlowEditorSettingsConfigurations> & {
      _id?: string;
      username?: string;
    }
  >;
}
