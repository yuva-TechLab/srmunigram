
import React, { useState } from "react";
import LogoAnimation from "./components/LogoAnimation";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [showAnimation, setShowAnimation] = useState(true);

  if (showAnimation) {
    return <LogoAnimation onComplete={() => setShowAnimation(false)} />;
  }

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
