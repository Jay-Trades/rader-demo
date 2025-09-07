import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.Radar) {
      // Initialize Radar
      window.Radar.initialize(
        "prj_test_pk_78144494e566eb75cc2ed0c16d43c3d2528fb24a"
      );
      window.Radar.setUserId("user123");
    }
  }, []);

  const handleTrack = () => {
    console.log("Button clicked");

    if (!window.Radar) {
      console.warn("Radar not loaded");
      return;
    }
    window.Radar.setUserId("jaychen123");

    window.Radar.trackOnce()
      .then(({ status, location, user, events }) => {
        console.log("Track success:");
        console.log({ status, location, user, events });
      })
      .catch((err) => {
        console.error("Radar error:", err);
      });
  };

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <h1>Radar Web SDK Demo</h1>
        <button onClick={handleTrack}>Track Location</button>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
