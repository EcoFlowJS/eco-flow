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

  constructor(conn?: DatabaseConnection) {
    this.database = ecoFlow.database;
    this.connection = conn || this.database.getDatabaseConnection("_sysDB");
  }

  async fetchAllFlowSettings(): Promise<
    (Partial<FlowEditorSettingsConfigurations> & {
      _id?: string;
      username?: string;
    })[]
  > {
    if (this.database.isKnex(this.connection))
      return await (
        await flowEditorSettingsModelKnex(this.connection)
      )().select();

    if (this.database.isMongoose(this.connection))
      return await flowEditorSettingsModelMongoose(this.connection).find();

    throw "Invalid database connection specified";
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
    const { _ } = ecoFlow;
    if (this.database.isKnex(this.connection)) {
      const countQuery = (
        await (await flowEditorSettingsModelKnex(this.connection))()
          .count()
          .where("username", "=", userId)
      )[0];
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
