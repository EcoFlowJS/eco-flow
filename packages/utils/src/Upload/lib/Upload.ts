import { Upload as IUpload } from "@ecoflow/types";
import type { File } from "formidable";
import path from "path";
import fse from "fs-extra";
import { format } from "date-and-time";

export class Upload implements IUpload {
  private _files: File[];
  private _uploadDirectory: string;
  private _prefix: string;
  private _dateformat: string;
  private _timeformat: string;

  constructor(files: File | File[]) {
    const { config } = ecoFlow;
    this._files = (Array.isArray(files) ? files : [files]) || [];
    this._uploadDirectory = path.join(config._config.userDir!, "uploads");
    this._prefix = "upload";
    this._dateformat = "DD-MM-YYYY";
    this._timeformat = "HH-mm-ss";
  }

  setPrefix(prefix: string): IUpload {
    this._prefix = prefix;
    return this;
  }

  setTimeFormat(timeFormat: string): IUpload {
    this._timeformat = timeFormat;
    return this;
  }

  setDateFormat(dateFormat: string): IUpload {
    this._dateformat = dateFormat;
    return this;
  }

  setUploadLocation(location: string): IUpload {
    if (!fse.existsSync(location)) fse.emptyDirSync(location);
    this._uploadDirectory = location;
    return this;
  }

  filterTypes(types: string | string[]): IUpload {
    const typeList: string[] = Array.isArray(types) ? types : [types];
    this._files = this._files.filter((file) =>
      file.mimetype && typeList.includes(file.mimetype) ? true : false
    );

    return this;
  }

  filterZips(): IUpload {
    this._files = this._files.filter(
      (file) => file.mimetype === "application/x-zip-compressed"
    );

    return this;
  }

  async upload(): Promise<string[]> {
    const uploadedFiles: string[] = [];

    for await (const file of this._files) {
      const { originalFilename, filepath } = file;
      const name = `${this._prefix}_${format(
        new Date(),
        this._dateformat
      )}_${format(new Date(), this._timeformat)}_${originalFilename}`;

      await fse.ensureDir(this._uploadDirectory);
      await fse.copyFile(filepath, path.join(this._uploadDirectory, name));
      await fse.unlink(filepath);
      uploadedFiles.push(name);
    }

    return uploadedFiles;
  }
}
