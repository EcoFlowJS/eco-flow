export interface SetupImportStatus {
  envs: "init" | "success" | "error";
  config: "init" | "success" | "error";
  users: "init" | "success" | "error";
  packages: "init" | "success" | "error";
  databases: "init" | "success" | "error";
  flowSchematic: "init" | "success" | "error";
}
