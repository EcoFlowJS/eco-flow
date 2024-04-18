import { EcoAPIBuilder as IEcoAPIBuilder } from "@ecoflow/types";
import Router from "@koa/router";
import { DefaultContext, DefaultState } from "koa";

export class EcoAPIBuilder<StateT = DefaultState, ContextT = DefaultContext>
  extends Router
  implements IEcoAPIBuilder
{
  constructor(opt?: Router.RouterOptions) {
    super(opt);
  }
}
