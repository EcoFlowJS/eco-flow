import { Database as EcoDB } from "@eco-flow/database";
import {
  Database,
  DriverKnex,
  DriverMongoose,
  AuditLogsResponse,
  AuditLogsService as IAuditLogsService,
  AuditLog,
  AuditLogSchemaStruct,
} from "@eco-flow/types";
import {
  auditLogsModelKnex,
  auditLogsModelMongoose,
} from "./model/auditLogsModel";

export class AuditLogsService implements IAuditLogsService {
  private connection: DriverKnex | DriverMongoose;
  private database: Database;
  constructor() {
    this.database = ecoFlow.database;
    this.connection = this.database.getDatabaseConnection("_sysDB");
  }

  async addLog(auditLog: AuditLog): Promise<void> {
    const { server } = ecoFlow;
    let updated = false;
    if (this.database.isKnex(this.connection)) {
      const log = {
        timeSpan: auditLog.timeSpan
          ? EcoDB.formatKnexDateTime(auditLog.timeSpan)
          : EcoDB.formatKnexDateTime(new Date()),
        message: auditLog.message,
        type: auditLog.type,
        userID: auditLog.userID,
      };

      await (await auditLogsModelKnex(this.connection))().insert(log as any);
      updated = true;
    }

    if (this.database.isMongoose(this.connection)) {
      await auditLogsModelMongoose(this.connection).create(auditLog);
      updated = true;
    }

    if (updated) {
      server.socket
        .to("auditLog")
        .emit("auditLogAdded", await this.fetchAuditLogs());
      return;
    }

    throw "Invalid database connection specified";
  }

  async fetchAuditLogs(page: number = 1): Promise<AuditLogsResponse> {
    if (this.database.isKnex(this.connection)) {
      const totalDocs = (
        (
          await (await auditLogsModelKnex(this.connection))().select().count()
        )[0] as any
      )["count(*)"];

      const query = (await auditLogsModelKnex(this.connection))()
        .select()
        .limit(100)
        .orderBy("_id", "desc");
      if (page > 1) query.offset((page - 1) * 100);

      return {
        totalDocs: totalDocs > 0 ? totalDocs : 1,
        logs: await query,
      };
    }

    if (this.database.isMongoose(this.connection)) {
      const totalDocs = await auditLogsModelMongoose(this.connection)
        .find()
        .countDocuments();

      const query = auditLogsModelMongoose(this.connection)
        .find()
        .limit(100)
        .sort({ _id: -1 });
      if (page > 1) query.skip((page - 1) * 100);

      return {
        totalDocs: totalDocs > 0 ? totalDocs : 1,
        logs: (await query).map((logs: AuditLogSchemaStruct) => {
          logs.timeSpan = EcoDB.formatKnexDateTime(logs.timeSpan!) as any;
          return logs;
        }),
      };
    }

    throw "Invalid database connection specified";
  }
}
