import { FlowsConfigurations } from "./EcoFlowEditor";

export interface EcoFLowBuilder {
  build(flowConfigurations: FlowsConfigurations): Promise<void>;
}
