import { useACContext } from "../hooks/use-ac-context";

export default function AirConditioner() {
  const { state, swingElement } = useACContext();
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <img
        className="w-full"
        src="/img/ac.png"
        alt="air-conditioner"
      />
      <img
        ref={swingElement}
        className="absolute w-[81.5%] left-[4.5%] bottom-0"
        src="/img/swing.png"
        alt="swing"
      />
      {state.powerOn && (
        <span className="font-7-led absolute bottom-[45%] right-[12%] text-white">
          {state.temperature}
        </span>
      )}
    </div>
  );
}
