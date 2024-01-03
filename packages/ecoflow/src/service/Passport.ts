import { EcoServer } from "@eco-flow/types";
import session from "koa-session";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import passport from "koa-passport";

export class Passport {
  private svr: EcoServer;
  private options: StrategyOptions;
  private passport: typeof passport;
  constructor(
    svr: EcoServer,
    options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ECOFLOW_SYS_TOKEN_SALT,
    }
  ) {
    this.svr = svr;
    this.options = options;
    this.passport = svr.passport;
  }

  init() {
    this.initStrategy();
    this.svr.keys = process.env.ECOFLOW_SYS_TOKEN_SECRET!.split(",");
    this.svr.use(session(this.svr));
    this.svr.use(this.passport.initialize());
    this.svr.use(this.passport.session());
  }

  private initStrategy() {
    this.passport.serializeUser((user: any, done) => {
      done(null, user);
    });

    this.passport.deserializeUser(function (user: string, done) {
      done(null, user);
    });

    this.passport.use(
      "_ecoFlowPassport",
      new JwtStrategy(this.options, (jwt_payload, done) => {
        done(null, jwt_payload);
      })
    );
  }
}
