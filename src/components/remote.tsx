import { useACContext } from "../hooks/use-ac-context";
import { ACActionType } from "../type";
import { cn } from "../utils";
import RemoteButton from "./remote-button";
import remote from "../assets/img/remote.png";
import swinging_icon from "../assets/img/swinging-icon.png";
import no_swing_icon from "../assets/img/no-swing-icon.png";
import remote_light from "../assets/img/remote-light.png";
export default function Remote() {
  const { state, dispatch } = useACContext();
  return (
    <div className="relative w-full max-w-[10rem] mx-auto mt-5 ">
      <img
        className="w-full block "
        src={remote}
        alt="remote"
      />
      {state.powerOn && (
        <div className="absolute w-[70%] top-[8%] left-[15%] h-[31%]">
          <div className="relative w-full h-full">
            <img
              className={cn(
                "w-full absolute top-0",
                state.light ? "block" : "hidden"
              )}
              src={remote_light}
              alt="remote-light"
            />

            <img
              className="absolute w-[25%] top-[5%] left-[5%]"
              src={state.swingOn ? swinging_icon : no_swing_icon}
              alt={state.swingOn ? "swinging-icon" : "no-swing-icon"}
            />
            <span className="font-7-led absolute right-0 bottom-[15%] text-[min(20vw,2.5rem)]">
              {state.temperature}
            </span>
            <div className="absolute bottom-[5%] left-[42%] w-[50%] h-[10%] flex gap-[5%]">
              {Array.from({ length: state.fanLevel }).map((_, i) => {
                return (
                  <div
                    key={i}
                    className="bg-black w-[16%] h-full"></div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <RemoteButton
        title="power-button"
        className="top-[42.7%] left-[13.3%]"
        onClick={() => {
          dispatch({ type: ACActionType.POWER_TOGGLE });
        }}
      />
      <RemoteButton
        title="increase-temperature"
        className="top-[51%] left-[13.3%]"
        onClick={() => {
          dispatch({ type: ACActionType.INCREASE_TEMPERATURE });
        }}
      />
      <RemoteButton
        title="decrease-temperature"
        className="top-[58.9%] left-[13.3%]"
        onClick={() => {
          dispatch({ type: ACActionType.DECREASE_TEMPERATURE });
        }}
      />
      <RemoteButton
        title="swing-button"
        className="top-[42.7%] right-[12%]"
        onClick={() => {
          dispatch({ type: ACActionType.SWING_TOGGLE });
        }}
      />
      <RemoteButton
        title="increase-fan-level"
        className="top-[51%] right-[12%]"
        onClick={() => {
          dispatch({ type: ACActionType.INCREASE_FAN_LEVEL });
        }}
      />
      <RemoteButton
        title="decrease-fan-level"
        className="top-[58.9%] right-[12%]"
        onClick={() => {
          dispatch({ type: ACActionType.DECREASE_FAN_LEVEL });
        }}
      />
    </div>
  );
}
