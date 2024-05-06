import { Builder } from "@ecoflow/utils";
import { EcoFlow } from "@ecoflow/types";
import path from "path";
import fse from "fs-extra";
import crypto from "crypto";
import jwt from "jsonwebtoken";

/**
 * Generates a random secret key using crypto.randomBytes and returns it as a base64 encoded string.
 * @returns {string} A randomly generated secret key.
 */
const generateASecret = (): string => crypto.randomBytes(16).toString("base64");

/**
 * Generates a JWT token with the given ID and salt.
 * @param {string} id - The ID to include in the token payload.
 * @param {string} salt - The salt to use for signing the token.
 * @returns {string} The generated JWT token.
 */
const generateToken = (id: string, salt: string): string =>
  jwt.sign({ _id: id, accessRoot: true }, salt, { expiresIn: "9999Y" });

/**
 * Generates necessary files and configurations for the EcoFlow application.
 * @param {EcoFlow} config - The configuration object containing environment and user directories.
 * @returns None
 */
const generateFiles = async ({ config, log }: EcoFlow) => {
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

export default generateFiles;
