import path from "path";
import fse from "fs-extra";
import Helper from "@ecoflow/helper";

const processImportFlow = async (
  extractDirectory: string
): Promise<[boolean, string]> => {
  const { flowEditor } = ecoFlow;
  if (
    (await fse.exists(path.join(extractDirectory, "flows.json"))) &&
    (await fse.lstat(path.join(extractDirectory, "flows.json"))).isFile()
  )
    flowEditor.deploy(
      Helper.requireUncached(path.join(extractDirectory, "flows.json"))
    );
  return [true, "Flow schema imported successfully"];
};

export default processImportFlow;
