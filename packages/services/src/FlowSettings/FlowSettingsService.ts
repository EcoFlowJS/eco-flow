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

export class FlowSettingsService implements IFlowSettingsService {
  private database: Database;
  private connection: DatabaseConnection;

  constructor() {
    this.database = ecoFlow.database;
    this.connection = this.database.getDatabaseConnection("_sysDB");
  }

  async fetchFlowSettings(userId: string): Promise<
    Partial<FlowEditorSettingsConfigurations> & {
      _id?: string | undefined;
      username?: string | undefined;
    }
  > {
    if (this.database.isKnex(this.connection)) {
      const result = await (
        await flowEditorSettingsModelKnex(this.connection)
      )()
        .select()
        .where("username", "=", userId);

      if (result.length > 0) return result[0];
      return {};
    }

    if (this.database.isMongoose(this.connection)) {
      const result = await flowEditorSettingsModelMongoose(
        this.connection
      ).findOne({ username: userId });
      if (result !== null) return result;
      return {};
    }

    throw "Invalid database connection specified";
  }

  async updateFlowSettings(
    userId: string,
    flowSettings: Partial<FlowEditorSettingsConfigurations>
  ): Promise<
    Partial<FlowEditorSettingsConfigurations> & {
      _id?: string | undefined;
      username?: string | undefined;
    }
  > {
    if (this.database.isKnex(this.connection)) {
      const count = (
        await (await flowEditorSettingsModelKnex(this.connection))()
          .count()
          .where("username", "=", userId)
      )[0]["count(*)"];

      if (count === 0)
        return (
          await (
            await flowEditorSettingsModelKnex(this.connection)
          )()
            .insert({
              username: userId,
              ...flowSettings,
            })
            .returning([
              "keyboardAccessibility",
              "controls",
              "miniMap",
              "panMiniMap",
              "scrollPan",
            ])
        )[0];

      return (
        await (
          await flowEditorSettingsModelKnex(this.connection)
        )()
          .update({
            ...flowSettings,
          })
          .where("username", "=", userId)
          .returning([
            "keyboardAccessibility",
            "controls",
            "miniMap",
            "panMiniMap",
            "scrollPan",
          ])
      )[0];
    }

    if (this.database.isMongoose(this.connection)) {
      if (
        (await flowEditorSettingsModelMongoose(
          this.connection
        ).countDocuments()) === 0
      )
        return await flowEditorSettingsModelMongoose(this.connection).create({
          username: userId,
          ...flowSettings,
        });

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
