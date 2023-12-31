import { Builder } from "@eco-flow/utils";
import { EcoFlow } from "@eco-flow/types";
import path from "path";
import fse from "fs-extra";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateASecret = (): string => crypto.randomBytes(16).toString("base64");

const generateToken = (id: string): string =>
  jwt.sign({ _id: id }, generateASecret(), { expiresIn: "9999Y" });

export default async ({ config, log }: EcoFlow) => {
  log.info("Generating Files...");
  const { envDir, userDir } = config._config;
  const DB_Path = path.join(userDir!, "database");
  await fse.ensureDir(DB_Path);

  await Builder.ENV.generateSystemEnv(envDir!, [
    {
      name: "TOKEN_SECRET",
      value: new Array(4).fill(null).map(generateASecret).join(","),
    },
    { name: "TOKEN_SALT", value: generateASecret() },
    { name: "CRYPTION_KEY", value: generateASecret() },
    { name: "ADMINCLI_TOKEN", value: generateToken("admin") },
    { name: "NOAUTH_ACCESS_TOKEN", value: generateToken("admin") },
  ]);

  log.info("Files Created Starting Server");
};
