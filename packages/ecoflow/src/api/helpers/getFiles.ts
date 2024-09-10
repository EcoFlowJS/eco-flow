import { readdir, stat } from "fs-extra";
import { resolve } from "path";

const getFiles = async (dir: string): Promise<string | string[]> => {
  const { _ } = ecoFlow;
  const subdirs: string[] = await readdir(dir);
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );
  return files.reduce((a, f) => a.concat(f as string), []);
};

export default getFiles;
