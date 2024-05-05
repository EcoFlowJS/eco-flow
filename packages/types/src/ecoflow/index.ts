import { ICommand } from "../cli";
import { EcoRouter, EcoServer } from "./service";
import { Logger } from "../utils";
import { Config } from "./config";
import type _ from "lodash";
import { EcoContainer } from "./EcoContainer";
import { Database } from "../database";
import { EcoModule } from "../module";
import { Service } from "../services";
import type { Server } from "socket.io";
import { EcoFlowEditor } from "../flows";

export * from "./config";
export * from "./EcoContainer";
export * from "./EcoFactory";
export * from "./service";
export * from "./api";

/**
 * Interface for a class type that defines a constructor function and its prototype.
 * @template InstanceType - The type of the instance created by the constructor function.
 * @extends Function
 */
export interface ClassType<InstanceType extends {} = any> extends Function {
  new (...args: any[]): InstanceType;
  prototype: InstanceType;
}

/**
 * Interface for Eco options.
 * @interface EcoOptions
 * @property {ICommand} [cli] - The command line interface option.
 * @property {any} [key] - Additional key-value pairs for custom options.
 */
export interface EcoOptions {
  /**
   * An optional ICommand object that represents a command line interface command.
   */
  cli?: ICommand;
  /**
   * An index signature indicating that an object may have any number of properties
   * with string keys and any corresponding values.
   */
  [key: string]: any;
}

/**
 * Defines a type 'loadedEcoFlow' that includes all required properties of the 'EcoFlow' type.
 */
export type loadedEcoFlow = Required<EcoFlow>;

export interface EcoFlow {
  /**
   * A boolean flag indicating whether the authenticated mode is enabled or not.
   */
  isAuth: boolean;

  /**
   * A reference to the lodash library.
   * @type {typeof _}
   */
  _: typeof _;

  /**
   * Represents an instance of an EcoServer.
   * @type {EcoServer}
   */
  server: EcoServer;

  /**
   * Represents a socket server instance.
   * @type {Server}
   */
  socket: Server;

  /**
   * A variable representing an instance of the EcoRouter class.
   * @type {EcoRouter}
   */
  router: EcoRouter;

  /**
   * Represents an EcoContainer object.
   * @type {EcoContainer}
   */
  container: EcoContainer;

  /**
   * Getter method to retrieve the configuration object.
   * @returns {Config} The configuration object.
   */
  get config(): Config;

  /**
   * Getter method for accessing the Database instance.
   * @returns {Database} The Database instance.
   */
  get database(): Database;

  /**
   * Getter method to retrieve the EcoModule instance.
   * @returns {EcoModule} The EcoModule instance.
   */
  get ecoModule(): EcoModule;

  /**
   * Getter method for accessing the EcoFlowEditor instance.
   * @returns {EcoFlowEditor} The EcoFlowEditor instance.
   */
  get flowEditor(): EcoFlowEditor;

  /**
   * Getter method that returns the Service object.
   * @returns {Service} The Service object.
   */
  get service(): Service;

  /**
   * Getter method that returns the Logger instance.
   * @returns {Logger} The Logger instance used for logging.
   */
  get log(): Logger;

  /**
   * Get the version of the software.
   * @returns {string} The version of the software.
   */
  get Version(): string;
}
