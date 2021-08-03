import "./App.css";
import React, { useCallback, useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import useErrorThrower from "./hooks/ErrorThrower";

const Count = () => {
  const [count, setCount] = useState(0);
  const { setError } = useErrorThrower();
  const byErrorThrower = () => {
    try {
      throw Error("이벤트 핸들러에서");
    } catch (e) {
      setError(e);
    }
  };

  const throwError = () => {
    throw Error("이벤트 핸들러에서");
  };
  const handlePlus = useCallback(() => setCount((prev) => prev + 1), []);
  const handleMinus = useCallback(() => setCount((prev) => prev - 1), []);

  useEffect(() => {
    if (count > 6) throw Error("useEffect 에서");
  }, [count]);

  if (count < -1) throw Error("FC 내부에서");
  return (
    <div>
      <div className="count">{count}</div>
      <div className="buttons">
        <button onClick={handlePlus}>Plusasdf 😀</button>
        <button onClick={handleMinus}>Minus 😡</button>
        <button onClick={throwError}>throwError</button>
        <button onClick={byErrorThrower}>byErrorThrower</button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Count />
    </ErrorBoundary>
  );
};

export default App;
