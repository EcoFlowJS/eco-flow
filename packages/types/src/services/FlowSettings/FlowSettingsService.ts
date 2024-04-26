import { FlowEditorSettingsConfigurations } from "../../flows";

export interface FlowSettingsService {
  fetchAllFlowSettings(): Promise<
    (Partial<FlowEditorSettingsConfigurations> & {
      _id?: string;
      username?: string;
    })[]
  >;

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
