export interface Upload {
  setPrefix(prefix: string): Upload;
  setTimeFormat(timeFormat: string): Upload;
  setDateFormat(dateFormat: string): Upload;
  setUploadLocation(location: string): Upload;
  filterTypes(types: string | string[]): Upload;
  filterZips(): Upload;
  upload(): Promise<string[]>;
}
