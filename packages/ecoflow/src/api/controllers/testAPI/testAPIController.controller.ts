import { Context } from "koa";

const testAPIController = async (ctx: Context) => {
  // console.log(ecoFlow.ecoModule.getModule("9efab2399c7c560b34de477b9aa0a465"));
  // console.log(ecoFlow.ecoModule.getNodes("76a24d0fb415cc7ef92bdaec41aca1c8"));
  // console.log(ecoFlow.ecoModule.getNodes());

  // await ecoFlow.ecoModule.removeModule("ecoflow_functions");
  ctx.body = ecoFlow.ecoModule.getModule();
};

// const testAPIController = (log: string) => {
//   return async (ctx: Context) => {
//     ctx.body = log;
//   };
// };

export default testAPIController;
