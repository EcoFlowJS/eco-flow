import Helper from "@ecoflow/helper";
import { Context } from "koa";

const testAPIController = async (ctx: Context) => {
  // console.log(ecoFlow.ecoModule.getModule("9efab2399c7c560b34de477b9aa0a465"));
  // console.log(ecoFlow.ecoModule.getNodes("76a24d0fb415cc7ef92bdaec41aca1c8"));
  // console.log(ecoFlow.ecoModule.getNodes());

  // await ecoFlow.ecoModule.installModule("ecoflow_functions");
  // ctx.body = await ecoFlow.ecoModule.getNodes();
  // ctx.body = await Helper.installPackageHelper(
  //   "P:/aditi",
  //   "ecoflow_common@0.0.2"
  // );
  ctx.body = "";
};

// function ctnt(this: any, ctx: Context) {
//   ctx.body = this;
// }

// const testAPIController = (logg: string) => ctnt.bind({ logg });

export default testAPIController;
