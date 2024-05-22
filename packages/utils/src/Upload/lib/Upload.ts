import { Upload as IUpload } from "@ecoflow/types";
import type { File } from "formidable";
import path from "path";
import fse from "fs-extra";
import { format } from "date-and-time";

/* The Upload class provides methods for filtering and uploading files to a specified
directory with customizable naming conventions. */
export class Upload implements IUpload {
  private _files: File[];
  private _uploadDirectory: string;
  private _prefix: string;
  private _dateformat: string;
  private _timeformat: string;

  /**
   * The constructor initializes properties for handling file uploads.
   * @param {File | File[]} files - The `files` parameter in the constructor function
   * can be either a single `File` object or an array of `File` objects.
   */
  constructor(files: File | File[]) {
    const { config } = ecoFlow;
    this._files = (Array.isArray(files) ? files : [files]) || [];
    this._uploadDirectory = Upload.getUploadDirectory;
    this._prefix = "upload";
    this._dateformat = "DD-MM-YYYY";
    this._timeformat = "HH-mm-ss";
  }

  /**
   * The `setPrefix` function sets a prefix for an upload file and
   * returns the instance of the object.
   * @param {string} prefix - The `prefix` parameter is a string that represents the prefix to be set.
   * @returns The `setPrefix` method is returning the instance of the `Upload` interface,
   * which allows for method chaining.
   */
  setPrefix(prefix: string): IUpload {
    this._prefix = prefix;
    return this;
  }

  /**
   * The `setTimeFormat` function sets the time format for an upload file.
   * @param {string} timeFormat - The `timeFormat` parameter in the `setTimeFormat` method is a string
   * that represents the format in which time should be displayed or processed.
   * token	  meaning	                                examples of output
   * HH	      24-hour with zero-padding	              23, 08
   * H	      24-hour	                                23, 8
   * hh	      12-hour with zero-padding	              11, 08
   * h	      12-hour	                                11, 8
   * A	      meridiem (uppercase)	                  AM, PM
   * mm	      minute with zero-padding	              14, 07
   * m	      minute	                                14, 7
   * ss	      second with zero-padding	              05, 10
   * s	      second	                                5, 10
   * SSS	    millisecond (high accuracy)	            753, 022
   * SS	      millisecond (middle accuracy)	          75, 02
   * S	      millisecond (low accuracy)	            7, 0
   * Z	      time zone offset value	                +0100, -0800
   * ZZ	      time zone offset value with colon	      +01-00, -08-00
   * @returns An object of type Upload is being returned.
   */
  setTimeFormat(timeFormat: string): IUpload {
    this._timeformat = timeFormat;
    return this;
  }

  /**
   * The `setDateFormat` function is to sets the date format for an upload file.
   * @param {string} dateFormat - The `dateFormat` parameter is a string that specifies the format in which
   * dates should be displayed or processed.
   *  * token	  meaning	                            examples of output
   * YYYY	    four-digit year	                    0999, 2015
   * YY	      two-digit year	                      99, 01, 15
   * Y	      four-digit year without zero-padding	  2, 44, 888, 2015
   * MMMM	    month name (long)	January, December
   * MMM	    month name (short)	Jan, Dec
   * MM	      month with zero-padding	01, 12
   * M	      month	1, 12
   * DD	      date with zero-padding	02, 31
   * D	      date	2, 31
   * dddd	    day of week (long)	Friday, Sunday
   * ddd	    day of week (short)	Fri, Sun
   * dd	      day of week (very short)	Fr, Su
   * @returns An instance of the `Upload` interface is being returned.
   */
  setDateFormat(dateFormat: string): IUpload {
    this._dateformat = dateFormat;
    return this;
  }

  /**
   * The function `setUploadLocation` sets the upload location and creates the directory if it doesn't
   * exist.
   * @param {string} location - The `location` parameter in the `setUploadLocation` function is a string
   * that represents the directory path where the files will be uploaded.
   * @returns An instance of the `Upload` interface is being returned.
   */
  setUploadLocation(location: string): IUpload {
    if (!fse.existsSync(location)) fse.emptyDirSync(location);
    this._uploadDirectory = location;
    return this;
  }

  /**
   * The `filterTypes` function filters files based on their mimetype using a provided list of types.
   * @param {string | string[]} types - The `types` parameter in the `filterTypes` function can be either
   * a single string or an array of strings. This function filters the files based on their `mimetype`
   * property, keeping only
   * @returns An instance of the `Upload` interface is being returned.
   */
  filterTypes(types: string | string[]): IUpload {
    const typeList: string[] = Array.isArray(types) ? types : [types];
    this._files = this._files.filter((file) =>
      file.mimetype && typeList.includes(file.mimetype) ? true : false
    );

    return this;
  }

  /**
   * The `filterZips` function filters out files that are not of type "application/x-zip-compressed".
   * @returns An instance of the `Upload` interface is being returned.
   */
  filterZips(): IUpload {
    this._files = this._files.filter(
      (file) => file.mimetype === "application/x-zip-compressed"
    );

    return this;
  }

  /**
   * The `upload` function asynchronously uploads files, renames them with a timestamp and prefix,
   * moves them to a specified directory, and returns an array of the uploaded file names.
   * @returns The `upload()` function returns a Promise that resolves to an array of strings, which are
   * the names of the uploaded files.
   */
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

  static get getUploadDirectory(): string {
    const { config } = ecoFlow;
    return path.join(config.get("userDir"), "uploads");
  }
}
