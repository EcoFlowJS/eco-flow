import { EcoServer } from "@eco-flow/types";
import session from "koa-session";
import { Strategy as LocalStrategy, IStrategyOptions } from "passport-local";
import passport from "koa-passport";

export class Passport {
  private svr: EcoServer;
  private options: IStrategyOptions;
  private passport: typeof passport;
  constructor(svr: EcoServer, options: IStrategyOptions = {}) {
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
      new LocalStrategy(this.options, (username, password, done) => {
        done(null, username);
      })
    );
  }
}
