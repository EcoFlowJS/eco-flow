import { EcoServer, Environment } from "@ecoflow/types";
import session from "koa-session";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";
import passport from "koa-passport";
import { Builder } from "@ecoflow/utils";

/**
 * Represents a Passport class that handles authentication using JWT tokens.
 * @param {EcoServer} svr - The EcoServer instance to use for authentication.
 * @param {StrategyOptionsWithoutRequest} [options] - The options for the authentication strategy.
 * @constructor
 */
export class Passport {
  private svr: EcoServer;
  private options: StrategyOptionsWithoutRequest;
  private passport: typeof passport;

  /**
   * Constructs a new instance of the class.
   * @param {EcoServer} svr - The EcoServer instance.
   * @param {StrategyOptionsWithoutRequest} [options] - The options for the strategy without request.
   * @returns None
   */
  constructor(
    svr: EcoServer,
    options: StrategyOptionsWithoutRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: (Builder.ENV.getSystemEnv("TOKEN_SALT") as Environment)
        .value,
    }
  ) {
    this.svr = svr;
    this.options = options;
    this.passport = svr.passport;
  }

  /**
   * Initializes the application by setting up the necessary strategies, keys, session, and passport.
   * @returns None
   */
  init() {
    this.initStrategy();
    this.svr.keys = (
      Builder.ENV.getSystemEnv("TOKEN_SECRET") as Environment
    ).value.split(",");
    this.svr.use(session(this.svr));
    this.svr.use(this.passport.initialize());
    this.svr.use(this.passport.session());
  }

  /**
   * Initializes the authentication strategy for the application.
   * This method sets up serialization, deserialization, and a JwtStrategy for passport.
   * @returns None
   */
  private initStrategy() {
    /**
     * Serialize the user object to store in the session.
     * @param {any} user - The user object to serialize.
     * @param {Function} done - The callback function to indicate serialization completion.
     * @returns None
     */
    this.passport.serializeUser((user: any, done) => {
      done(null, user);
    });

    /**
     * Passport function to deserialize a user.
     * @param {string} user - The user to deserialize.
     * @param {Function} done - The callback function to indicate completion.
     * @returns None
     */
    this.passport.deserializeUser(function (user: string, done) {
      done(null, user);
    });

    /**
     * Configures the passport to use a custom strategy "_ecoFlowPassport" with a JwtStrategy.
     * @param {string} "_ecoFlowPassport" - The name of the custom strategy.
     * @param {JwtStrategy} new JwtStrategy - The JwtStrategy to be used for authentication.
     * @returns None
     */
    this.passport.use(
      "_ecoFlowPassport",
      new JwtStrategy(this.options, (jwt_payload, done) => {
        done(null, jwt_payload);
      })
    );
  }
}
