export interface AuditLogsService {
  /**
   * Fetches audit logs based on the specified page number.
   * @param {boolean} [page] - The page number to fetch audit logs from.
   * @returns {Promise<AuditLogsResponse>} A promise that resolves to an object containing totalDocs and logs.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  fetchAuditLogs(isAll?: boolean): Promise<AuditLogsResponse>;

  /**
   * Fetches audit logs based on the specified page number.
   * @param {number} [page=1] - The page number to fetch audit logs from.
   * @returns {Promise<AuditLogsResponse>} A promise that resolves to an object containing totalDocs and logs.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  fetchAuditLogs(page?: number): Promise<AuditLogsResponse>;

  /**
   * Adds an audit log entry to the database based on the provided AuditLog object.
   * @param {AuditLog} auditLog - The audit log object containing information about the log entry.
   * @returns {Promise<void>} A promise that resolves once the audit log has been added to the database.
   * @throws {string} Throws an error if an invalid database connection is specified.
   */
  addLog(auditLog: AuditLog): Promise<void>;
}

/**
 * Interface representing the response object for audit logs.
 * @interface AuditLogsResponse
 * @property {number} totalDocs - The total number of audit log documents.
 * @property {AuditLogSchemaStruct[]} logs - An array of AuditLogSchemaStruct objects.
 */
export interface AuditLogsResponse {
  totalDocs: number;
  logs: AuditLogSchemaStruct[];
}

/**
 * Represents an audit log entry.
 * @interface AuditLog
 * @property {Date} [timeSpan] - The time span of the audit log entry.
 * @property {string} message - The message of the audit log entry.
 * @property {AuditLogType} type - The type of the audit log entry.
 * @property {string} userID - The user ID associated with the audit log entry.
 */
export interface AuditLog {
  timeSpan?: Date;
  message: string;
  type: AuditLogType;
  userID: string;
}

/**
 * Defines the structure of the Audit Log Schema, extending the AuditLog interface.
 * @interface AuditLogSchemaStruct
 * @extends AuditLog
 * @property {string} [_id] - Optional property for the unique identifier of the log.
 */
export interface AuditLogSchemaStruct extends AuditLog {
  _id?: string;
}

/**
 * Represents the type of audit log entry, which can be "Info", "Warning", or "Error".
 */
export type AuditLogType = "Info" | "Warning" | "Error";
