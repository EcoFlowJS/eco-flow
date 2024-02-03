export * from "./Schema";

export interface ApiResponse {
  error?: boolean;
  success?: boolean;
  payload?: any;
}
