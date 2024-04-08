import { FlowEditorSettingsConfigurations } from "../../flows";

export interface FlowSettingsService {
  fetchFlowSettings(userId: string): Promise<
    Partial<FlowEditorSettingsConfigurations> & {
      _id?: string;
      username?: string;
    }
  >;

  updateFlowSettings(
    userId: string,
    flowSettings: Partial<FlowEditorSettingsConfigurations>
  ): Promise<
    Partial<FlowEditorSettingsConfigurations> & {
      _id?: string;
      username?: string;
    }
  >;
}
