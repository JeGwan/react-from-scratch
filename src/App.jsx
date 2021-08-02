import "./App.css";
import React, { useCallback, useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);
  const handlePlus = useCallback(() => setCount((prev) => prev + 1), []);
  const handleMinus = useCallback(() => setCount((prev) => prev - 1), []);
  return (
    <div>
      <div className="count">{count}</div>
      <div className="buttons">
        <button onClick={handlePlus}>Plus 😀</button>
        <button onClick={handleMinus}>Minus 😡</button>
      </div>
    </div>
  );
};

export default App;
