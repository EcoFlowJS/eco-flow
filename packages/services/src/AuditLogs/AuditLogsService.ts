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
} from "./model/auditLogsModel.js";

/**
 * Service class for handling audit logs in the system.
 */
export class AuditLogsService implements IAuditLogsService {
  private connection: DatabaseConnection;
  private database: Database;

  /**
   * Constructs a new instance of the class.
   * @param {DatabaseConnection} [conn] - Optional parameter for the database connection.
   * @returns None
   */
  constructor(conn?: DatabaseConnection) {
    this.database = ecoFlow.database;
    this.connection = conn || this.database.getDatabaseConnection("_sysDB");
  }

  /**
   * Adds an audit log entry to the database based on the provided AuditLog object.
   * @param {AuditLog} auditLog - The audit log object containing information about the log entry.
   * @returns {Promise<void>} A promise that resolves once the audit log has been added to the database.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async addLog(auditLog: AuditLog): Promise<void> {
    const { server } = ecoFlow;
    let updated = false;

    /**
     * Checks if the database connection is using Knex, then logs the audit information.
     * @param {any} connection - The database connection object.
     * @param {AuditLog} auditLog - The audit log information to be logged.
     * @returns {Promise<boolean>} - A promise that resolves to true if the audit log was successfully inserted.
     */
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

    /**
     * If the database connection is using Mongoose, create an audit log using the Mongoose model.
     * @param {any} connection - The database connection object.
     * @param {any} auditLog - The audit log object to be created.
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the audit log was successfully created.
     */
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

  /**
   * Fetches audit logs based on the specified page number.
   * @param {number | boolean} [page=1] - The page number to fetch audit logs from.
   * @returns {Promise<AuditLogsResponse>} A promise that resolves to an object containing totalDocs and logs.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  async fetchAuditLogs(page: number | boolean = 1): Promise<AuditLogsResponse> {
    const { _ } = ecoFlow;

    /**
     * Retrieves audit logs from the database using Knex if the connection is Knex.
     * @param {any} connection - The database connection object.
     * @param {number} page - The page number for pagination.
     * @returns {Object} An object containing totalDocs and logs retrieved from the database.
     */
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

    /**
     * Retrieves audit logs from the database using Mongoose if the connection is a Mongoose connection.
     * @param {any} connection - The database connection object.
     * @param {number} page - The page number for pagination.
     * @returns {Object} An object containing totalDocs and logs retrieved from the database.
     */
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
