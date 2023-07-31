import "./app.css";
import "./assets/font.css";
import AirConditioner from "./components/air-conditioner";
import Remote from "./components/remote";
import ACProvider from "./providers/ac-provider";

function App() {
  return (
    <ACProvider>
      <main className="p-2">
        <AirConditioner />
        <Remote />
      </main>
    </ACProvider>
  );
}

export default App;
