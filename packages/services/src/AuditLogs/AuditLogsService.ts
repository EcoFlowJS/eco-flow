import { Database as EcoDB } from "@ecoflow/database";
import {
  Database,
  AuditLogsResponse,
  AuditLogsService as IAuditLogsService,
  AuditLog,
  AuditLogSchemaStruct,
  DatabaseConnection,
} from "@ecoflow/types";
import {
  auditLogsModelKnex,
  auditLogsModelMongoose,
} from "./model/auditLogsModel";

export class AuditLogsService implements IAuditLogsService {
  private connection: DatabaseConnection;
  private database: Database;

  constructor(conn?: DatabaseConnection) {
    this.database = ecoFlow.database;
    this.connection = conn || this.database.getDatabaseConnection("_sysDB");
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

  async fetchAuditLogs(page: number | boolean = 1): Promise<AuditLogsResponse> {
    const { _ } = ecoFlow;

    if (this.database.isKnex(this.connection)) {
      const countQuery = (
        await (await auditLogsModelKnex(this.connection))().select().count()
      )[0] as any;
      const totalDocs = !_.isUndefined(countQuery["count(*)"])
        ? countQuery["count(*)"]
        : countQuery.count;

      const query = (await auditLogsModelKnex(this.connection))().select();

      if (_.isNumber(page)) {
        query.limit(100).orderBy("_id", "desc");
        if (page > 1) query.offset((page - 1) * 100);
      }

      return {
        totalDocs: Number(totalDocs) > 0 ? Number(totalDocs) : 1,
        logs: await query,
      };
    }

    if (this.database.isMongoose(this.connection)) {
      const totalDocs = await auditLogsModelMongoose(this.connection)
        .find()
        .countDocuments();

      const query = auditLogsModelMongoose(this.connection).find();

      if (_.isNumber(page)) {
        query.limit(100).sort({ _id: -1 });
        if (page > 1) query.skip((page - 1) * 100);
      }

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
