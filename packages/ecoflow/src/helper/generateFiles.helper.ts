import { Builder } from "@eco-flow/utils";
import { EcoFlow } from "@eco-flow/types";
import path from "path";
import fse from "fs-extra";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const generateASecret = (): string => crypto.randomBytes(16).toString("base64");

const generateToken = (id: string, salt: string): string =>
  jwt.sign({ _id: id, accessRoot: true }, salt, { expiresIn: "9999Y" });

export default async ({ config, log }: EcoFlow) => {
  log.info("Generating Files...");
  const { envDir, userDir } = config._config;
  const DB_Path = path.join(userDir!, "database");
  const uploadDir = path.join(userDir!, "uploads");
  await fse.ensureDir(DB_Path);
  await fse.ensureDir(uploadDir);
  const TOKEN_SALT = generateASecret();

  await Builder.ENV.generateSystemEnv(envDir!, [
    {
      name: "TOKEN_SECRET",
      value: new Array(4).fill(null).map(generateASecret).join(","),
    },
    { name: "TOKEN_SALT", value: TOKEN_SALT },
    { name: "CRYPTION_KEY", value: generateASecret() },
    { name: "ADMINCLI_TOKEN", value: generateToken("admin", TOKEN_SALT) },
    { name: "NOAUTH_ACCESS_TOKEN", value: generateToken("admin", TOKEN_SALT) },
  ]);

  log.info("Files Created Starting Server");
};
