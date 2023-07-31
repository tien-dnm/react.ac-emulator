export interface ACState {
  temperature: number;
  powerOn: boolean;
  swingOn: boolean;
  light: boolean;
  fanLevel: number;
}
export enum ACActionType {
  POWER_ON = "POWER_ON",
  POWER_OFF = "POWER_OFF",
  POWER_TOGGLE = "POWER_TOGGLE",
  INCREASE_TEMPERATURE = "INCREASE_TEMPERATURE",
  DECREASE_TEMPERATURE = "DECREASE_TEMPERATURE",
  INCREASE_FAN_LEVEL = "INCREASE_FAN_LEVEL",
  DECREASE_FAN_LEVEL = "DECREASE_FAN_LEVEL",
  SWING_ON = "SWING_ON",
  SWING_OFF = "SWING_OFF",
  SWING_TOGGLE = "SWING_TOGGLE",
  LIGHT_ON = "LIGHT_ON",
  LIGHT_OFF = "LIGHT_OFF",
  LIGHT_TOGGLE = "LIGHT_TOGGLE",
}
// An interface for our actions
export interface ACAction {
  type: ACActionType;
}
