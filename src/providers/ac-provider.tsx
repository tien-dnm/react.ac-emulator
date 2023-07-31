import * as React from "react";
import { ACState, ACAction, ACActionType } from "../type";
import ac_running_sound from "../assets/audio/ac-running-sound.mp3";
import remote_beep_sound from "../assets/audio/remote-beep-sound.mp3";
const acRunningSound = new Audio(ac_running_sound);
const remoteBeepSound = new Audio(remote_beep_sound);
enum ACConfig {
  MIN_TEMPERATURE = 17,
  MAX_TEMPERATURE = 30,
  MIN_FAN_LEVEL = 1,
  MAX_FAN_LEVEL = 5,
}
acRunningSound.addEventListener(
  "ended",
  function () {
    this.currentTime = 0;
    this.play();
  },
  false
);

const playACRunningSound = () => {
  acRunningSound.play();
};
const stopACRunningSound = () => {
  acRunningSound.pause();
  acRunningSound.currentTime = 0;
};
const playRemoteBeepSound = () => {
  remoteBeepSound.pause();
  remoteBeepSound.currentTime = 0;
  remoteBeepSound.volume = 0.1;
  remoteBeepSound.play();
};

function ACReducer(state: ACState, action: ACAction): ACState {
  switch (action.type) {
    case ACActionType.POWER_ON:
      playRemoteBeepSound();
      playACRunningSound();
      return { ...state, powerOn: true, light: true };
    case ACActionType.POWER_OFF:
      playRemoteBeepSound();
      stopACRunningSound();
      return { ...state, powerOn: false, light: false };
    case ACActionType.POWER_TOGGLE:
      playRemoteBeepSound();
      if (!state.powerOn) {
        playACRunningSound();
      } else {
        stopACRunningSound();
      }
      return { ...state, powerOn: !state.powerOn, light: !state.powerOn };
    case ACActionType.LIGHT_ON:
      return { ...state, light: true };
    case ACActionType.LIGHT_OFF:
      return { ...state, light: false };
    case ACActionType.LIGHT_TOGGLE:
      return { ...state, light: !state.light };
    case ACActionType.SWING_ON:
      if (!state.powerOn) return state;
      playRemoteBeepSound();
      return { ...state, swingOn: true };
    case ACActionType.SWING_OFF:
      if (!state.powerOn) return state;
      playRemoteBeepSound();
      return { ...state, swingOn: false };
    case ACActionType.SWING_TOGGLE:
      if (!state.powerOn) return state;
      playRemoteBeepSound();
      return { ...state, swingOn: !state.swingOn, light: true };
    case ACActionType.INCREASE_TEMPERATURE:
      if (!state.powerOn) return state;
      playRemoteBeepSound();
      if (state.temperature < ACConfig.MAX_TEMPERATURE) {
        return { ...state, temperature: state.temperature + 1, light: true };
      }
      return { ...state, light: true };
    case ACActionType.DECREASE_TEMPERATURE:
      if (!state.powerOn) return state;
      playRemoteBeepSound();
      if (state.temperature > ACConfig.MIN_TEMPERATURE) {
        return { ...state, temperature: state.temperature - 1, light: true };
      }
      return { ...state, light: true };
    case ACActionType.INCREASE_FAN_LEVEL:
      if (!state.powerOn) return state;
      playRemoteBeepSound();
      if (state.fanLevel < ACConfig.MAX_FAN_LEVEL) {
        return { ...state, fanLevel: state.fanLevel + 1, light: true };
      }
      return { ...state, light: true };
    case ACActionType.DECREASE_FAN_LEVEL:
      if (!state.powerOn) return state;
      playRemoteBeepSound();
      if (state.fanLevel > ACConfig.MIN_FAN_LEVEL) {
        return { ...state, fanLevel: state.fanLevel - 1, light: true };
      }
      return { ...state, light: true };
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
const initialState: ACState = {
  temperature: 17,
  powerOn: false,
  light: false,
  fanLevel: 4,
  swingOn: false,
};
export const ACContext = React.createContext({
  state: initialState,
  dispatch: (param: ACAction) => {
    param;
  },
  swingElement: null as React.RefObject<HTMLImageElement> | null,
});

//----------------------------
let lightTimeout = 0;
let powerOnInterval = 0;
let swingBack = false;
let swingDeg = 0;
export default function ACProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(ACReducer, initialState);
  const swingElement = React.useRef<HTMLImageElement>(null);
  // auto turn off backlight after turning on
  React.useEffect(() => {
    if (state.light) {
      lightTimeout = setTimeout(() => {
        dispatch({ type: ACActionType.LIGHT_OFF });
      }, 1000);
      return () => {
        clearTimeout(lightTimeout);
      };
    }
  }, [state.light, state.fanLevel, state.temperature, state.swingOn]);

  // Setting the volume of the `acRunningSound` audio based on the value of the fanLevel state .
  React.useEffect(() => {
    if (!state.powerOn) {
      acRunningSound.volume = 0;
      return;
    }
    if (state.fanLevel === ACConfig.MAX_FAN_LEVEL) {
      acRunningSound.volume = 1;
    } else {
      acRunningSound.volume = state.fanLevel / 5 + 0.1;
    }
  }, [state.powerOn, state.fanLevel]);

  React.useEffect(() => {
    if (state.powerOn) {
      // khi bật máy lạnh
      if (state.swingOn) {
        // nếu chế độ swing bật
        powerOnInterval = setInterval(() => {
          // di chuyển cánh gió từ 0 đến 180 và quay lại
          const swing = swingElement.current;
          if (!swing) return clearInterval(powerOnInterval);
          if (swingBack) {
            if (swingDeg === 0) {
              swingBack = false;
            }
            swingDeg--;
          } else {
            if (swingDeg === 180) {
              swingBack = true;
            }
            swingDeg++;
          }
          swing.style.transform = `rotateX(${swingDeg}deg)`;
        }, 30);
      } else {
        // nếu chế độ swing tắt
        powerOnInterval = setInterval(() => {
          // nếu độ mở cánh gió < 70 thì set cho nó về 70 rồi mới clear (để cánh mở to hơn 😁)
          const swing = swingElement.current;
          if (!swing) return clearInterval(powerOnInterval);
          if (swingDeg >= 70) return clearInterval(powerOnInterval);
          if (swingDeg < 70) {
            swingDeg++;
          }
          swing.style.transform = `rotateX(${swingDeg}deg)`;
        }, 30);
      }
    } else {
      // khi tắt máy lạnh
      powerOnInterval = setInterval(() => {
        // vòng lặp chuyển cánh gió về 0 rồi huỷ vòng lặp
        const swing = swingElement.current;
        if (!swing) return clearInterval(powerOnInterval);
        if (swingDeg === 0) return clearInterval(powerOnInterval);
        swingDeg--;
        swing.style.transform = `rotateX(${swingDeg}deg)`;
      }, 30);
    }
    return () => {
      clearInterval(powerOnInterval);
    };
  }, [state.powerOn, state.swingOn]);

  // return provider
  return (
    <ACContext.Provider
      value={{
        state,
        dispatch,
        swingElement,
      }}>
      {children}
    </ACContext.Provider>
  );
}
