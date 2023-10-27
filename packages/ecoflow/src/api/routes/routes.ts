import { API } from "@eco-flow/types";
import { isSetup } from "../controller/base.controller";
import setupRouter from "./setup";

const routes: API[] = [
  {
    path: "/isSetup",
    methods: ["POST"],
    middleware: [isSetup],
  },
  {
    path: "/setup",
    methods: "Router",
    router: setupRouter,
  },
];

export default routes;
