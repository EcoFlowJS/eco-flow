export interface AuditLogsService {
  fetchAuditLogs(page?: number): Promise<AuditLogsResponse>;
  addLog(auditLog: AuditLog): Promise<void>;
}

export interface AuditLogsResponse {
  pageCount: number;
  logs: AuditLogSchemaStruct[];
}

export interface AuditLog {
  timeSpan?: Date;
  message: string;
  type: AuditLogType;
  userID: string;
}

export interface AuditLogSchemaStruct extends AuditLog {
  _id: string;
}

export type AuditLogType = "Info" | "Warning" | "Error";
