import { Builder } from "@eco-flow/utils";
import _ from "lodash";

export default function xssFilterHelper(input: string): string {
  const lt = /</g,
    gt = />/g,
    ap = /'/g,
    ic = /"/g;
  return input
    .toString()
    .replace(lt, "&lt;")
    .replace(gt, "&gt;")
    .replace(ap, "&#39;")
    .replace(ic, "&#34;");
}
